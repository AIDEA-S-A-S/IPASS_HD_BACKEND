import axios from 'axios'
import { capitalize } from 'fogg-utils'
import fs from 'fs'
import handlebars from 'handlebars'
import nodemailer from 'nodemailer'
import path from 'path'
import {
  IContact,
  IEvent,
  IEventExpress,
  IInvitationEvent,
  ILocation,
  IUser,
  LanguageType
} from '../interfaces'
import Language from '../lang'
import users from '../models/users'
import { clientWa } from './clientWa'
import { NewEvent, NewEventExpress } from './pushNotifications'

const readHTMLFile = (path: string): string => {
  return fs.readFileSync(path, { encoding: 'utf-8' })
}

export const sendEmail = async (to: string, message: string, subject: string) => {
  const trasnporter = nodemailer.createTransport({
    host: 'mail.aidea.com.co',
    port: 465,
    secure: true,
    auth: {
      user: 'test@aidea.com.co',
      pass: 'kVW{x32H;W)N'
    }
  })
  await trasnporter.sendMail({
    from: '"IPASS Honduras" <info@ipass.com.gt>',
    to: to,
    subject: subject,
    html: message
  })
}

export const messageNotifyExpressEvent = (
  event: IEventExpress,
  location: ILocation,
  contact: IContact
) => {
  return `<!doctype html>
  <html ⚡4email>
    <head>
      <meta charset="utf-8">
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
    </head>
    <body>
      <h2>Se ha creado una solicitud de Evento express para la locación: <strong>${
        location.name
      }</strong></h2>
      <p>Información del visitante:</p>
      <p>Nombres: <strong>${contact.firstName}</strong></p>
      <p>Apellidos: <strong>${contact.lastName}</strong></p>
      <p>Correo: <strong>${contact.email ? contact.email : 'No especificado'}</strong></p>
      <p>Teléfono: <strong>${contact.phone ? contact.phone : 'No especificado'}</strong></p>

      <p>
      Para aceptar la solicitud ingresar a la sección de Eventos express en la aplicación móvil o el panel web.
      </p>
    </body>
  </html>`
}

export const messageNotifyEvent = (event: IEvent, location: ILocation, contact: IContact) => {
  return `<!doctype html>
  <html ⚡4email>
    <head>
      <meta charset="utf-8">
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
    </head>
    <body>
      <h2>Se ha creado una solicitud de Evento express para la locación: <strong>${
        location.name
      }</strong></h2>
      <p>Información del visitante:</p>
      <p>Nombres: <strong>${contact.firstName}</strong></p>
      <p>Apellidos: <strong>${contact.lastName}</strong></p>
      <p>Correo: <strong>${contact.email ? contact.email : 'No especificado'}</strong></p>
      <p>Teléfono: <strong>${contact.phone ? contact.phone : 'No especificado'}</strong></p>

      <p>
      Para aceptar la solicitud ingresar a la sección de Eventos express en la aplicación móvil o el panel web.
      </p>
    </body>
  </html>`
}

export const messageVerifiedContact = (lang: LanguageType, id: string) => {
  const html = readHTMLFile(path.join(__dirname, './email/verify_contact.html'))
  var template = handlebars.compile(html)
  var replacements = {
    hello: `${Language.emailHi[lang]}`,
    mainTitle: Language.emailVerificationSubject[lang],
    verification__guest: Language.emailVerificationGuest[lang],
    emailDontAsked: Language.emailDontAsked[lang],
    emailToReport: Language.emailToReport[lang],
    url: `${process.env.PANEL_URL}/${lang}/verification?id=${id}`,
    Goto: Language.emailVerify[lang]
  }
  handlebars.registerHelper('link', function (text: string, url: string) {
    var url = handlebars.escapeExpression(url),
      text = handlebars.escapeExpression(text)

    return new handlebars.SafeString(
      `<a href="${url}" style="color: rgb(56, 56, 56); font-size: 15px; text-decoration: none; line-height: 35px; width: 100%;">${text}</a>`
    )
  })
  return template(replacements)
}

export const messageVerification = (lang: LanguageType, token: string) => {
  return `<!doctype html>
  <html ⚡4email>
    <head>
      <meta charset="utf-8">
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
    </head>
    <body>
      <p>${Language.emailTextVerification[lang]}<strong>${token}</strong></p>
    </body>
  </html>`
}

