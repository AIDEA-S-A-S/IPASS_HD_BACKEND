import { IEvent, ILocation, IUser } from 'interfaces'
import { getTime } from '../utils/utils'

const emailTextVerification = {
  es: `Hola!,<br/>
    Gracias por registrarte en la plataforma.<br/>
    Tu código de verificación es: `,
  en: `Hi!, <br/>
    Thanks for join us.<br/>
    Your verification code is: `
}

const emailSubjectVerification = {
  es: 'Código de verificación',
  en: 'Verification Code'
}

const emailSubjectSignUp = {
  es: 'Completa tu registro',
  en: 'Complete your sign up'
}

const emailTextLoginVerification = {
  es: `Hola!,<br/>
  Tu código de verificación es: `,
  en: `Hi!, <br/>
  Your verification code is: `
}
const emailTextSignUp = {
  es: `Hola!,<br/>
  Gracias por registrarte en la plataforma.<br/>
  Para completar tu registro, por favor ingresa al siguiente link`,
  en: `Hi!, <br/>
  Thanks for join us.<br/>
  To complete your sign up, please get into the following link`
}

const emailTextForgot = {
  es: `Hola!,<br/>
  Hemos escuchado que olvidaste tu contraseña, no te preocupes, ingresando al siguiente link podras recuperarla.`,
  en: `Hi!, <br/>
  We heard you lost your password, don't worry, by entering the following link you can recover it. `
}

const emailSubjectForgotPassword = {
  es: 'Recover Password ',
  en: 'Recueprar Contraseña'
}

const emailHi = {
  es: 'HOLA',
  en: 'HI'
}

const emailDontAsked = {
  es: 'No pediste tu código de verificación a tu cuenta de correo, denuncia',
  en: 'You did not ask for your verification code to your email account, report'
}

const emailToReport = {
  es: 'Aquí',
  en: 'Here'
}

const emailNeedVerificationToEvent = {
  es: 'NECESARIA VERIFICACIÓN PARA INGRESO',
  en: 'NECESARIA VERIFICACIÓN PARA INGRESO'
}

const emailInfoVerified = {
  es: `Para ingresar necesitas estar autenticado , por lo que el anfitrión requiere ingreses tus datos para  liberar tu invitación.`,
  en: `To enter you need to be authenticated, so the host requires you to enter your data to release your invitation.`
}

const emailYourDataVerified = {
  es: `Tus datos estarán únicamente accesibles  para tu  anfitrión y la sección de seguridad/acceso  de las instalaciones.`,
  en: `Your data will only be accessible to your host and the security / access section of the facilities.`
}

const emailVerify = {
  es: 'Verificar',
  en: 'Verify'
}

const emailVerificationSubject = {
  es: 'Verificate IPASS ',
  en: 'Verification IPASS'
}

const emailVerificationGuest = {
  es: `Hola!
  Estas invitado a verificarte en la plataforma. IPass
  Para realizar tu verificación, por favor ingresa al siguiente link`,
  en: `Hi!
  You are invited to verify yourself on the platform. IPass
  To make your verification, please enter the following link`
}

const emailRiskText = {
  es: `Autenticación no autorizada`,
  en: `Unauthorized authentication `
}

const emailHostInviteTo = (lang: string, host: IUser) => {
  const values: any = {
    es: `${host.name.toUpperCase()} ${host.lastname.toUpperCase()} TE HA INVITADO A`,
    en: `${host.name.toUpperCase()} ${host.lastname.toUpperCase()} TE HA INVITADO A`
  }
  return values[lang]
}

const emailEventVerified = (lang: string, event: IEvent) => {
  const values: any = {
    es: `EVENTO: ${event.name}`,
    en: `EVENT: ${event.name}`
  }
  return values[lang]
}

const emailPlaceVerified = (lang: string, event: IEvent) => {
  const values: any = {
    es: `LUGAR: ${(event.location as ILocation).name} ${(event.location as ILocation).address}`,
    en: `PLACE: ${(event.location as ILocation).name} ${(event.location as ILocation).address}`
  }
  return values[lang]
}

const emailStartVerified = (lang: string, event: IEvent) => {
  const values: any = {
    es: `HORA INICIO: ${getTime(event.start)}`,
    en: `START TIME: ${getTime(event.start)}`
  }
  return values[lang]
}
const emailEndVerified = (lang: string, event: IEvent) => {
  const values: any = {
    es: `HORA FIN: ${getTime(event.end)}`,
    en: `END TIME: ${getTime(event.end)}`
  }
  return values[lang]
}

const emailVerificationSubjectForEvent = (lang: string, event: IEvent) => {
  const values: any = {
    es: `Verificación ${event.name}`,
    en: `Verification ${event.name}`
  }
  return values[lang]
}

const emailNewEvent = (lang: string, event: IEvent) => {
  const value: any = {
    es: 'Has sido invitado a un nuevo evento ',
    en: 'You have been invited to a new event'
  }
  return value[lang]
}

const emailRiskAttempt = (lang: string) => {
  const value: any = {
    es: 'Autenticación no autorizada ',
    en: 'Unauthorized authentication'
  }
  return value[lang]
}

export default {
  emailTextVerification,
  emailSubjectVerification,
  emailTextLoginVerification,
  emailTextSignUp,
  emailSubjectSignUp,
  emailTextForgot,
  emailSubjectForgotPassword,
  emailHostInviteTo,
  emailEventVerified,
  emailPlaceVerified,
  emailStartVerified,
  emailEndVerified,
  emailDontAsked,
  emailToReport,
  emailHi,
  emailNeedVerificationToEvent,
  emailVerificationSubjectForEvent,
  emailNewEvent,
  emailInfoVerified,
  emailYourDataVerified,
  emailVerify,
  emailVerificationSubject,
  emailVerificationGuest,
  emailRiskText,
  emailRiskAttempt
}
