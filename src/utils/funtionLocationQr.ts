import {
  Days,
  IContact,
  IEvent,
  IEventExpress,
  IGroupWorker,
  IInvitationEvent,
  IInvitationEvent as invitationType,
  ILocation,
  ILocationAttempt,
  IMasterLocation,
  iTimeZone,
  ITreeMaster,
  IUser,
  IWorker,
  QrUses as QrUserInterface
} from 'interfaces'
import _ from 'lodash'
// functions
import moment from 'moment-timezone'
import { typeQr } from '../interfaces/valuesAddQr'
import contact from '../models/contact'
import device from '../models/device'
import event from '../models/event'
import eventExpress from '../models/eventExpress'
import InvitationEvent from '../models/InvitationEvent'
import Location from '../models/location'
import locationAttempt from '../models/locationAttempt'
import locationEntries from '../models/locationEntries'
import masterLocation from '../models/masterLocation'
import QrUses from '../models/QrUses'
import users from '../models/users'
import worker from '../models/worker'
import worker_qr_temporal from '../models/worker_qr_temporal'
import { callRisks } from './risks'
import { toUpdateSecurity, updateEventExpress } from './subscriptions/sendPub'
import { verifyTime } from './utils'

const getLocation = async (
  locationSerial: string
): Promise<{ ok: boolean; master: IMasterLocation; location: ILocation; msg?: string }> => {
  try {
    const actualDevice = JSON.parse(
      JSON.stringify(
        await device
          .findOne({
            serialNumber: { $eq: locationSerial }
          })
          .lean()
          .populate('actualLocation')
      )
    )
    if (!actualDevice?.actualLocation) {
      //console.log('55')
      return { ok: false, location: null, master: null, msg: 'No encontrado' }
    }
    const actualMasterLocation = JSON.parse(
      JSON.stringify(
        await masterLocation.findOne({ _id: actualDevice.actualLocation.masterLocation }).lean()
      )
    )
    if (!actualDevice || !actualMasterLocation) {
      //console.log('65')
      return { ok: false, location: null, master: null, msg: 'No encontrado' }
    }
    return {
      ok: true,
      master: actualMasterLocation,
      location: actualDevice.actualLocation
    }
  } catch (error) {
    console.error(error)
    return { ok: false, master: null, location: null, msg: 'Error con locacion' }
  }
}

const getQrValue = async (
  QRValue: string
): Promise<{ ok: boolean; Qr: string; type: typeQr; numVis: string }> => {
  try {
    const type = QRValue.split('-')[0] as typeQr
    let Qr
    let numVis = ''
    if (type !== typeQr.eventExpress) {
      Qr =
        QRValue.split('-').length > 2
          ? QRValue.split('-')
              .slice(1, QRValue.length - 1)
              .join('-')
          : QRValue.split('-')[1]
    } else {
      Qr = QRValue.split('-')[1].split('-$')[0]
      numVis = QRValue.split('-$')[1]
    }

    if (!Object.values(typeQr).includes(type)) {
      return {
        ok: false,
        Qr: null,
        type: null,
        numVis: ''
      }
    }
    return { ok: true, Qr, type, numVis }
  } catch (error) {
    return { ok: false, Qr: null, type: null, numVis: '' }
  }
}

const getContact = async (id: string): Promise<{ ok: boolean; msg: string; contact: IContact }> => {
  const actualContact: IContact = JSON.parse(JSON.stringify(await contact.findById(id)))
  if (!actualContact) {
    return { ok: false, msg: 'Contacto no encontrado', contact: null }
  }

  return { ok: true, msg: null, contact: actualContact }
}

const getEvent = async (id: string): Promise<{ ok: boolean; msg: string; event: IEvent }> => {
  const actualEvent: IEvent = JSON.parse(
    JSON.stringify(await event.findById(id).populate('location'))
  )
  if (!actualEvent) {
    return { ok: false, msg: 'Evento no encontrado', event: null }
  }

  if (actualEvent.state === 'deleted') {
    return {
      ok: false,
      msg: `Este evento fue eliminado`,
      event: null
    }
  }
  return { ok: true, msg: null, event: actualEvent }
}

const createAttemptSuccessContact = async (
  actualContact: IContact,
  actualLocation: ILocation,
  typeEvent: typeQr
) => {
  const prevAttempt = await locationAttempt.findOne({
    authenticated: false,
    contact: actualContact._id,
    location: actualLocation._id,
    type: typeEvent
  })
  if (prevAttempt) {
    await locationAttempt.findByIdAndUpdate(prevAttempt._id, {
      authenticated: true
    })
  } else {
    const newAttempt = new locationAttempt({
      authenticated: true,
      contact: actualContact._id,
      location: actualLocation._id,
      type: typeEvent,
      attempts: 0
    })
    await newAttempt.save()
  }
}

const createAttemptSuccessWorker = async (
  actualWorker: IWorker,
  actualLocation: ILocation,
  typeEvent: typeQr
) => {
  const prevAttempt = await locationAttempt.findOne({
    authenticated: false,
    worker: actualWorker._id,
    location: actualLocation._id,
    type: typeEvent
  })
  if (prevAttempt) {
    await locationAttempt.findByIdAndUpdate(prevAttempt._id, {
      authenticated: true
    })
  } else {
    const newAttempt = new locationAttempt({
      authenticated: true,
      worker: actualWorker._id,
      location: actualLocation._id,
      type: typeEvent,
      attempts: 0
    })
    await newAttempt.save()
  }
}

const createAttemptSuccessUser = async (
  actualUser: IUser,
  actualLocation: ILocation,
  typeEvent: typeQr
) => {
  const prevAttempt = await locationAttempt.findOne({
    authenticated: false,
    user: actualUser._id,
    location: actualLocation._id,
    type: typeEvent
  })
  if (prevAttempt) {
    await locationAttempt.findByIdAndUpdate(prevAttempt._id, {
      authenticated: true
    })
  } else {
    const newAttempt = new locationAttempt({
      authenticated: true,
      user: actualUser._id,
      location: actualLocation._id,
      type: typeEvent,
      attempts: 0
    })
    await newAttempt.save()
  }
}

