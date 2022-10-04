import {
  IContact,
  IEvent,
  IEventExpress,
  IInvitationEvent,
  ILocation,
  IMasterLocation,
  IUser
} from 'interfaces'
import event from '../models/event'
import location from '../models/location'
import masterLocation from '../models/masterLocation'
import users from '../models/users'
import contact from '../models/contact'
import invitationEvent from '../models/InvitationEvent'
import qr2 from 'qrcode'
//@ts-ignore
import qr from 'qr-image'
import path from 'path'
import Language from '../lang'
import {
  messageEvent,
  messageVerifiedContactForEvent,
  qrEventExpressEmail,
  sendEmail,
  temporalMessageEventExpress,
  temporalMessageQrInvitadostoAnfitrion
} from './email'
import EventExpress from '../models/eventExpress'
import Axios from 'axios'
import { typeQr } from '../interfaces/valuesAddQr'
import { clientWa } from './clientWa'
import { MessageMedia } from 'whatsapp-web.js'

export const makeInvitation = async (input: {
  event: string
  contact: string
  confirmed: boolean
  alreadySendInvitation: boolean
}) => {
  try {
    const actualEvent: IEvent = JSON.parse(JSON.stringify(await event.findById(input.event)))
    const eventLocation: ILocation = JSON.parse(
      JSON.stringify(await location.findById(actualEvent.location))
    )
    const actualMaster: IMasterLocation = await masterLocation.findById(
      eventLocation.masterLocation
    )
    const host: IUser = JSON.parse(JSON.stringify(await users.findById(actualEvent.host)))
    const contactToSend = await contact.findById(input.contact)
    var onlyAuth = false
    actualEvent.host = host
    actualEvent.location = eventLocation
    actualMaster?.onlyAllowAuthUSers && (onlyAuth = true)
    actualEvent?.onlyAuthUser && (onlyAuth = true)
    const newInvitationEvent = new invitationEvent(input)
    newInvitationEvent.isIn = false
    if (onlyAuth && !contactToSend.verified) {
      await sendEmail(
        contactToSend.email,
        messageVerifiedContactForEvent('es', contactToSend._id, {
          contact: contactToSend,
          event: actualEvent
        } as IInvitationEvent),
        Language.emailVerificationSubjectForEvent('es', actualEvent)
      )
    } else {
      input.alreadySendInvitation = true
      await sendEmail(
        contactToSend.email,
        messageEvent('es', newInvitationEvent, actualEvent, contactToSend, host, eventLocation),
        Language.emailNewEvent('es', actualEvent)
      )
    }
    newInvitationEvent.location = actualEvent.location
    await newInvitationEvent.save()
  } catch (err) {
    console.error(err)
  }
}