export const messageRisk = (lang: LanguageType, person: any, location: ILocation, date: any) => {
  return `<!doctype html>
  <html ⚡4email>
    <head>
      <meta charset="utf-8">
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
    </head>
    <body>
      <p>${Language.emailRiskText[lang]}</p>
      <p>Locación: ${location.name}</p>
      <p>Usuario: ${person.firstName ? person.firstName : person.name} ${
    person.lastName ? person.lastName : person.lastname
  }</p>
      <p>Correo: ${person.email}</p>
      <p>Hora: ${date}</p>
      <p><p>
    </body>
  </html>`
}

export const messageVerificationLogin = (lang: LanguageType, token: string) => {
  return `<!doctype html>
  <html ⚡4email>
    <head>
      <meta charset="utf-8">
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
    </head>
    <body>
      <p>${Language.emailTextLoginVerification[lang]}<strong>${token}</strong></p>
    </body>
  </html>`
}

export const messageSignUp = (lang: LanguageType, id: string) => {
  return `<!doctype html>
  <html ⚡4email>
    <head>
      <meta charset="utf-8">
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
    </head>
    <body>
      <p>${Language.emailTextSignUp[lang]}</p>
      <br/>
      <a target='__blank' href="${process.env.PANEL_URL}/${lang}/session/signup?id=${id}">${process.env.PANEL_URL}/${lang}/session/signup?id=${id}</a>
    </body>
  </html>`
}

export const messageSignUpWorker = (lang: LanguageType, id: string) => {
  return `<!doctype html>
  <html ⚡4email>
    <head>
      <meta charset="utf-8">
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
    </head>
    <body>
      <p>${Language.emailTextSignUp[lang]}</p>
      <br/>
      <a target='__blank' href="${process.env.PANEL_URL}/${lang}/session/worker/signup?id=${id}">${process.env.PANEL_URL}/${lang}/session/worker/signup?id=${id}</a>
    </body>
  </html>`
}

export const messageSignUpSecurity = (lang: LanguageType, id: string) => {
  return `<!doctype html>
  <html ⚡4email>
    <head>
      <meta charset="utf-8">
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
    </head>
    <body>
      <p>${Language.emailTextSignUp[lang]}</p>
      <br/>
      <a target='__blank' href="${process.env.PANEL_SECURITY}/${lang}/session/signup?id=${id}">${process.env.PANEL_SECURITY}/${lang}/session/signup?id=${id}</a>
    </body>
  </html>`
}

export const messageForgotPassword = (lang: LanguageType, id: string) => {
  return `<!doctype html>
  <html ⚡4email>
    <head>
      <meta charset="utf-8">
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
    </head>
    <body>
      <p>${Language.emailTextForgot[lang]}</p>
      <br/>
      <a target='__blank' href="${process.env.PANEL_URL}/${lang}/session/forgot_password?id=${id}">${process.env.PANEL_URL}/${lang}/forgot_password?id=${id}</a>
    </body>
  </html>`
}

export const messageVerifiedContactForEvent = (
  lang: LanguageType,
  id: string,
  invitation: IInvitationEvent
) => {
  const html = readHTMLFile(path.join(__dirname, './email/verify_contact_event.html'))
  var template = handlebars.compile(html)
  var replacements = {
    hello: `${Language.emailHi[lang]}`,
    guestName: `${(invitation.contact as IContact).firstName.toUpperCase()} ${(
      invitation.contact as IContact
    ).lastName.toUpperCase()}`,
    needVerification: Language.emailNeedVerificationToEvent[lang],
    hostInvited: Language.emailHostInviteTo(lang, (invitation.event as IEvent).host as IUser),
    eventName: Language.emailEventVerified(lang, invitation.event as IEvent),
    place: Language.emailPlaceVerified(lang, invitation.event as IEvent),
    start: Language.emailStartVerified(lang, invitation.event as IEvent),
    end: Language.emailEndVerified(lang, invitation.event as IEvent),
    mainText: Language.emailInfoVerified[lang],
    yourData: Language.emailYourDataVerified[lang],
    emailDontAsked: Language.emailDontAsked[lang],
    emailToReport: Language.emailToReport[lang],
    url: `${process.env.PANEL_URL}/${lang}/verification?id=${id}`,
    Goto: Language.emailVerify[lang]
  }
  handlebars.registerHelper('link', function (text: string, url: string) {
    var url = handlebars.escapeExpression(url),
      text = handlebars.escapeExpression(text)

    return new handlebars.SafeString(
      `<a href="${url}" style="color: rgb(56, 56, 56); font-size: 15px; text-decoration: none; line-height: 35px; width: 100%;">${text}</a>`
    )
  })
  return template(replacements)
}

