import { capitalize } from 'fogg-utils'
import moment from 'moment-timezone'
import { LeanDocument } from 'mongoose'
import path from 'path'
import fs from 'fs'
// @ts-ignore
import { fromFileAsync } from 'xlsx-populate'
import {
  IContact,
  IEvent,
  ILocation,
  IUser,
  ILocationEntries,
  IWorker,
  IAuthenticator,
  IApps
} from '../interfaces'
import { typeQr } from '../interfaces/valuesAddQr'
import PDFDocument from 'pdfkit-table'
const getHost = (render: ILocationEntries): string => {
  switch (render.typeQr) {
    case typeQr.event:
      return `${((render?.event as IEvent)?.host as IUser)?.name} ${
        ((render?.event as IEvent)?.host as IUser)?.lastname
      }`
    case typeQr.worker:
      return '-'
    case typeQr.worker_temporal:
      return '-'
    case typeQr.user_temporal:
      return '-'
    case typeQr.eventExpress:
      return `${((render?.eventExpress as any)?.host as any)?.name} ${
        ((render?.eventExpress as any)?.host as any)?.lastname
      }`
  }
  return ''
}

const getName = (render: ILocationEntries) => {
  switch (render.typeQr) {
    case typeQr.event:
      return (render.contact as IContact)?.firstName
    case typeQr.worker:
      return `${(render.worker as IWorker)?.name}`
    case typeQr.worker_temporal:
      return `${(render.worker as IWorker)?.name}`
    case typeQr.user_temporal:
      return `${(render.user as IUser)?.name}`
    case typeQr.eventExpress:
      return (render.contact as IContact)?.firstName
  }
  return ''
}
const getLastName = (render: ILocationEntries) => {
  switch (render.typeQr) {
    case typeQr.event:
      return (render.contact as IContact)?.lastName
    case typeQr.worker:
      return `${(render.worker as IWorker)?.lastname}`
    case typeQr.worker_temporal:
      return `${(render.worker as IWorker)?.lastname}`
    case typeQr.user_temporal:
      return `${(render.user as IUser)?.lastname}`
    case typeQr.eventExpress:
      return (render.contact as IContact)?.lastName
  }
  return ''
}
const getType = (type: typeQr) => {
  switch (type) {
    case typeQr.event:
      return 'Evento'
    case typeQr.worker:
      return 'Trabajador'
    case typeQr.worker_temporal:
      return 'Trabajador'
    case typeQr.user_temporal:
      return 'Usuario'
    case typeQr.eventExpress:
      return 'Evento express'
  }
  return ''
}
export const getDpi = (render?: ILocationEntries) => {
  switch (render?.typeQr) {
    case typeQr.event:
      return (render?.contact as IContact)?.DPI
    case typeQr.worker:
      return `${(render?.worker as IWorker)?.document}`
    case typeQr.worker_temporal:
      return `${(render?.worker as IWorker)?.document}`
    case typeQr.user_temporal:
      return `${(render?.user as IUser)?.document}`
    case typeQr.eventExpress:
      return (render?.contact as IContact)?.DPI
  }
  return ''
}

export const generateReport = async (data: ILocationEntries[]): Promise<string | Error> => {
  const file = path.join(__dirname, `/Reportes-plantilla.xlsx`)
  return new Promise((resolve, reject) => {
    fromFileAsync(file)
      .then((workbook: any) => {
        const ws = workbook.sheet(0)
        var count = 1
        data.forEach(register => {
          count = count + 1
          ws.cell(`A${count}`).value(getType(register.typeQr))
          ws.cell(`B${count}`).value(
            moment.tz(register.createdAt, 'America/Guatemala').format('YYYY-MM-DD')
          )
          ws.cell(`C${count}`).value(
            register.hourIn
              ? moment.tz(register.hourIn, 'America/Guatemala').format('YYYY-MM-DD, hh:mm:ss a')
              : '-'
          )
          ws.cell(`D${count}`).value(
            register.hourOut
              ? moment.tz(register.hourOut, 'America/Guatemala').format('YYYY-MM-DD, hh:mm:ss a')
              : '-'
          )
          ws.cell(`E${count}`).value(getHost(register))
          ws.cell(`F${count}`).value((register?.location as ILocation)?.name)
          ws.cell(`G${count}`).value(getName(register))
          ws.cell(`H${count}`).value(getLastName(register))
          ws.cell(`I${count}`).value(getDpi(register))
        })

        const filename = `reporte_general_${moment().format()}.xlsx`

        var pathSave = path.join(__dirname, `/generated/reporte_general_${moment().format()}.xlsx`)
        workbook
          .toFileAsync(pathSave)
          .then(() => resolve(filename))
          .catch((err: any) => {
            console.error(err)
            reject(new Error(err))
          })
      })
      .catch((err: any) => {
        console.error(err)
        reject(new Error(err))
      })
  })
}