const validateEvent = async (
  QrCode: string,
  actualLocation: ILocation,
  actualMaster: IMasterLocation
): Promise<{
  ok: boolean
  msg: string
  dest: ILocation
  data?: IEvent
}> => {
  try {
    const actualInvitationEvent: IInvitationEvent = JSON.parse(
      JSON.stringify(await InvitationEvent.findById(QrCode).populate('location'))
    )

    const contactResp = await getContact(actualInvitationEvent.contact as string)
    if (!contactResp.ok) {
      return { ok: false, msg: contactResp.msg, dest: null }
    }
    const actualContact = contactResp.contact

    // SE REVISA SI EL CONTACTO ESTA BANEADO Y NO SE DEJA PASAR
    if (actualContact.banFinish) {
      if (moment().isAfter(actualContact.banFinish)) {
        await contact.findByIdAndUpdate(actualContact._id, { banFinish: null })
      } else {
        return {
          ok: false,
          msg: 'Ha excedido el número de intentos, contacte a un administrador',
          dest: null
        }
      }
    }

    if (!actualInvitationEvent) {
      return { ok: false, msg: 'Invitación no encontrada', dest: null }
    }
    const event = await getEvent(actualInvitationEvent.event as string)
    if (!event.ok) {
      return { ok: false, msg: event.msg, dest: null }
    }
    const actualEvent = event.event

    if (!verifyTime(actualEvent)) {
      return {
        ok: false,
        msg: `Fuera de la hora de ingreso`,
        dest: null
      }
    }
    var onlyAuth = false
    actualMaster.onlyAllowAuthUSers && (onlyAuth = true)
    actualEvent.onlyAuthUser && (onlyAuth = true)
    if (onlyAuth) {
      if (!actualContact.verified) {
        return { ok: false, msg: 'Usuario no verificado, por favor verificate', dest: null }
      }
    }
    // accesso verificado
    return { ok: true, msg: null, dest: actualEvent.location as ILocation, data: actualEvent }
  } catch (error) {
    return { ok: false, msg: 'Invitación no encontrada', dest: null }
  }
}

const getConnections = (elements: ITreeMaster[], masterId: string) => {
  //console.log(elements)
  return elements.filter(e => e.type === 'buttonedge' && e.source !== masterId)
}

type connectionLocation = {
  connection: ITreeMaster
  location: ILocation
}

type targetConnection = {
  actual: connectionLocation
  parent: targetConnection[]
  pos: number
}

const locationGetParent = async (
  location: ILocation,
  master: IMasterLocation
): Promise<connectionLocation[]> => {
  const connections = getConnections(master.tree, master._id)
  const parent = connections.filter(e => e.target === location._id)
  return await Promise.all(
    parent.map(async e => ({
      connection: e,
      location: JSON.parse(JSON.stringify(await Location.findById(e.source)))
    }))
  )
}

const locationGetChild = async (
  location: ILocation,
  master: IMasterLocation
): Promise<connectionLocation[]> => {
  const connections = getConnections(master.tree, master._id)
  const parent = connections.filter(e => e.source === location._id)
  return await Promise.all(
    parent.map(async e => ({
      connection: e,
      location: JSON.parse(JSON.stringify(await Location.findById(e.target)))
    }))
  )
}

const retryTarget = async (
  master: IMasterLocation,
  location: ILocation,
  pos: number
): Promise<targetConnection[]> => {
  const parent = await locationGetParent(location, master)
  let value = []
  if (parent.length > 0) {
    for (let k = 0; k < parent.length; k++) {
      const newParent = await retryTarget(master, parent[k].location, pos + 1)
      value.push({
        actual: parent[k],
        parent: newParent ? newParent : null,
        pos
      })
    }
  }
  return value
}

const retryTargetChildren = async (
  master: IMasterLocation,
  location: ILocation,
  pos: number
): Promise<targetConnection[]> => {
  const parent = await locationGetChild(location, master)
  let value = []
  if (parent.length > 0) {
    for (let k = 0; k < parent.length; k++) {
      const newParent = await retryTargetChildren(master, parent[k].location, pos + 1)
      value.push({
        actual: parent[k],
        parent: newParent ? newParent : null,
        pos: pos
      })
    }
  }
  return value
}

const getIdTargets = (
  value: targetConnection[],
  lastGroup: number,
  type: 'parent' | 'child' | 'own'
): { location: string; pos: number; group: number; type: 'parent' | 'child' | 'own' }[] => {
  //@ts-ignore
  let idTargets = []
  for (let k = 0; k < value.length; k++) {
    idTargets.push({
      location: value[k].actual.location._id,
      pos: value[k].pos,
      group: lastGroup + k,
      type
    })
    if (value[k].parent) {
      //@ts-ignore
      idTargets = idTargets.concat(getIdTargets(value[k].parent, lastGroup + k, type))
    }
  }
  //@ts-ignore
  return idTargets
}

const getTargets = async (
  master: IMasterLocation,
  location: ILocation
): Promise<
  { location: string; pos: number; group: number; type: 'parent' | 'child' | 'own' }[]
> => {
  const resp = await retryTarget(master, location, 0)
  const idTargets = getIdTargets(resp, 0, 'parent')
  const respChild = await retryTargetChildren(master, location, 0)
  const idTargetsChild = getIdTargets(
    respChild,
    idTargets[idTargets.length - 1]?.group + 1,
    'child'
  )

  return [
    ...idTargets,
    { location: location._id, group: -1, pos: -1, type: 'own' },
    ...idTargetsChild
  ]
}

