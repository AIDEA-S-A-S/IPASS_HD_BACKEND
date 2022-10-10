import privilege from '../models/privilege'
import { Expo, ExpoPushMessage } from 'expo-server-sdk'
import { capitalize } from 'fogg-utils'
import { IContact, IEvent, IEventExpress, ILocation, IUser, IWorker } from 'interfaces'
import users from '../models/users'
import moment from 'moment-timezone'
moment.locale('es')
let expo = new Expo()

export const contactHasBeenVerified = async (token: any, contact: IContact) => {
  return new Promise(async (resolve, reject) => {
    if (!Expo.isExpoPushToken(token)) {
      reject('Token invalido')
    }
    const message: ExpoPushMessage = {
      to: token,
      sound: 'default',
      title: 'IPASS HONDURAS',
      body: `Tu contacto ${capitalize(contact.firstName)} ${capitalize(
        contact.lastName
      )}, se ha verificado`,
      data: { contact: contact._id }
    }
    try {
      const res = await expo.sendPushNotificationsAsync([message])
      console.info(res)
      resolve('ok')
    } catch (error) {
      reject(error)
    }
  })
}

export const NewEventExpress = async (
  tokens: any[],
  eventExpress: IEventExpress,
  location: ILocation
) => {
  return new Promise(async (resolve, reject) => {
    let messages: ExpoPushMessage[] = []
    tokens.forEach(token => {
      if (!Expo.isExpoPushToken(token)) {
        reject('Token Invalido')
      }
      const message: ExpoPushMessage = {
        to: token,
        sound: 'default',
        title: 'IPASS HONDURAS',
        body: `Se ha creado una solicitud de Evento express para la locación ${location.name}`,
        data: { eventExpress: eventExpress._id }
      }
      messages.push(message)
    })
    try {
      let chunks = expo.chunkPushNotifications(messages)
      chunks.forEach(async chunk => {
        let res = await expo.sendPushNotificationsAsync(chunk)
        console.info(res)
      })
      resolve('ok')
    } catch (error) {
      console.error(error)
      resolve(error)
    }
  })
}

export const NewEvent = async (tokens: any[], event: IEvent, location: ILocation) => {
  return new Promise(async (resolve, reject) => {
    let messages: ExpoPushMessage[] = []
    tokens.forEach(token => {
      if (!Expo.isExpoPushToken(token)) {
        reject('Token Invalido')
      }
      const message: ExpoPushMessage = {
        to: token,
        sound: 'default',
        title: 'IPASS HONDURAS',
        body: `Se ha creado una solicitud de Evento para la locación ${location.name}`,
        data: { event: event._id }
      }
      messages.push(message)
    })
    try {
      let chunks = expo.chunkPushNotifications(messages)
      chunks.forEach(async chunk => {
        let res = await expo.sendPushNotificationsAsync(chunk)
        console.info(res)
      })
      resolve('ok')
    } catch (error) {
      console.error(error)
      resolve(error)
    }
  })
}

export const NewRisk = async (Location: ILocation, person: any, grado: any, date: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      let messages: ExpoPushMessage[] = []
      const super_adminRol = await privilege.findOne({ name: 'Super_admin' })
      const super_admins = await users.find({
        privilegeID: super_adminRol._id,
        token: { $exists: true }
      })
      const tokens = super_admins.filter(e => e.tokenExpo).map(e => e.tokenExpo)
      tokens.forEach(token => {
        if (!Expo.isExpoPushToken(token)) {
          reject('Token Invalido')
        }
        // const userName =
        const message: ExpoPushMessage = {
          to: token,
          sound: 'default',
          title: 'IPASS HONDURAS',
          subtitle: 'Incumpimiento',
          body: `Incumplimieto en ${grado}, por el usuario ${
            person?.firstName ? person?.firstName : person?.name
          } ${person?.lastName ? person?.lastName : person?.lastname} en la locación ${
            Location.name
          }, el dia: ${moment.tz(date, 'America/Guatemala').format('dddd MMM D hh:mm a')}`,
          data: { incumplimiento: 'yes' }
        }
        messages.push(message)
      })
      try {
        let chunks = expo.chunkPushNotifications(messages)
        chunks.forEach(async chunk => {
          let res = await expo.sendPushNotificationsAsync(chunk)
          console.info(res)
        })
        resolve('ok')
      } catch (error) {
        console.error(error)
        resolve(error)
      }
    } catch (error) {
      console.error(error)
      resolve(error)
    }
  })
}