const type = {
  I: 'Invitado',
  R: 'Residente',
  V: 'Visitante'
}

export const generateReportSecurity = async (data: LeanDocument<any[]>): Promise<string> => {
  const file = path.join(__dirname, `/Reportes-plantilla-seguridad.xlsx`)
  return new Promise((resolve, reject) => {
    fromFileAsync(file)
      .then((workbook: any) => {
        const ws = workbook.sheet(0)
        var count = 1
        data.forEach(register => {
          count = count + 1
          ws.cell(`A${count}`).value(getType(register.typeQr))
          ws.cell(`B${count}`).value(
            moment.tz(register.createdAt, 'America/Guatemala').format('YYYY-MM-DD')
          )
          ws.cell(`C${count}`).value(
            register.hourIn
              ? moment.tz(register.hourIn, 'America/Guatemala').format('YYYY-MM-DD, hh:mm:ss a')
              : '-'
          )
          ws.cell(`D${count}`).value(
            register.hourOut
              ? moment.tz(register.hourOut, 'America/Guatemala').format('YYYY-MM-DD, hh:mm:ss a')
              : '-'
          )
          ws.cell(`E${count}`).value(getHost(register))
          ws.cell(`F${count}`).value(register?.location?.name)
          ws.cell(`G${count}`).value(getName(register))
          ws.cell(`H${count}`).value(getLastName(register))
          ws.cell(`I${count}`).value(getDpi(register))
        })

        const filename = `reporte_seguridad_${moment().format()}.xlsx`
        var pathSave = path.join(
          __dirname,
          `/generated/reporte_seguridad_${moment().format()}.xlsx`
        )
        workbook
          .toFileAsync(pathSave)
          .then(() => resolve(filename))
          .catch((err: any) => {
            console.error(err)
            reject(new Error(err))
          })
      })
      .catch((err: any) => {
        console.error(err)
        reject(new Error(err))
      })
  })
}

export const convertToPdfSecurity = async (data: toGenerateReport[]): Promise<string> => {
  const time = moment().format()
  const filename = `reporte_seguridad_${time}.pdf`
  var output = path.join(__dirname, `/generated/reporte_seguridad_${time}.pdf`)
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 10, size: 'A4' })
      doc.pipe(fs.createWriteStream(output))
      const table = {
        headers: [
          'TIPO',
          'FECHA',
          'ENTRADA',
          'SALIDA',
          'ANFITRIÓN',
          'LOCACIÓN',
          'NOMBRE',
          'APELLIDO',
          'DPI'
        ].map(e => ({
          label: e,
          backgroundColor: 'white',
          headerColor: '#173d6e',
          headerOpacity: 1,
          backgroundOpacity: 1,
          align: 'center'
        })),
        rows: data.map(register => [
          getType(register.typeQr),
          moment.tz(register.createdAt, 'America/Guatemala').format('YYYY-MM-DD'),
          register.hourIn
            ? moment.tz(register.hourIn, 'America/Guatemala').format('YYYY-MM-DD, hh:mm:ss a')
            : '-',
          register.hourOut
            ? moment.tz(register.hourOut, 'America/Guatemala').format('YYYY-MM-DD, hh:mm:ss a')
            : '-',
          getHost(register),
          (register?.location as ILocation)?.name,
          getName(register),
          getLastName(register),
          getDpi(register)
        ])
      }
      // options
      const options = {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(8).fillColor('white')
      }
      // callback
      const callback = () => {
        resolve(filename)
      }
      // the magic
      doc.table(table, options, callback) // is a Promise to async/await function

      // done!
      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

