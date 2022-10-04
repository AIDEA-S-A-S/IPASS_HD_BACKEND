import users from '../../models/users'
import Axios from 'axios'
import { IContact, IContextGraphql, IEventExpress, ILocation } from 'interfaces'
import moment from 'moment-timezone'
import Language from '../../lang'
import Contact from '../../models/contact'
import EventExpress from '../../models/eventExpress'
import Location from '../../models/location'
import {
  getPermisionsFromToken,
  getUserFromToken,
  messageVerifiedContact,
  QREventsExpress,
  sendEmail,
  sendEmailEventExpress,
  TemporarEventExpressMessage
} from '../../utils'
import { pubsub, updateEventExpress } from '../../utils/subscriptions/sendPub'
import { PubSubEnums } from '../../utils/subscriptions/pubSubEnums'
import { clientWa } from '../../utils/clientWa'
import { validateManualCheck } from '../../utils/funtionLocationQr'

export const resolver = {
  Query: {
    async listEventExpress(_: any, _2: any, context: IContextGraphql) {
      try {
        const { user, privilege, permision } = await getPermisionsFromToken(
          context.req.tokenAuth as string,
          'eventExpress'
        )
        const today = moment.tz('America/Guatemala').startOf('day').toDate()

        if (privilege.name === 'admin') {
          const locations = await Location.find({ admins: { $in: user._id } })
          return JSON.parse(
            JSON.stringify(
              await EventExpress.find({
                location: { $in: locations.map(e => e._id) },
                createdAt: { $gte: today }
              }).lean()
            )
          )
        } else if (privilege.name === 'host') {
          // @ts-ignore
          const locations = await Location.find({ admins: { $in: user.admin as string } })
          return JSON.parse(
            JSON.stringify(
              await EventExpress.find({
                location: { $in: locations.map(e => e._id) },
                createdAt: { $gte: today }
              }).lean()
            )
          )
        } else if (privilege.name === 'super_anfitrion') {
          return JSON.parse(
            JSON.stringify(
              await EventExpress.find({
                createdAt: { $gte: today }
              }).lean()
            )
          )
        } else {
          return JSON.parse(
            JSON.stringify(
              await EventExpress.find({
                createdAt: { $gte: today }
              }).lean()
            )
          )
        }
      } catch (error) {
        console.error(error)
        throw new Error(error)
      }
    },
    async getEventExpress(_: any, { _id }: any) {
      const event = await EventExpress.findById(_id).lean()
      return JSON.parse(JSON.stringify(event))
    }
  },
  Mutation: {
    async createEventExpress(_: any, { input }: any, context: IContextGraphql) {
      try {
        const user = await getUserFromToken(context.req.tokenAuth as string)
        console.log("aqui")
        const newEventExpress = new EventExpress(input)
        newEventExpress.host = user._id
        newEventExpress.state = 'waiting'
        const contact: IContact = JSON.parse(JSON.stringify(await Contact.findById(input.contact)))
        const location: ILocation = JSON.parse(
          JSON.stringify(await Location.findById(input.location).populate('admins'))
        )
        if (!contact.verified) {
          if (contact.email) {
            await sendEmail(
              contact.email,
              messageVerifiedContact('es', contact._id),
              Language.emailVerificationSubject['es']
            )
          }

          context.client.set(contact._id, JSON.parse(JSON.stringify(newEventExpress._id)))

          if (contact.indicativo && contact.phone) {
            const dataToSend = {
              body: `Se ha generado tu solicitud de ingreso a la Locación: *${location.name}*, para seguir con el proceso de solicitud, por favor realiza el proceso de verificación IPASS ingresando al siguente link: ${process.env.PANEL_URL}/es/verification?id=${contact._id}`,
              phone: `${contact.indicativo}${contact.phone}`
            }
            try {
              const chatId = dataToSend.phone.substring(1) + '@c.us'
              await clientWa.sendMessage(chatId, dataToSend.body)
            } catch (error) {
              console.log(error)
            }
          }
          // await Axios.post(process.env.API_URL_CHAT, dataToSend)
        } else {
          await sendEmailEventExpress(location, newEventExpress, contact)
        }
        updateEventExpress()
        return await newEventExpress.save()
      } catch (error) {
        console.error(error)
        throw new Error(error)
      }
    },
    async acceptEventExpress(_: any, { _id }: any, context: IContextGraphql) {
      try {
        const user = JSON.parse(
          JSON.stringify(await getUserFromToken(context.req.tokenAuth as string))
        )
        const eventExpress: IEventExpress = JSON.parse(
          JSON.stringify(
            await EventExpress.findById(_id)
              .populate('location')
              .populate('contact')
              .populate('invitados')
          )
        )
        await Contact.findByIdAndUpdate((eventExpress.contact as IContact)._id, {
          $set: {
            location: [
              ...(eventExpress.contact as IContact).location,
              (eventExpress.location as ILocation)._id
            ]
          }
        })
        await TemporarEventExpressMessage(eventExpress)
        await EventExpress.findByIdAndUpdate(_id, {
          $set: {
            state: 'enable',
            start: moment.tz('America/Guatemala').format(),
            end: moment.tz('America/Guatemala').add(2, 'hours').format(),
            authorizedBy: user._id
          }
        })
        updateEventExpress()

        return true
      } catch (error) {
        console.error(error)
        throw new Error(error)
      }
    },
    async denyEventExpress(_: any, { _id }: any) {
      try {
        updateEventExpress()

        return await EventExpress.findByIdAndUpdate(_id, {
          $set: {
            state: 'deny'
          }
        })
      } catch (error) {
        console.error(error)
        throw new Error(error)
      }
    },
    async sendQREventExpress(_: any, { _id }: any) {
      try {
        const eventExpress: IEventExpress = JSON.parse(
          JSON.stringify(
            await EventExpress.findById(_id)
              .populate('location')
              .populate('contact')
              .populate('invitados')
          )
        )
        updateEventExpress()

        await QREventsExpress(eventExpress)
        return true
      } catch (error) {
        console.error(error)
        throw new Error(error)
      }
    },
    async updateEventExpress(_: any, { input }: any) {
      try {
        const updated = await EventExpress.findByIdAndUpdate(input._id, input)
        updateEventExpress()

        return updated
      } catch (error) {
        console.error(error)
      }
    },
    async deleteEventExpress(_: any, { input }: any) {
      const deleted = await EventExpress.findByIdAndDelete(input._id)
      updateEventExpress()
      return deleted
    },
    async deleteEventExpressAll() {
      return await EventExpress.remove({})
    },
    async manualCheckUpdate(_: any, { input }: any) {
      const { type, hour } = input
      const { eventExpress: eventId } = input
      const eventExpress = await EventExpress.findById(eventId)
      return await validateManualCheck({ eventExpress, type, hour })
    }
  },
  Subscription: {
    subListEventExpress: {
      resolve: async () => {
        return true
      },
      subscribe: async () => {
        return pubsub.asyncIterator(`${PubSubEnums.NEW_EVENT_EXPRESS}`)
      }
    }
  },
  EventExpress: {
    location: async (parent: IEventExpress) => {
      return await Location.findById(parent.location)
    },
    contact: async (parent: IEventExpress) => {
      const contact = await Contact.findById(parent.contact)
      return contact
    },
    invitados: async (parent: IEventExpress) => {
      const contacts = await Contact.find({ _id: { $in: parent?.invitados } })
      return contacts
    },
    authorizedBy: async (parent: IEventExpress) => {
      return await users.findById(parent.authorizedBy)
    }
  }
}