export const messageEvent = (
  lang: LanguageType,
  invitation: IInvitationEvent,
  event: IEvent,
  contact: IContact,
  host: IUser,
  location: ILocation
) => {
  const html = readHTMLFile(path.join(__dirname, './email/message_event.html'))
  var template = handlebars.compile(html)
  var replacements = {
    hello: `${Language.emailHi[lang]}`,
    contact: `${capitalize(contact.firstName)} ${capitalize(contact.lastName)}`,
    host: Language.emailHostInviteTo(lang, host),
    eventName: Language.emailEventVerified(lang, event),
    place: Language.emailPlaceVerified(lang, event),
    start: Language.emailStartVerified(lang, event),
    end: Language.emailEndVerified(lang, event),
    emailDontAsked: Language.emailDontAsked[lang],
    emailToReport: Language.emailToReport[lang],
    url: `${process.env.PANEL_URL}/${lang}/confirmEvent?id=${invitation._id}&confirm=true`,
    Goto: 'Aceptar',
    url2: `${process.env.PANEL_URL}/${lang}/confirmEvent?id=${invitation._id}&confirm=false`,
    Goto2: 'Rechazar'
  }

  handlebars.registerHelper('link', function (text: string, url: string) {
    var url = handlebars.escapeExpression(url),
      text = handlebars.escapeExpression(text)

    return new handlebars.SafeString(
      `<a href="${url}" style="color: rgb(56, 56, 56); font-size: 15px; text-decoration: none; line-height: 35px; width: 100%;">${text}</a>`
    )
  })
  handlebars.registerHelper('link2', function (text: string, url: string) {
    var url = handlebars.escapeExpression(url),
      text = handlebars.escapeExpression(text)

    return new handlebars.SafeString(
      `<a href="${url}" style="color: rgb(56, 56, 56); font-size: 15px; text-decoration: none; line-height: 35px; width: 100%;">${text}</a>`
    )
  })

  return template(replacements)
}