interface toGenerateReport extends IAuthenticator {
  finalUser: IWorker | IUser
}

export const generateReportAuthenticator = async (data: toGenerateReport[]): Promise<string> => {
  const file = path.join(__dirname, `/Reportes-plantilla-autenticacion.xlsx`)
  return new Promise((resolve, reject) => {
    fromFileAsync(file)
      .then((workbook: any) => {
        const ws = workbook.sheet(0)
        var count = 1
        data.forEach(register => {
          count = count + 1
          ws.cell(`A${count}`).value((register.app as IApps)?.name)
          ws.cell(`B${count}`).value(register.finalUser?.name)
          ws.cell(`C${count}`).value(register.finalUser?.lastname)
          ws.cell(`D${count}`).value(register.finalUser?.email)
          ws.cell(`E${count}`).value(register.finalUser?.document)
          ws.cell(`F${count}`).value(
            moment.tz(register.createdAt, 'America/Guatemala').format('DD/MM/YYYY hh:mm A')
          )
        })

        const filename = `reporte_autenticaciones_${moment().format()}.xlsx`
        var pathSave = path.join(
          __dirname,
          `/generated/reporte_autenticaciones_${moment().format()}.xlsx`
        )
        workbook
          .toFileAsync(pathSave)
          .then(() => resolve(filename))
          .catch((err: any) => {
            console.error(err)
            reject(new Error(err))
          })
      })
      .catch((err: any) => {
        console.error(err)
        reject(new Error(err))
      })
  })
}

export const convertToPdf = async (data: toGenerateReport[]): Promise<string> => {
  const time = moment().format()
  const filename = `reporte_autenticaciones_${time}.pdf`
  var output = path.join(__dirname, `/generated/reporte_autenticaciones_${time}.pdf`)
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 10, size: 'A4' })
      doc.pipe(fs.createWriteStream(output))
      const table = {
        headers: ['APLICACIÓN', 'NOMBRE', 'APELLIDO', 'EMAIL', 'DOCUMENTO', 'FECHA'].map(e => ({
          label: e,
          backgroundColor: 'white',
          headerColor: '#173d6e',
          headerOpacity: 1,
          backgroundOpacity: 1,
          align: 'center'
        })),
        rows: data.map(register => [
          (register.app as IApps)?.name,
          register.finalUser?.name,
          register.finalUser?.lastname,
          register.finalUser?.email,
          register.finalUser?.document,
          moment.tz(register.createdAt, 'America/Guatemala').format('DD/MM/YYYY hh:mm A')
        ])
      }
      // options
      const options = {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(8).fillColor('white')
      }
      // callback
      const callback = () => {
        resolve(filename)
      }
      // the magic
      doc.table(table, options, callback) // is a Promise to async/await function

      // done!
      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

interface toGenerateReport extends ILocationEntries {
  finalUser: IWorker | IUser
}

export const convertToPdfLocationEntries = async (data: toGenerateReport[]): Promise<string> => {
  const time = moment().format()
  const filename = `reporte_autenticaciones_${time}.pdf`
  var output = path.join(__dirname, `/generated/reporte_autenticaciones_${time}.pdf`)
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 10, size: 'A4' })
      doc.pipe(fs.createWriteStream(output))
      const table = {
        headers: [
          'TIPO',
          'FECHA',
          'ENTRADA',
          'SALIDA',
          'ANFITRIÓN',
          'LOCACIÓN',
          'NOMBRE',
          'APELLIDO',
          'DPI'
        ].map(e => ({
          label: e,
          backgroundColor: 'white',
          headerColor: '#173d6e',
          headerOpacity: 1,
          backgroundOpacity: 1,
          align: 'center'
        })),
        rows: data.map(register => [
          getType(register.typeQr),
          moment.tz(register.createdAt, 'America/Guatemala').format('YYYY-MM-DD'),
          register.hourIn
            ? moment.tz(register.hourIn, 'America/Guatemala').format('YYYY-MM-DD, hh:mm:ss a')
            : '-',
          register.hourOut
            ? moment.tz(register.hourOut, 'America/Guatemala').format('YYYY-MM-DD, hh:mm:ss a')
            : '-',
          getHost(register),
          (register?.location as ILocation)?.name,
          getName(register),
          getLastName(register),
          getDpi(register)
        ])
      }
      // options
      const options = {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(8).fillColor('white')
      }
      // callback
      const callback = () => {
        resolve(filename)
      }
      // the magic
      doc.table(table, options, callback) // is a Promise to async/await function

      // done!
      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