const validateWorker = async (
  QrCode: string,
  actualLocation: ILocation
): Promise<{ ok: boolean; msg: string; dest: ILocation; authorized?: typeQr }> => {
  const actualWorker = await worker.findOne({ QR: QrCode }).populate('group').populate('timeZone')
  if (!actualWorker) {
    return { ok: false, msg: 'No se encontró el trabajador', dest: null }
  }
  if (actualWorker.banFinish) {
    if (moment().isAfter(actualWorker.banFinish)) {
      await worker.findByIdAndUpdate(actualWorker._id, { banFinish: null })
    } else {
      return {
        ok: false,
        msg: 'Ha excedido el número de intentos, contacte a un administrador',
        dest: null
      }
    }
  }
  if (
    !_.flatten(
      (actualWorker.group as IGroupWorker[]).map(e => JSON.parse(JSON.stringify(e.location)))
    ).includes(actualLocation._id)
  ) {
    return { ok: false, msg: 'No Tiene autorización', dest: null, authorized: '0003' as typeQr }
  }
  if (actualLocation.typeCheck === 'out') {
    toUpdateSecurity(actualLocation._id)
    return {
      ok: true,
      msg: `Vuelva pronto ${actualWorker.name} ${actualWorker.lastname}`,
      dest: null
    }
  }
  const minHour = moment.min(
    (actualWorker.timeZone as iTimeZone[]).map(e =>
      moment
        .tz('America/Guatemala')
        .set('hours', parseInt(e.start.split(':')[0]))
        .set('minutes', parseInt(e.start.split(':')[1]))
    )
  )
  const maxHour = moment.max(
    (actualWorker.timeZone as iTimeZone[]).map(e =>
      moment
        .tz('America/Guatemala')
        .set('hours', parseInt(e.end.split(':')[0]))
        .set('minutes', parseInt(e.end.split(':')[1]))
    )
  )

  const actualHour = moment.tz('America/Guatemala')
  const ValidDays = _.uniq(_.flatten((actualWorker.timeZone as iTimeZone[]).map(e => e.days)))
  const days: Days[] = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
  if (!ValidDays.includes(days[actualHour.day()])) {
    return { ok: false, msg: 'No se encuentra dentro del dia de trabajo', dest: null }
  }
  const isInTime = actualHour.isBefore(maxHour) && actualHour.isAfter(minHour)
  if (!isInTime) {
    return { ok: false, msg: 'No se encuentra dentro de las horas de trabajo', dest: null }
  }

  return { ok: true, msg: `Bienvenido ${actualWorker.name} ${actualWorker.lastname}`, dest: null }
}

const validateEntry = async (
  location: ILocation,
  QrCode: string,
  order: number | null,
  actualInvitationEvent: IInvitationEvent,
  actualContact: IContact,
  typeEvent: typeQr
) => {
  var updatedInv: invitationType
  const hour = moment.tz('America/Guatemala').format()
  if (location.typeCheck === 'in') {
    if (order) {
      await QrUses.findOneAndUpdate(
        { QrCode },
        {
          $push: {
            uses: {
              location: location._id,
              order: order - 1
            }
          }
        }
      )
    }

    updatedInv = await InvitationEvent.findByIdAndUpdate(actualInvitationEvent._id, {
      isIn: true,
      hourIn: hour
    })
  }

  var updatedInv: invitationType
  const newEntry = new locationEntries({
    contact: actualInvitationEvent.contact,
    location: location._id,
    event: actualInvitationEvent.event,
    //@ts-ignore
    host: actualInvitationEvent.host as string,
    type: 'I',
    typeQr: typeEvent,
    hourIn: hour,
    isEntry: true
  })
  await newEntry.save()
  await createAttemptSuccessContact(actualContact, location, typeEvent)
  toUpdateSecurity(location._id)
  return {
    ok: true,
    msg: `Bienvenido ${actualContact.firstName} ${actualContact.lastName} puede pasar`,
    dest: JSON.parse(JSON.stringify(actualInvitationEvent.location)) as ILocation
  }
}

const validateWorkerTemporal = async (
  qrCode: string,
  location: ILocation
): Promise<{ ok: boolean; msg: string; dest: ILocation; authorized?: typeQr }> => {
  const temporal = await worker_qr_temporal.findOne({ QR: qrCode }).populate('worker')
  if (!temporal) {
    return { ok: false, msg: 'QR no valido', dest: null }
  }
  if (!temporal.valid) {
    return { ok: false, msg: 'QR no valido', dest: null }
  }

  const actualWorker = JSON.parse(JSON.stringify(temporal.worker)) as IWorker

  if (actualWorker.banFinish) {
    if (moment().isAfter(actualWorker.banFinish)) {
      await worker.findByIdAndUpdate(actualWorker._id, { banFinish: null })
    } else {
      return {
        ok: false,
        msg: 'Ha excedido el número de intentos, contacte a un administrador',
        dest: null
      }
    }
  }

  if (location._id !== JSON.parse(JSON.stringify(temporal.location))) {
    return { ok: false, msg: 'Sin autorización', dest: null, authorized: '0004' as typeQr }
  }

  const isOutOfTime = moment.tz('America/Guatemala').isAfter(moment(temporal.timeEnd))
  if (isOutOfTime) {
    return { ok: false, msg: 'QR vencido', dest: null }
  }

  await worker_qr_temporal.findByIdAndUpdate(temporal._id, {
    valid: false
  })
  return {
    ok: true,
    msg: `Bienvenido ${(actualWorker as IWorker)?.name} ${(actualWorker as IWorker)?.lastname}`,
    dest: location
  }
}

const validateUserTemporal = async (
  qrCode: string,
  location: ILocation
): Promise<{ ok: boolean; msg: string; dest: ILocation; authorized?: typeQr }> => {
  const temporal = await worker_qr_temporal.findOne({ QR: qrCode }).populate('user')
  if (!temporal) {
    return { ok: false, msg: 'QR no valido', dest: null }
  }
  if (!temporal.valid) {
    return { ok: false, msg: 'QR no valido', dest: null }
  }
  //console.log(temporal)

  const actualUser = JSON.parse(JSON.stringify(temporal.user)) as IUser
  if (actualUser.banFinish) {
    if (moment().isAfter(actualUser.banFinish)) {
      await users.findByIdAndUpdate(actualUser._id, { banFinish: null })
    } else {
      return {
        ok: false,
        msg: 'Ha excedido el número de intentos, contacte a un administrador',
        dest: null
      }
    }
  }

  if (location._id !== JSON.parse(JSON.stringify(temporal.location))) {
    return { ok: false, msg: 'Sin autorización', dest: null, authorized: '0005' as typeQr }
  }

  const isOutOfTime = moment.tz('America/Guatemala').isAfter(moment(temporal.timeEnd))
  if (isOutOfTime) {
    return { ok: false, msg: 'QR vencido', dest: null }
  }

  await worker_qr_temporal.findByIdAndUpdate(temporal._id, {
    valid: false
  })

  return {
    ok: true,
    msg: `Bienvenido ${(actualUser as IUser).name} ${(actualUser as IUser).lastname}`,
    dest: location
  }
}

