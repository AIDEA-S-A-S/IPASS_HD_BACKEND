import risk from '../models/risk'
import Language from '../lang'
import { messageRisk, sendEmail } from './email'
import { IContact, ILocation, IUser, IWorker, IRisk, createBreach } from 'interfaces'
import users from '../models/users'
import breach from '../models/breach'
import { NewRisk } from './pushNotifications'

const callAction = async (
  action: string,
  risk: any,
  admins: string[],
  lang: 'es' | 'en',
  person: any,
  location: ILocation,
  date: any
) => {
  switch (action) {
    case 'Tablero':
      console.log('Tablero notificado')
      break
    case 'App':
      await NewRisk(location, person, risk.name, date)
      console.log('App notificada')

      break
    case 'Email':
      for (let user of admins) {
        const admin = await users.findById(user)
        await sendEmail(
          admin.email,
          messageRisk(lang, person, location, date),
          Language.emailRiskAttempt(lang)
        )
      }
      console.log('Correo enviado')
      break
    case 'Bloquear':
      console.log(`Bloqueado por: ${risk.ban}`)
      break
    default:
      break
  }
}

const createBreach = async (input: createBreach) => {
  const newBreach = new breach(input)
  await newBreach.save()
  return true
}

export const callRisks = async (
  attempts: number,
  admin: string[],
  lang: 'es' | 'en',
  location: ILocation,
  date: any,
  contact?: IContact,
  worker?: IWorker,
  user?: IUser
): Promise<{ ban: boolean; time: number }> => {
  const risks = JSON.parse(JSON.stringify(await risk.find()))
  var max = -Infinity
  var maxRisk: IRisk = null
  for (let i = 0; i < risks.length; i++) {
    if (risks[i].try > max) {
      max = risks[i].try
      maxRisk = risks[i]
    }
  }
  let resp: { ban: boolean; time: number } = { ban: false, time: 0 }
  if (attempts > max) {
    createBreach({
      risk: maxRisk,
      location,
      grade: maxRisk.name,
      worker,
      contact,
      user
    })
    for (let action of maxRisk.actions) {
      if (contact) {
        callAction(action, maxRisk, admin, lang, contact, location, date)
      } else if (worker) {
        callAction(action, maxRisk, admin, lang, worker, location, date)
      } else {
        callAction(action, maxRisk, admin, lang, user, location, date)
      }
      if (action === 'Bloquear') {
        resp = { ban: true, time: maxRisk.ban }
      }
    }
  } else {
    for (let risk of risks) {
      if (attempts === risk.try) {
        createBreach({
          risk,
          location,
          grade: risk.name,
          worker,
          contact,
          user
        })
        for (let action of risk.actions) {
          if (contact) {
            callAction(action, risk, admin, lang, contact, location, date)
          } else if (worker) {
            callAction(action, risk, admin, lang, worker, location, date)
          } else {
            callAction(action, risk, admin, lang, user, location, date)
          }
          if (action === 'Bloquear') {
            resp = { ban: true, time: risk.ban }
          }
        }
      }
    }
  }
  return resp
}