export const QREventsExpress = async (event: IEventExpress) => {
  try {
    const eventExpress: IEventExpress = JSON.parse(
      JSON.stringify(
        await EventExpress.findById(event._id)
          .populate('location')
          .populate('contact')
          .populate('invitados')
      )
    )
    if (eventExpress.invitados.length > 0) {
      eventExpress.invitados.forEach(async (invitado, i) => {
        var qr_svg = await qr2.toDataURL(
          `${typeQr.eventExpress}-${eventExpress._id}-$${invitado._id}`,
          {
            width: 400
          }
        )

        let qr_png = qr.image(`${typeQr.eventExpress}-${eventExpress._id}-$${invitado._id}`, {
          type: 'png',
          margin: 4
        })
        const qrPath = path.join(__dirname, '../mediaSend/qr-code.png')
        qr_png.pipe(require('fs').createWriteStream(qrPath))

        if (invitado.indicativo && invitado.phone) {
          const dataToSend = {
            body: `${qr_svg}`,
            filename: 'qr.png',
            caption: `Has sido aprobado para ingresar a la Locación: \n*${
              (eventExpress.location as ILocation).name
            }*\nCon el siguiente código QR puedes ingresar a la locación.\n`,
            phone: `${invitado.indicativo}${invitado.phone}`
          }
          try {
            const chatId = dataToSend.phone.substring(1) + '@c.us'
            const mediaQR = MessageMedia.fromFilePath(qrPath)
            await clientWa.sendMessage(chatId, dataToSend.caption)
            await clientWa.sendMessage(chatId, mediaQR, { sendMediaAsDocument: true })
          } catch (error) {
            console.log(error)
          }
        }

        // await Axios.post(
        //   'https://api.chat-api.com/instance390291/sendFile?token=38n3nrrslledqadg',
        //   dataToSend
        // )
      })
    }
    // console.log(
    //   `${typeQr.eventExpress}-${eventExpress._id}-$${(eventExpress.contact as IContact)._id}`
    // )
    const qr_svg = await qr2.toDataURL(
      `${typeQr.eventExpress}-${eventExpress._id}-$${(eventExpress.contact as IContact)._id}`,
      { width: 400 }
    )

    let qr_png = qr.image(
      `${typeQr.eventExpress}-${eventExpress._id}-$${(eventExpress.contact as IContact)._id}`,
      {
        type: 'png',
        margin: 4
      }
    )
    const qrPath = path.join(__dirname, '../mediaSend/qr-code.png')
    qr_png.pipe(require('fs').createWriteStream(qrPath))

    await sendEmail(
      (eventExpress.contact as IContact).email,
      qrEventExpressEmail(eventExpress.location as ILocation, `${qr_svg}`),
      'QR de ingreso'
    )

    if ((eventExpress.contact as IContact).indicativo && (eventExpress.contact as IContact).phone) {
      const dataToSend = {
        // @ts-ignore
        body: `${qr_svg}`,
        filename: 'qr.png',
        caption: `Has sido aprobado para ingresar a la Locación: *${
          (eventExpress.location as ILocation).name
        }*, Con el siguiente código QR puedes ingresar a la locación.`,
        phone: `${(eventExpress.contact as IContact).indicativo}${
          (eventExpress.contact as IContact).phone
        }`
      }
      try {
        const chatId = dataToSend.phone.substring(1) + '@c.us'
        const mediaQR = MessageMedia.fromFilePath(qrPath)
        await clientWa.sendMessage(chatId, dataToSend.caption)
        await clientWa.sendMessage(chatId, mediaQR, { sendMediaAsDocument: true })
      } catch (error) {
        console.log(error)
      }
    }

    // await Axios.post(
    //   'https://api.chat-api.com/instance390291/sendFile?token=38n3nrrslledqadg',
    //   dataToSend
    // )
  } catch (error) {
    throw new Error(error)
  }
}