const validateEventExpress = async (
  qrCode: string,
  invitado: string
): Promise<{
  ok: boolean
  msg: string
  dest: ILocation
  authorized?: typeQr
  data?: IEventExpress
}> => {
  const express: IEventExpress = JSON.parse(
    JSON.stringify(
      await eventExpress.findOne({ _id: qrCode }).populate('host').populate('location')
    )
  )

  if (!express) {
    return { ok: false, msg: 'QR no valido', dest: null }
  }

  const contactResp = await getContact(invitado)
  if (!contactResp.ok) {
    return { ok: false, msg: contactResp.msg, dest: null }
  }
  const actualContact = contactResp.contact
  if (actualContact.banFinish) {
    if (moment().isAfter(actualContact.banFinish)) {
      await contact.findByIdAndUpdate(actualContact._id, { banFinish: null })
    } else {
      return {
        ok: false,
        msg: 'Ha excedido el número de intentos, contacte a un administrador',
        dest: null
      }
    }
  }
  const isOutOfTime = moment.tz('America/Guatemala').isAfter(moment(express.end))
  if (isOutOfTime) {
    return { ok: false, msg: 'QR vencido', dest: null }
  }

  return {
    ok: true,
    msg: `Bienvenido ${actualContact.firstName} ${actualContact.lastName}`,
    dest: express.location as ILocation,
    data: express
  }
}

const updateEventExpressHour = async (id: string, hour: any, attribute = 'hourIn') => {
  console.log('Actualizando evento ', id, attribute, hour)
  await eventExpress.findByIdAndUpdate(id, {
    [attribute]: hour
  })
}