const getUserBreanch = (record: any) => {
  if (record.user) {
    return `${record.user.name} ${record.user.lastname}`
  } else if (record.contact) {
    return `${record.contact.firstName} ${record.contact.lastName}`
  } else if (record.worker) {
    return `${record.worker.name} ${record.worker.lastname}`
  } else {
    return '-'
  }
}

const getNativeLoc = (record: any) => {
  if (record.user) {
    return record.user.nativeLocation
      ? `${record.user.nativeLocation[0] ? record.user.nativeLocation[0].name : '-'}`
      : `-`
  } else if (record.worker) {
    return record.worker.nativeLocation
      ? `${record.worker.nativeLocation[0] ? record.worker.nativeLocation[0].name : '-'}`
      : `-`
  } else {
    return `-`
  }
}

export const generateReportBreach = async (data: any[]): Promise<string | Error> => {
  const file = path.join(__dirname, `/Reportes-plantilla-riesgo.xlsx`)
  return new Promise((resolve, reject) => {
    fromFileAsync(file)
      .then((workbook: any) => {
        const ws = workbook.sheet(0)
        var count = 1
        data.forEach(register => {
          count = count + 1
          ws.cell(`A${count}`).value(
            register.createdAt
              ? moment.tz(register.createdAt, 'America/Guatemala').format('YYYY-MM-DD, hh:mm:ss a')
              : '-'
          )
          ws.cell(`B${count}`).value(register.grade)
          ws.cell(`C${count}`).value((register?.location as ILocation)?.name)
          ws.cell(`D${count}`).value(getUserBreanch(register))
          ws.cell(`E${count}`).value(getNativeLoc(register))
        })

        const filename = `reporte_general_${moment().format()}.xlsx`

        var pathSave = path.join(__dirname, `/generated/reporte_general_${moment().format()}.xlsx`)
        workbook
          .toFileAsync(pathSave)
          .then(() => resolve(filename))
          .catch((err: any) => {
            console.error(err)
            reject(new Error(err))
          })
      })
      .catch((err: any) => {
        console.error(err)
        reject(new Error(err))
      })
  })
}

export const generateReportBreachPDF = async (data: any[]): Promise<string | Error> => {
  const time = moment().format()
  const filename = `reporte_autenticaciones_${time}.pdf`
  var output = path.join(__dirname, `/generated/reporte_autenticaciones_${time}.pdf`)
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 10, size: 'A4' })
      doc.pipe(fs.createWriteStream(output))
      const table = {
        headers: ['FECHA', 'GRADO', 'LOCACIÓN', 'USUARIO', 'LOCACIÓN NATIVA'].map(e => ({
          label: e,
          backgroundColor: 'white',
          headerColor: '#173d6e',
          headerOpacity: 1,
          backgroundOpacity: 1,
          align: 'center'
        })),
        rows: data.map(register => [
          register.createdAt
            ? moment.tz(register.createdAt, 'America/Guatemala').format('YYYY-MM-DD, hh:mm:ss a')
            : '-',
          register.grade,
          (register?.location as ILocation)?.name,
          getUserBreanch(register),
          getNativeLoc(register)
        ])
      }
      // options
      const options = {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(8).fillColor('white')
      }
      // callback
      const callback = () => {
        resolve(filename)
      }
      // the magic
      doc.table(table, options, callback) // is a Promise to async/await function

      // done!
      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}