export const TemporarEventExpressMessage = async (event: IEventExpress) => {
  try {
    const eventExpress: IEventExpress = JSON.parse(
      JSON.stringify(
        await EventExpress.findById(event._id)
          .populate({ path: 'location', populate: { path: 'admins', model: 'User' } })
          .populate('contact')
          .populate('invitados')
      )
    )

    const location = eventExpress.location as ILocation

    const idAdmins: any = (location.admins as IUser[]).map(e => e._id)
    const hosts = await users.find({ admin: { $in: idAdmins } })
    const emailsHosts = hosts.map(e => e.email)
    const emailsAdmins = (location.admins as IUser[]).map(e => e.email)
    const emails = [...emailsHosts, ...emailsAdmins].join(', ')
    const phonesHosts = hosts.map(e => e.phone)
    const phonesAdmins = (location.admins as IUser[]).map(e => e.phone)
    const phones = [...phonesHosts, ...phonesAdmins]
    const tokenHosts = hosts.filter(e => e.canAccessToApp && e.tokenExpo).map(e => e.tokenExpo)
    const tokenAdmins = location.admins as IUser[]
    const qrInvitados: any[] = []
    // console.log(emails, phones)
    if (eventExpress.invitados.length > 0) {
      for (let i = 0; i < eventExpress.invitados.length; i++) {
        const invitado = eventExpress.invitados[i]
        var qr_svg = await qr2.toDataURL(
          `${typeQr.eventExpress}-${eventExpress._id}-$${invitado._id}`,
          {
            width: 400
          }
        )
        qrInvitados.push({ qr: `${qr_svg}`, ...invitado })

        if (invitado.indicativo && invitado.phone) {
          const dataToSend = {
            caption: `Has sido aprobado para ingresar a la Locación: *${
              (eventExpress.location as ILocation).name
            }*, Tu anfitrión te apoyará con tu ingreso`,
            phone:
              invitado.indicativo.charAt(0) === '+'
                ? `${invitado.indicativo}${invitado.phone}`
                : '+' + `${invitado.indicativo}${invitado.phone}`
          }

          try {
            const chatId = dataToSend.phone.substring(1) + '@c.us'
            await clientWa.sendMessage(chatId, dataToSend.caption)
          } catch (error) {
            console.log(error)
          }
        }
      }
    }
    // console.log(qrInvitados)
    if ((eventExpress.contact as IContact).email) {
      await sendEmail(
        (eventExpress.contact as IContact).email,
        temporalMessageEventExpress(eventExpress.location as ILocation),
        'Ingreso Aprobado'
      )
    }

    const main_qr = await qr2.toDataURL(
      `${typeQr.eventExpress}-${eventExpress._id}-$${(eventExpress.contact as IContact)._id}`,
      { width: 400 }
    )

    let qr_png = qr.image(
      `${typeQr.eventExpress}-${eventExpress._id}-$${(eventExpress.contact as IContact)._id}`,
      {
        type: 'png',
        margin: 4
      }
    )
    const qrPath = path.join(__dirname, '../mediaSend/qr-code.png')
    qr_png.pipe(require('fs').createWriteStream(qrPath))

    if (emails.length) {
      await sendEmail(
        emails,
        temporalMessageQrInvitadostoAnfitrion(location, eventExpress, main_qr, qrInvitados),
        'Nuevo evento express aprobado'
      )
    }

    console.log(phones)

    phones.forEach(async phone => {
      const dataToSend = {
        body1:
          `Buen día, se ha aprobado el evento express: ` +
          `*${eventExpress.name}*\n\n` +
          `Para la locación: *${location.name}*\n\n` +
          `Con el siguiente invitado:\n\n` +
          `Nombre: ${(eventExpress.contact as IContact)?.firstName} ${
            (eventExpress.contact as IContact)?.lastName
          }\n` +
          `Email: ${
            (eventExpress.contact as IContact).email
              ? (eventExpress.contact as IContact).email
              : 'No especificado'
          }\n` +
          `Teléfono: ${
            (eventExpress.contact as IContact).phone
              ? (eventExpress.contact as IContact).phone
              : 'No especificado'
          }\n` +
          `QR de ingreso:`,
        phone: phone.charAt(0) === '+' ? phone : '+' + phone
      }

      try {
        const chatId = dataToSend.phone.substring(1) + '@c.us'
        const mediaQR = MessageMedia.fromFilePath(qrPath)
        await clientWa.sendMessage(chatId, dataToSend.body1)
        await clientWa.sendMessage(chatId, mediaQR, { sendMediaAsDocument: true })

        if (qrInvitados.length > 0) {
          await clientWa.sendMessage(chatId, 'Los siguientes invitados extra han sido aprobados:')
          qrInvitados.forEach(async e => {
            const data = `Nombre: ${e?.firstName} ${e?.lastName}\nIdentificación:  ${e?.DPI}\nEmail:  ${e?.email}\nTeléfono:  ${e?.phone}\nQR de ingreso:\n`
            await clientWa.sendMessage(chatId, data)
            let qr_png = qr.image(e?.qr, {
              type: 'png',
              margin: 4
            })
            const qrPath = path.join(__dirname, '../mediaSend/qr-code.png')
            qr_png.pipe(require('fs').createWriteStream(qrPath))
            const mediaQR = MessageMedia.fromFilePath(qrPath)
            await clientWa.sendMessage(chatId, mediaQR, { sendMediaAsDocument: true })
          })
        }
      } catch (error) {
        console.log(error)
      }
    })

    // for (let i = 0; i < phones.length; i++) {
    //   const caption : `Se ha apobrado el evento express *${eventExpress.name}*`
    // }
    if ((eventExpress.contact as IContact).indicativo && (eventExpress.contact as IContact).phone) {
      const dataToSend = {
        // @ts-ignore
        caption: `Has sido aprobado para ingresar a la Locación: *${
          (eventExpress.location as ILocation).name
        }*, Tu anfitrión te apoyará con tu ingreso`,
        phone:
          (eventExpress.contact as IContact).indicativo.charAt(0) === '+'
            ? `${(eventExpress.contact as IContact).indicativo}${
                (eventExpress.contact as IContact).phone
              }`
            : '+' +
              `${(eventExpress.contact as IContact).indicativo}${
                (eventExpress.contact as IContact).phone
              }`
      }
      try {
        const chatId = dataToSend.phone.substring(1) + '@c.us'
        await clientWa.sendMessage(chatId, dataToSend.caption)
      } catch (error) {
        console.log('no client')
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}