export const validateQr = async (QRValue: string, locationSerial: string) => {
  //Obtener y validar location master y locacion

  const { ok, master, location, msg } = await getLocation(locationSerial)

  if (!ok) {
    return { ok, msg }
  }

  //Valida tipo de qr
  const fixedQr = await getQrValue(QRValue)
  if (!fixedQr.ok) {
    return { ok: false, msg: 'Código incorrecto' }
  }

  // console.log(fixedQr)
  //Accion segun typo
  let resp: {
    ok: boolean
    msg: string
    dest: ILocation
    authorized?: typeQr
    data?: IEvent | IEventExpress
  } = null

  switch (fixedQr.type) {
    case typeQr.event:
      resp = await validateEvent(fixedQr.Qr, location, master)
      break
    case typeQr.worker:
      resp = await validateWorker(fixedQr.Qr, location)
      break
    case typeQr.worker_temporal:
      resp = await validateWorkerTemporal(fixedQr.Qr, location)
      break
    case typeQr.user_temporal:
      resp = await validateUserTemporal(fixedQr.Qr, location)
      break
    case typeQr.eventExpress:
      resp = await validateEventExpress(fixedQr.Qr, fixedQr.numVis)
      break
    default:
      break
  }

  if (resp.authorized !== undefined) {
    let actualWorker: IWorker
    let actualUser: IUser
    let actualContact: IContact
    let prevAttempt: ILocationAttempt
    let express: IEventExpress
    let temporal: any
    switch (resp.authorized) {
      case typeQr.worker:
        actualWorker = await worker.findOne({ QR: fixedQr.Qr })

        prevAttempt = await locationAttempt.findOne({
          authenticated: false,
          worker: actualWorker._id,
          location: location._id
        })

        await attemptWorker(location, actualWorker, prevAttempt, fixedQr.type as typeQr)

        break
      case typeQr.worker_temporal:
        temporal = await worker_qr_temporal.findOne({ QR: fixedQr.Qr }).populate('worker')
        actualWorker = JSON.parse(JSON.stringify(temporal.worker)) as IWorker
        prevAttempt = await locationAttempt.findOne({
          authenticated: false,
          worker: actualWorker._id,
          location: location._id
        })
        await attemptWorker(location, actualWorker, prevAttempt, fixedQr.type as typeQr)
        break
      case typeQr.user_temporal:
        temporal = await worker_qr_temporal.findOne({ QR: fixedQr.Qr }).populate('user')
        actualUser = JSON.parse(JSON.stringify(temporal.user)) as IUser
        prevAttempt = await locationAttempt.findOne({
          authenticated: false,
          user: actualUser._id,
          location: location._id
        })
        await attemptUser(location, actualUser, prevAttempt, fixedQr.type as typeQr)
        break
      case typeQr.eventExpress:
        express = JSON.parse(
          JSON.stringify(
            await eventExpress.findOne({ _id: fixedQr.Qr }).populate('host').populate('location')
          )
        )
        const contactResp = await getContact(express.contact as string)
        actualContact = contactResp.contact
        prevAttempt = await locationAttempt.findOne({
          authenticated: false,
          contact: actualContact._id,
          location: location._id
        })
        await attemptContact(location, actualContact, prevAttempt, fixedQr.type as typeQr)
    }
  }

  if (!resp.ok) {
    return { ok: resp.ok, msg: resp.msg }
  }

  const hour = moment.tz('America/Guatemala').format()

  if (fixedQr.type === typeQr.event) {
    const actualInvitationEvent: IInvitationEvent = JSON.parse(
      JSON.stringify(await InvitationEvent.findById(fixedQr.Qr).populate('location'))
    )

    // CONTACTO PARA LLAMAR RIESGOS DE EVENTOS
    const contact = await getContact(actualInvitationEvent.contact as string)
    const actualContact = contact.contact

    const prevAttempt = await locationAttempt.findOne({
      authenticated: false,
      contact: actualContact._id,
      location: location._id
    })

    if (resp.data.open) {
      return validateEntry(
        location,
        fixedQr.Qr,
        null,
        actualInvitationEvent,
        contact.contact,
        fixedQr.type
      )
    }

    const hour = moment.tz('America/Guatemala').format()

    if (location.typeCheck === 'out') {
      const entriesToUpdate = await locationEntries.find({
        contact: actualInvitationEvent.contact,
        event: actualInvitationEvent.event
      })
      if (entriesToUpdate.filter(e => e.hourOut).length === 0) {
        for (let k = 0; k < entriesToUpdate.length; k++) {
          await locationEntries.findByIdAndUpdate(
            {
              _id: entriesToUpdate[k]._id
            },
            { hourOut: hour }
          )
        }
        toUpdateSecurity(location._id)
        return {
          ok: true,
          msg: `Vuelva pronto ${actualContact.firstName} ${actualContact.lastName}`,
          dest: JSON.parse(JSON.stringify(actualInvitationEvent.location)) as ILocation
        }
      } else {
        return {
          ok: false,
          msg: `Código ya usado`
        }
      }
    }
    const targets = await getTargets(master, location)

    if (!targets.map(e => e.location).includes(resp.dest._id)) {
      //console.log('777')
      try {
        attemptContact(location, actualContact, prevAttempt, fixedQr.type as typeQr)
      } catch (error) {
        console.log(error)
      }
      return { ok: false, msg: 'No puede pasar' }
    }

    const route: QrUserInterface = JSON.parse(
      JSON.stringify(await QrUses.findOne({ QrCode: fixedQr.Qr }))
    )

    if (route) {
      const order = route.uses.length
      if (route.uses.find(e => e.location === location._id)) {
        return { ok: false, msg: 'éste invitado ya ingresó' }
      } else {
        const last = route.uses[order - 1]
        const childs = targets.filter(e => e.type === 'child')
        const closeParents = targets.filter(e => e.type === 'parent').filter(e => e.pos === 0)
        if (!closeParents.map(e => e.location).includes(last.location as string)) {
          // RUTA DE PADRES NO INCLUYE A LOCACIÓN DESTINO
          attemptContact(location, actualContact, prevAttempt, fixedQr.type as typeQr)
          //console.log('796')
          return { ok: false, msg: 'No puede pasar' }
        }
        if (resp.dest._id === location._id) {
          await QrUses.findOneAndUpdate(
            { QrCode: fixedQr.Qr },
            {
              $push: {
                uses: {
                  location: location._id,
                  order: order - 1
                }
              }
            }
          )
          return validateEntry(
            location,
            fixedQr.Qr,
            order,
            actualInvitationEvent,
            contact.contact,
            fixedQr.type
          )
        }
        if (!childs.map(e => e.location).includes(resp.dest._id)) {
          // HIJOS DE LOCACIÓN ACTUAL NO INCLUYEN A LOCACIÓN DESTINO
          attemptContact(location, actualContact, prevAttempt, fixedQr.type as typeQr)
          //console.log('823')
          return { ok: false, msg: 'No puede pasar' }
        }
        return validateEntry(
          location,
          fixedQr.Qr,
          order,
          actualInvitationEvent,
          contact.contact,
          fixedQr.type
        )
      }
    } else {
      //Si es la primera vez de ingreso con codigo
      // No se encuentra en el arbol de la locacion
      if (!targets.map(e => e.location).includes(location._id)) {
        //console.log('839')
        attemptContact(location, actualContact, prevAttempt, fixedQr.type as typeQr)
        return { ok: false, msg: 'No puede pasar' }
      }

      const parents = targets.filter(e => e.type === 'parent')
      if (parents.length === 0) {
        if (location._id === resp.dest._id) {
          //Para caso de locacion sin padre
          await QrUses.create({
            QrCode: fixedQr.Qr,
            uses: [
              {
                location: location._id,
                order: 0
              }
            ]
          })
          console.log('Es la primera')
          return validateEntry(
            location,
            fixedQr.Qr,
            0,
            actualInvitationEvent,
            contact.contact,
            fixedQr.type
          )
        } else {
          const children = targets.filter(e => e.type === 'child')
          if (!children) {
            // INTENTO NO HAY HIJOS NO PUEDE USAR ESTA RUTA PARA EL DESTINO
            attemptContact(location, actualContact, prevAttempt, fixedQr.type as typeQr)
            console.log('870')
            return { ok: false, msg: 'No puede pasar' }
          }
          const child = children.find(e => e.location === resp.dest._id)
          if (!child) {
            // HIJOS NO CORRESPONDEN A RUTA PARA DESTINO
            attemptContact(location, actualContact, prevAttempt, fixedQr.type as typeQr)
            console.log('877')
            return { ok: false, msg: 'No puede pasar' }
          } else {
            await QrUses.create({
              QrCode: fixedQr.Qr,
              uses: [
                {
                  location: location._id,
                  order: 0
                }
              ]
            })
            await createAttemptSuccessContact(actualContact, location, fixedQr.type as typeQr)
            return validateEntry(
              location,
              fixedQr.Qr,
              0,
              actualInvitationEvent,
              contact.contact,
              fixedQr.type
            )
          }
        }
      } else {
        console.log('901')
        attemptContact(location, actualContact, prevAttempt, fixedQr.type as typeQr)
        return { ok: false, msg: 'No puede pasar' }
      }
    }
  } else if (fixedQr.type === typeQr.worker) {
    const actualWorker = await worker.findOne({ QR: fixedQr.Qr }).populate('group')
    const prevAttempt = await locationAttempt.findOne({
      authenticated: false,
      worker: actualWorker._id,
      location: location._id
    })

    if (!resp.ok) {
      await attemptWorker(location, actualWorker, prevAttempt, fixedQr.type as typeQr)
    } else {
      if (location.typeCheck === 'out') {
        const newLocationEntry = new locationEntries({
          worker: actualWorker._id,
          location: location._id,
          hourOut: hour,
          type: 'I',
          typeQr: fixedQr.type,
          isEntry: false
        })
        await newLocationEntry.save()
      } else {
        const newLocationEntry = new locationEntries({
          worker: actualWorker._id,
          location: location._id,
          hourIn: hour,
          type: 'I',
          typeQr: fixedQr.type,
          isEntry: true
        })
        await newLocationEntry.save()
      }

      await createAttemptSuccessWorker(actualWorker, location, fixedQr.type as typeQr)
      toUpdateSecurity(location._id)
      return resp
    }
  } else if (fixedQr.type === typeQr.worker_temporal) {
    const temporal = await worker_qr_temporal.findOne({ QR: fixedQr.Qr })
    const actualWorker = await worker.findOne({ _id: temporal.worker }).populate('group')

    const prevAttempt = await locationAttempt.findOne({
      authenticated: false,
      worker: actualWorker._id,
      location: location._id
    })

    if (!resp.ok) {
      await attemptWorker(location, actualWorker, prevAttempt, fixedQr.type as typeQr)
    } else {
      if (location.typeCheck === 'out') {
        const newEntry = new locationEntries({
          worker: actualWorker._id,
          location: location._id,
          //@ts-ignore
          type: 'I',
          typeQr: fixedQr.type,
          hourOut: hour,
          isEntry: false
        })
        await newEntry.save()
        await createAttemptSuccessWorker(actualWorker, location, fixedQr.type as typeQr)
        toUpdateSecurity(location._id)
        return {
          ok: true,
          msg: `Vuelva pronto ${(actualWorker as IWorker)?.name} ${
            (actualWorker as IWorker)?.lastname
          }`
        }
      } else {
        const newEntry = new locationEntries({
          worker: actualWorker._id,
          location: location._id,
          //@ts-ignore
          type: 'I',
          typeQr: fixedQr.type,
          hourIn: hour,
          isEntry: true
        })
        await newEntry.save()
        await createAttemptSuccessWorker(actualWorker, location, fixedQr.type as typeQr)
        toUpdateSecurity(location._id)
        return resp
      }
    }
  } else if (fixedQr.type === typeQr.user_temporal) {
    const temporal = await worker_qr_temporal.findOne({ QR: fixedQr.Qr })
    const actualUser = await users.findOne({ _id: temporal.user }).populate('group')
    const prevAttempt = await locationAttempt.findOne({
      authenticated: false,
      user: actualUser._id,
      location: location._id
    })
    if (!resp.ok) {
      await attemptUser(location, actualUser, prevAttempt, fixedQr.type as typeQr)
    } else {
      if (location.typeCheck === 'out') {
        const newEntry = new locationEntries({
          user: actualUser._id,
          location: location._id,
          //@ts-ignore
          type: 'I',
          typeQr: fixedQr.type,
          hourOut: hour,
          isEntry: false
        })
        await newEntry.save()
        await createAttemptSuccessUser(actualUser, location, fixedQr.type as typeQr)
        toUpdateSecurity(location._id)
        return {
          ok: true,
          msg: `Vuelva pronto ${(actualUser as IUser)?.name} ${(actualUser as IUser)?.lastname}`
        }
      } else {
        const newEntry = new locationEntries({
          user: actualUser._id,
          location: location._id,
          //@ts-ignore
          type: 'I',
          typeQr: fixedQr.type,
          hourIn: hour,
          isEntry: true
        })
        await newEntry.save()
        toUpdateSecurity(location._id)
        await createAttemptSuccessUser(actualUser, location, fixedQr.type as typeQr)
        return resp
      }
    }
  } else if (fixedQr.type === typeQr.eventExpress) {
    const targets = await getTargets(master, location)
    const event = await eventExpress.findOne({ _id: fixedQr.Qr }).populate('contact')
    const actualContact = (await getContact(fixedQr.numVis)).contact
    if (resp.data.open) {
      const newEntry = new locationEntries({
        contact: actualContact,
        location: location._id,
        eventExpress: event,
        host: event.host as string,
        type: 'I',
        typeQr: fixedQr.type,
        hourIn: hour,
        isEntry: true
      })
      updateEventExpressHour(fixedQr.Qr, hour)
      await newEntry.save()
      createAttemptSuccessContact(actualContact, location, fixedQr.type as typeQr)
      toUpdateSecurity(location._id)
      updateEventExpress()
      return resp
    }

    if (location.typeCheck === 'out') {
      const entriesToUpdate = await locationEntries.find({
        contact: actualContact,
        eventExpress: event._id
      })

      if (entriesToUpdate.filter(e => e.hourOut).length === 0) {
        for (let k = 0; k < entriesToUpdate.length; k++) {
          await locationEntries.findByIdAndUpdate(
            {
              _id: entriesToUpdate[k]._id
            },
            { hourOut: hour }
          )
        }
        updateEventExpressHour(fixedQr.Qr, hour, 'hourOut')
        createAttemptSuccessContact(actualContact, location, fixedQr.type as typeQr)
        toUpdateSecurity(location._id)
        updateEventExpress()
        return {
          ok: true,
          msg: `Vuelva pronto ${(event.contact as IContact).firstName} ${
            (event.contact as IContact).lastName
          }`
        }
      } else {
        return {
          ok: false,
          msg: `Código ya usado`
        }
      }
    }

    const prevAttempt = await locationAttempt.findOne({
      authenticated: false,
      contact: actualContact._id,
      location: location._id
    })

    if (!targets.map(e => e.location).includes(resp.dest._id)) {
      // RUTA NO INCLUYE LOC DESTINO
      attemptContact(location, actualContact, prevAttempt, fixedQr.type as typeQr)
      console.log('996')
      return { ok: false, msg: 'No puede pasar' }
    }

    const route: QrUserInterface = JSON.parse(
      JSON.stringify(await QrUses.findOne({ QrCode: `${fixedQr.Qr}-$${fixedQr.numVis}` }))
    )
    //const hour = moment.tz('America/Guatemala').format()

    if (route) {
      const order = route.uses.length
      if (route.uses.find(e => e.location === location._id)) {
        return { ok: false, msg: 'éste invitado ya ingresó' }
      } else {
        const last = route.uses[order - 1]
        const childs = targets.filter(e => e.type === 'child')
        const closeParents = targets.filter(e => e.type === 'parent').filter(e => e.pos === 0)
        if (!closeParents.map(e => e.location).includes(last.location as string)) {
          // RUTA DE PADRES NO INCLUYE A LOCACIÓN DESTINO
          attemptContact(location, actualContact, prevAttempt, fixedQr.type as typeQr)
          console.log('1035')
          return { ok: false, msg: 'No puede pasar' }
        }
        if (resp.dest._id === location._id) {
          await QrUses.findOneAndUpdate(
            { QrCode: `${fixedQr.Qr}-$${fixedQr.numVis}` },
            {
              $push: {
                uses: {
                  location: location._id,
                  order: order - 1
                }
              }
            }
          )
          const newEntry = new locationEntries({
            contact: actualContact,
            location: location._id,
            eventExpress: event,
            host: event.host as string,
            type: 'I',
            typeQr: fixedQr.type,
            hourIn: hour,
            isEntry: true
          })
          updateEventExpressHour(fixedQr.Qr, hour)
          await newEntry.save()
          createAttemptSuccessContact(actualContact, location, fixedQr.type as typeQr)
          toUpdateSecurity(location._id)
          updateEventExpress()
          return {
            ok: true,
            msg: `Bienvenido ${actualContact.firstName} ${actualContact.lastName} puede pasar`
          }
        }
        if (!childs.map(e => e.location).includes(resp.dest._id)) {
          // HIJOS DE LOCACIÓN ACTUAL NO INCLUYEN A LOCACIÓN DESTINO
          attemptContact(location, actualContact, prevAttempt, fixedQr.type as typeQr)
          console.log('1070')
          return { ok: false, msg: 'No puede pasar' }
        }
        console.log('868')
        await QrUses.findOneAndUpdate(
          { QrCode: `${fixedQr.Qr}-$${fixedQr.numVis}` },
          {
            $push: {
              uses: {
                location: location._id,
                order: order - 1
              }
            }
          }
        )
        const newEntry = new locationEntries({
          contact: actualContact,
          location: location._id,
          eventExpress: event,
          host: event.host as string,
          type: 'I',
          typeQr: fixedQr.type,
          hourIn: hour,
          isEntry: true
        })
        await newEntry.save()
        await createAttemptSuccessContact(actualContact, location, fixedQr.type as typeQr)
        toUpdateSecurity(location._id)
        updateEventExpress()
        return {
          ok: true,
          msg: `Bienvenido ${actualContact.firstName} ${actualContact.lastName} puede pasar`
        }
      }
    } else {
      //Valida si la locacion actual se encuentra en el arbol objetivo
      if (!targets.map(e => e.location).includes(location._id)) {
        attemptContact(location, actualContact, prevAttempt, fixedQr.type as typeQr)
        console.log('1106')
        return { ok: false, msg: 'No puede pasar' }
      }
      const parents = targets.filter(e => e.type === 'parent')
      if (parents.length === 0) {
        if (location._id === resp.dest._id) {
          //Para caso de locacion sin padre
          await QrUses.create({
            QrCode: `${fixedQr.Qr}-$${fixedQr.numVis}`,
            uses: [
              {
                location: location._id,
                order: 0
              }
            ]
          })

          const newEntry = new locationEntries({
            contact: actualContact,
            location: location._id,
            eventExpress: event,
            host: event.host as string,
            type: 'I',
            typeQr: fixedQr.type,
            hourIn: hour
          })
          await newEntry.save()
          await createAttemptSuccessContact(actualContact, location, fixedQr.type as typeQr)
          updateEventExpressHour(fixedQr.Qr, hour)
          toUpdateSecurity(location._id)

          return resp
        } else {
          const children = targets.filter(e => e.type === 'child')
          if (!children) {
            // INTENTO NO HAY HIJOS NO PUEDE USAR ESTA RUTA PARA EL DESTINO
            attemptContact(location, actualContact, prevAttempt, fixedQr.type as typeQr)
            console.log('1129')
            return { ok: false, msg: 'No puede pasar' }
          }
          const child = children.find(e => e.location === resp.dest._id)
          if (!child) {
            // HIJOS NO CORRESPONDEN A RUTA PARA DESTINO
            attemptContact(location, actualContact, prevAttempt, fixedQr.type as typeQr)
            console.log('1136')
            return { ok: false, msg: 'No puede pasar' }
          } else {
            await QrUses.create({
              QrCode: `${fixedQr.Qr}-$${fixedQr.numVis}`,
              uses: [
                {
                  location: location._id,
                  order: 0
                }
              ]
            })
            const newEntry = new locationEntries({
              contact: actualContact,
              location: location._id,
              eventExpress: event,
              host: event.host as string,
              type: 'I',
              typeQr: fixedQr.type,
              hourIn: hour,
              isEntry: true
            })
            await newEntry.save()
            await createAttemptSuccessContact(actualContact, location, fixedQr.type as typeQr)
            toUpdateSecurity(location._id)
            updateEventExpress()
            return {
              ok: true,
              msg: `Bienvenido ${actualContact.firstName} ${actualContact.lastName} puede pasar`
            }
          }
        }
      } else {
        attemptContact(location, actualContact, prevAttempt, fixedQr.type as typeQr)
        console.log('1157')
        return { ok: false, msg: 'No puede pasar' }
      }
    }
  }
  return resp
}