export const sendEmailEventExpress = async (
  location: ILocation,
  newEventExpress: IEventExpress,
  contact: IContact
) => {
  try {
    const idAdmins = (location.admins as IUser[]).map(e => e._id)
    const hosts = await users.find({ admin: { $in: idAdmins } })
    const emailsHosts = hosts.map(e => e.email)
    const emailsAdmins = (location.admins as IUser[]).map(e => e.email)
    const emails = [...emailsHosts, ...emailsAdmins].join(', ')
    const phonesHosts = hosts.map(e => e?.indicativo + e?.phone)
    const phonesAdmins = (location.admins as IUser[]).map(e => e?.indicativo + e?.phone)
    const phones = [...phonesHosts, ...phonesAdmins]
    const tokenHosts = hosts.filter(e => e.canAccessToApp && e.tokenExpo).map(e => e.tokenExpo)
    const tokenAdmins = (location.admins as IUser[])
      .filter(e => e.canAccessToApp && e.tokenExpo)
      .map(e => e.tokenExpo)
    const tokens = [...tokenHosts, ...tokenAdmins]
    if (emailsHosts.length > 0 || emailsAdmins.length > 0) {
      await sendEmail(
        emails,
        messageNotifyExpressEvent(newEventExpress, location, contact),
        'Solicitud de evento express'
      )
    }
    // send chat aip
    phones.forEach(async phone => {
      const dataToSend = {
        body:
          `Hola, se ha creado una solicitud de evento express para la locacion: *${location.name}*\n\n` +
          `*Información del visitante*\n
      Nombres: *${contact.firstName}*\n
      Apellidos: *${contact.lastName}*\n
      Correo: *${contact.email ? contact.email : 'No especificado'}*\n
      Teléfono: *${contact.phone ? contact.phone : 'No especificado'}*\n
      Motivo: *${newEventExpress.motivo}*\n\n` +
          `Para aceptar la solicitud ingresar a la sección de Eventos express en la aplicación móvil o el panel web.`,
        phone: phone.charAt(0) === '+' ? phone : '+' + phone
      }
      try {
        const chatId = dataToSend.phone.substring(1) + '@c.us'
        await clientWa.sendMessage(chatId, dataToSend.body)
      } catch (error) {
        console.log('no client')
      }
    })
    //console.log('aqui')

    await NewEventExpress(tokens, newEventExpress, location)
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export const sendEmailEvent = async (location: ILocation, newEvent: IEvent, contact: IContact) => {
  try {
    const idAdmins = (location.admins as IUser[]).map(e => e._id)
    const hosts = await users.find({ admin: { $in: idAdmins } })
    const emailsHosts = hosts.map(e => e.email)
    const emailsAdmins = (location.admins as IUser[]).map(e => e.email)
    const emails = [...emailsHosts, ...emailsAdmins].join(', ')
    const phonesHosts = hosts.map(e => e?.indicativo + e?.phone)
    const phonesAdmins = (location.admins as IUser[]).map(e => e?.indicativo + e?.phone)
    const phones = [...phonesHosts, ...phonesAdmins]
    const tokenHosts = hosts.filter(e => e.canAccessToApp && e.tokenExpo).map(e => e.tokenExpo)
    const tokenAdmins = (location.admins as IUser[])
      .filter(e => e.canAccessToApp && e.tokenExpo)
      .map(e => e.tokenExpo)
    const tokens = [...tokenHosts, ...tokenAdmins]
    if (emailsHosts.length > 0 || emailsAdmins.length > 0) {
      await sendEmail(
        emails,
        messageNotifyEvent(newEvent, location, contact),
        'Solicitud de evento'
      )
    }

    // send chat aip
    phones.forEach(async phone => {
      const dataToSend = {
        body:
          `Hola, se ha creado una solicitud de evento para la locacion: *${location.name}*\n\n` +
          `*Información del visitante*\n
      Nombres: *${contact.firstName}*\n
      Apellidos: *${contact.lastName}*\n
      Correo: *${contact.email ? contact.email : 'No especificado'}*\n
      Teléfono: *${contact.phone ? contact.phone : 'No especificado'}*\n` +
          `Para aceptar la solicitud ingresar a la sección de Eventos en la aplicación móvil o el panel web.`,
        phone: phone.charAt(0) === '+' ? phone : '+' + phone
      }
      try {
        const chatId = dataToSend.phone.substring(1) + '@c.us'
        await clientWa.sendMessage(chatId, dataToSend.body)
      } catch (error) {
        console.log('no client')
      }
    })

    await NewEvent(tokens, newEvent, location)
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export const qrEventExpressEmail = (location: ILocation, QR: any) => {
  return `<!doctype html>
  <html ⚡4email>
    <head>
      <meta charset="utf-8">
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
    </head>
    <body>
      <p>Has sido aprobado para entrar a la locación:${location.name}, con el siguiente código QR puedes ingresar a la locación</p>
      <br/>
      <img src=${QR} />
    </body>
  </html>`
}

export const temporalMessageEventExpress = (location: ILocation) => {
  return `<!doctype html>
  <html ⚡4email>
    <head>
      <meta charset="utf-8">
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
    </head>
    <body>
      <p>Has sido aprobado para entrar a la locación:${location.name}, tu anfitrión te apoyará con el ingreso</p>
      <br/>
    </body>
  </html>`
}

export const temporalMessageQrInvitadostoAnfitrion = (
  location: ILocation,
  eventExpress: IEventExpress,
  qr_contact: string,
  invitados: any[]
) => {
  return `<!doctype html>
  <html ⚡4email>
    <head>
      <meta charset="utf-8">
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
    </head>
    <body>
      <p>Buen día a todos</p>
      <p>Se ha aprobado el evento express: <strong>${
        eventExpress.name
      }</strong>, para la locacion: <strong>${
    location.name
  }</strong>, con el siguiente invitado:</p>
      <ul>
        <li>Nombre: ${(eventExpress.contact as IContact)?.firstName} ${
    (eventExpress.contact as IContact)?.lastName
  }</li>
        <li>Identificación:  ${(eventExpress.contact as IContact)?.DPI}</li>
        <li>Email:  ${
          (eventExpress.contact as IContact).email
            ? (eventExpress.contact as IContact).email
            : 'No especificado'
        }</li>
        <li>Teléfono:  ${
          (eventExpress.contact as IContact).phone
            ? (eventExpress.contact as IContact).phone
            : 'No especificado'
        }</li>
        <li>QR de ingreso: 
          <br/>
          <img src=${qr_contact} />
        </li>
      </ul>
      ${
        invitados.length > 0
          ? `
      <p>Los siguientes invitados extra han sido aprobados:</p>
      ${invitados.map(
        e =>
          `<ul>
            <li>Nombre: ${e?.firstName} ${e?.lastName}</li>
            <li>Identificación:  ${e?.DPI}</li>
            <li>Email:  ${e?.email}</li>
            <li>Teléfono:  ${e?.phone}</li>
            <li>QR de ingreso: 
              <br/>
              <img src=${e?.qr} />
            </li>
         </ul>`
      )}
      `
          : ''
      }
      <br/>
    </body>
  </html>`
}