const attemptWorker = async (
  actualLocation: ILocation,
  actualWorker: IWorker,
  prevAttempt: ILocationAttempt,
  typeEvent: typeQr
) => {
  let resp: { ban: boolean; time: number } = { ban: false, time: 0 }
  let allAttempts = 0
  const toSum = await locationAttempt.find({ worker: actualWorker._id })

  if (toSum.length > 0) {
    allAttempts = toSum
      .map((item: ILocationAttempt) => item.attempts)
      .reduce((prev, next) => prev + next)
  }

  if (prevAttempt) {
    await locationAttempt.findByIdAndUpdate(prevAttempt._id, {
      attempts: allAttempts + 1
    })

    resp = await callRisks(
      allAttempts + 1,
      actualLocation.admins as string[],
      'es',
      actualLocation,
      moment.tz('America/Guatemala').toDate(),
      undefined,
      actualWorker
    )
  } else {
    const newAttempt = new locationAttempt({
      authenticated: false,
      worker: actualWorker._id,
      location: actualLocation._id,
      attempts: 1,
      type: typeEvent
    })
    resp = await callRisks(
      allAttempts + 1,
      actualLocation.admins as string[],
      'es',
      actualLocation,
      moment.tz('America/Guatemala').toDate(),
      undefined,
      actualWorker
    )

    await newAttempt.save()
  }
  if (resp.ban) {
    await worker.findByIdAndUpdate(actualWorker._id, {
      banFinish: moment.tz('America/Guatemala').add(resp.time, 'm').format()
    })
  }
}

const attemptContact = async (
  actualLocation: ILocation,
  actualContact: IContact,
  prevAttempt: ILocationAttempt,
  typeEvent: typeQr
) => {
  let resp: { ban: boolean; time: number } = { ban: false, time: 0 }
  let allAttempts = 0
  const toSum = await locationAttempt.find({ contact: actualContact._id })
  if (toSum.length > 0) {
    allAttempts = toSum
      .map((item: ILocationAttempt) => item.attempts)
      .reduce((prev, next) => prev + next)
  }
  if (prevAttempt) {
    await locationAttempt.findByIdAndUpdate(prevAttempt._id, {
      attempts: allAttempts + 1
    })
    resp = await callRisks(
      allAttempts + 1,
      actualLocation.admins as string[],
      'es',
      actualLocation,
      moment.tz('America/Guatemala').toDate(),
      actualContact
    )
  } else {
    const newAttempt = new locationAttempt({
      authenticated: false,
      contact: actualContact._id,
      location: actualLocation._id,
      attempts: allAttempts + 1,
      type: typeEvent
    })
    resp = await callRisks(
      allAttempts + 1,
      actualLocation.admins as string[],
      'es',
      actualLocation,
      moment.tz('America/Guatemala').toDate(),
      actualContact
    )
    await newAttempt.save()
  }
  if (resp.ban) {
    await contact.findByIdAndUpdate(actualContact._id, {
      banFinish: moment.tz('America/Guatemala').add(resp.time, 'm').format()
    })
  }
}

const attemptUser = async (
  actualLocation: ILocation,
  actualUser: IUser,
  prevAttempt: ILocationAttempt,
  typeEvent: typeQr
) => {
  let resp: { ban: boolean; time: number } = { ban: false, time: 0 }
  let allAttempts = 0
  const toSum = await locationAttempt.find({ user: actualUser._id })
  if (toSum.length > 0) {
    allAttempts = toSum
      .map((item: ILocationAttempt) => item.attempts)
      .reduce((prev, next) => prev + next)
  }
  if (prevAttempt) {
    await locationAttempt.findByIdAndUpdate(prevAttempt._id, {
      attempts: allAttempts + 1
    })
    resp = await callRisks(
      allAttempts + 1,
      actualLocation.admins as string[],
      'es',
      actualLocation,
      moment.tz('America/Guatemala').toDate(),
      undefined,
      undefined,
      actualUser
    )
  } else {
    const newAttempt = new locationAttempt({
      authenticated: false,
      user: actualUser._id,
      location: actualLocation._id,
      attempts: allAttempts + 1,
      type: typeEvent
    })
    resp = await callRisks(
      allAttempts + 1,
      actualLocation.admins as string[],
      'es',
      actualLocation,
      moment.tz('America/Guatemala').toDate(),
      undefined,
      undefined,
      actualUser
    )
    await newAttempt.save()
  }
  if (resp.ban) {
    await users.findByIdAndUpdate(actualUser._id, {
      banFinish: moment.tz('America/Guatemala').add(resp.time, 'm').format()
    })
  }
}

export const validateManualCheck = async ({
  eventExpress,
  type,
  hour
}: {
  eventExpress: IEventExpress
  type: string
  hour: string
}) => {
  if (type === 'in') {
    const newEntry = new locationEntries({
      contact: (eventExpress.contact as IContact)._id,
      location: (eventExpress.location as ILocation)._id,
      eventExpress: eventExpress._id,
      host: (eventExpress.host as IUser)._id,
      type: 'I',
      typeQr: '0006',
      hourIn: hour,
      isEntry: true
    })
    updateEventExpressHour(eventExpress._id, hour)
    await newEntry.save()
    createAttemptSuccessContact(
      (eventExpress.contact as IContact)._id,
      (eventExpress.location as ILocation)._id,
      typeQr.eventExpress
    )
    toUpdateSecurity((eventExpress.location as ILocation)._id)
    updateEventExpress()
    return { ok: true }
  } else if (type === 'out') {
    const entriesToUpdate = await locationEntries.find({
      contact: (eventExpress.contact as IContact)._id,
      eventExpress: eventExpress._id
    })

    if (entriesToUpdate.filter(e => e.hourOut).length === 0) {
      for (let k = 0; k < entriesToUpdate.length; k++) {
        await locationEntries.findByIdAndUpdate(
          {
            _id: entriesToUpdate[k]._id
          },
          { hourOut: hour }
        )
      }
      updateEventExpressHour(eventExpress._id, hour, 'hourOut')
      createAttemptSuccessContact(
        (eventExpress.contact as IContact)._id,
        (eventExpress.location as ILocation)._id,
        typeQr.eventExpress
      )
      toUpdateSecurity((eventExpress.location as ILocation)._id)
      updateEventExpress()
      return { ok: true }
    } else {
      return { ok: false }
    }
  }
}
