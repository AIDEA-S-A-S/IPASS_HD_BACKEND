import { IContact, IContextGraphql, IEvent, ILocation } from 'interfaces'
import moment from 'moment-timezone'
import { toUpdateSecurity } from '../../utils/subscriptions/sendPub'
import Event from '../../models/event'
import Contact from '../../models/contact'
import Location from '../../models/location'
import InvitationEvent from '../../models/InvitationEvent'
import location from '../../models/location'
import users from '../../models/users'
import { clientWa } from '../../utils/clientWa'
import Language from '../../lang'
import {
  getPermisionsFromToken,
  getUserFromToken,
  messageVerifiedContact,
  sendEmail,
  sendEmailEvent
} from '../../utils'
import { makeInvitation } from '../../utils/iniviteGuest'

export const resolver = {
  Query: {
    async listEvent(_: any, _2: any, context: IContextGraphql) {
      try {
        const { user, privilege, permision } = await getPermisionsFromToken(
          context.req.tokenAuth as string,
          'Event'
        )
        const todayStart = moment.tz('America/Guatemala').startOf('day').toDate()
        const todayEnd = moment.tz('America/Guatemala').endOf('day').toDate()

        if (privilege.name === 'Super_admin') {
          return await Event.find({
            $or: [{ start: { $gte: todayStart } }, { end: { $lt: todayEnd } }]
          }).lean()
        } else if (privilege.name === 'admin') {
          const actualLocations = await location.find({ admins: { $in: user._id } })
          return await Event.find({ location: { $in: actualLocations.map(e => e._id) } }).lean()
        } else if (privilege.name === 'host') {
          const myAdmin = await users.findById(user.admin)
          const actualLocations = await location.find({ admins: { $in: myAdmin._id } })
          return await Event.find({ location: { $in: actualLocations.map(e => e._id) } }).lean()
          // return await Event.find({ host: { $eq: user._id } }).lean()
        } else if (privilege.name === 'security') {
          const actualLocations = await location.find({ security: { $in: user._id } })
          const allEvents = []
          for (let k = 0; k < actualLocations.length; k++) {
            allEvents.push(
              ...(await Event.find({ location: { $in: actualLocations[k]._id } }).lean())
            )
          }
          return allEvents
        } else {
          if (permision.read) {
            return await Event.find().lean()
          } else {
            throw new Error('No permition')
          }
        }
      } catch (error) {
        if (context.isProd) {
          throw new Error(error)
        } else {
          return await Event.find().lean()
        }
      }
    },
    async listEventHistory(_: any, _2: any, context: IContextGraphql) {
      try {
        const { user, privilege, permision } = await getPermisionsFromToken(
          context.req.tokenAuth as string,
          'Event'
        )
        if (privilege.name === 'Super_admin') {
          return await Event.find().lean()
        } else if (privilege.name === 'admin') {
          const actualLocations = await location.find({ admins: { $in: user._id } })
          return await Event.find({ location: { $in: actualLocations.map(e => e._id) } }).lean()
        } else if (privilege.name === 'host') {
          return await Event.find({ host: { $eq: user._id } }).lean()
        } else if (privilege.name === 'security') {
          const actualLocations = await location.find({ security: { $in: user._id } })
          const allEvents = []
          for (let k = 0; k < actualLocations.length; k++) {
            allEvents.push(
              ...(await Event.find({ location: { $in: actualLocations[k]._id } }).lean())
            )
          }
          return allEvents
        } else {
          if (permision.read) {
            return await Event.find().lean()
          } else {
            throw new Error('No permition')
          }
        }
      } catch (error) {
        if (context.isProd) {
          throw new Error(error)
        } else {
          return await Event.find().lean()
        }
      }
    },
    async getEvent(_: any, { _id }: any) {
      return await Event.findById(_id).lean()
    },
    async listAllEventsActive() {
      return await Event.find({ state: { $eq: 'active' } })
    },
    async listEventsYesterday() {
      const yesterday = moment().subtract(1, 'day')
      return await Event.find({
        start: { $gte: yesterday.startOf('day').format(), $lte: yesterday.endOf('day').format() },
        state: { $eq: 'active' }
      })
    },
    async listEventsToday() {
      const today = moment()
      return await Event.find({
        start: { $gte: today.startOf('day').format(), $lte: today.endOf('day').format() },
        state: { $eq: 'active' }
      })
    },
    async listEventsTomorrow() {
      const tomorrow = moment().add(1, 'day')
      return await Event.find({
        start: { $gte: tomorrow.startOf('day').format(), $lte: tomorrow.endOf('day').format() },
        state: { $eq: 'active' }
      })
    },
    async listEventActive(_: any, _2: any, context: IContextGraphql) {
      try {
        const { user, privilege, permision } = await getPermisionsFromToken(
          context.req.tokenAuth as string,
          'Event'
        )
        const todayStart = moment.tz('America/Guatemala').startOf('day').toDate()
        const todayEnd = moment.tz('America/Guatemala').endOf('day').toDate()
        console.log(moment.tz('America/Guatemala').toDate())
        const orFilter = [
          {
            $match: {
              state: { $eq: 'active' }
            }
          }
          // {
          //   $addFields: {
          //     today: moment.tz('America/Guatemala').toDate()
          //   }
          // }
          // // {
          // //   $match: {
          // //     $and: [
          // //       {
          // //         today: {
          // //           $gte: '$start'
          // //         }
          // //       },
          // //       {
          // //         today: {
          // //           $lte: '$end'
          // //         }
          // //       }
          // //     ]
          // //   }
          // // }
        ]

        if (privilege.name === 'Super_admin') {
          const data = await Event.aggregate([...orFilter])
          //console.log(data)
          return data
        } else if (privilege.name === 'admin') {
          const actualLocations = await location.find({ admins: { $in: user._id } })
          return await Event.find({
            location: { $in: actualLocations.map(e => e._id) },
            state: { $eq: 'active' },
            ...orFilter
          }).lean()
        } else if (privilege.name === 'host') {
          const myAdmin = await users.findById(user.admin)
          const actualLocations = await location.find({ admins: { $in: myAdmin._id } })
          return await Event.find({
            location: { $in: actualLocations.map(e => e._id) },
            state: { $eq: 'active' },
            ...orFilter
          }).lean()
          // const events = await Event.find({
          //   host: { $eq: user._id },
          //   state: { $eq: 'active' }
          // }).lean()
          // return events
        } else if (privilege.name === 'security') {
          const actualLocations = await location.find({ security: { $in: user._id } })
          const allEvents = []
          for (let k = 0; k < actualLocations.length; k++) {
            allEvents.push(
              ...(await Event.find({
                location: { $in: actualLocations[k]._id },
                state: { $eq: 'active' }
              }).lean())
            )
          }
          return allEvents
        } else {
          if (permision.read) {
            return await Event.aggregate([...orFilter])
          } else {
            throw new Error('No permition')
          }
        }
      } catch (error) {
        console.log(error)
        if (context.isProd) {
          throw new Error(error)
        } else {
          return await Event.find({ state: { $eq: 'active' } }).lean()
        }
      }
    },
    async listEventByLocation(_: any, { _id }: any) {
      return (
        await Event.find().populate({
          path: 'location',
          match: { origID: _id }
        })
      ).filter(event => event.state === 'active' && event.location)
    }
  },
  Mutation: {
    async createEvent(_: any, { input }: any, context: IContextGraphql) {
      try {
        const newEvent = new Event(input)
        console.log(input)
        const user = await getUserFromToken(context.req.tokenAuth as string)
        newEvent.host = JSON.parse(JSON.stringify(user._id))
        newEvent.state = 'active'
        const saved = await newEvent.save()

        // console.log(input.contact)
        // if (input.contact) {
        //   await makeInvitation({
        //     event: newEvent._id,
        //     contact: input.contact._id,
        //     confirmed: false,
        //     alreadySendInvitation: true
        //   })
        // }
        if (input.guests) {
          input.guests.forEach(async (guest: string) => {
            await makeInvitation({
              event: newEvent._id,
              contact: guest,
              confirmed: true,
              alreadySendInvitation: true
            })
          })
        }

        const contact: IContact = JSON.parse(JSON.stringify(await Contact.findById(input.contact)))
        console.log(contact)
        // const location: ILocation = JSON.parse(
        //   JSON.stringify(await Location.findById(input.location).populate('admins'))
        // )

        // if (contact.email) {
        //   await sendEmail(
        //     contact.email,
        //     messageVerifiedContact('es', contact._id),
        //     Language.emailVerificationSubject['es']
        //   )
        // }

        // context.client.set(contact._id, JSON.parse(JSON.stringify(newEvent._id)))

        if (contact?.indicativo && contact?.phone) {
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
        // // await Axios.post(process.env.API_URL_CHAT, dataToSend)
        // await sendEmailEvent(location, newEvent, contact)
        toUpdateSecurity(JSON.parse(JSON.stringify(saved)).location as string)
        return saved
      } catch (error) {
        console.error(error)
        throw new Error(error)
      }
    },
    async updateEvent(_: any, { input }: { input: IEvent }) {
      try {
        const id = JSON.parse(JSON.stringify(input._id))

        delete input._id
        const updated = (await Event.findByIdAndUpdate(id, input)) as IEvent
        return updated
      } catch (error) {
        console.error(error)
      }
    },
    async deleteEvent(_: any, { input }: any) {
      const deleted = await Event.findByIdAndDelete(input._id)
      return deleted
    },
    async deleteEventChangeStatus(_: any, { input }: any) {
      const actualDate = new Date()
      const updateEvent = {
        whoDeleted: input.whoDeleted,
        state: 'deleted',
        deletedDate: actualDate
      }
      const deleted = await Event.findByIdAndUpdate(input._id, updateEvent as any)
      return deleted
    },
    async deleteEventAll() {
      return await Event.remove({})
    },
    async eventacceptReject(
      _: any,
      { input }: { input: { confirm: boolean; contact: string; Event: string } }
    ) {
      const actualEvent: IEvent = JSON.parse(JSON.stringify(await Event.findById(input.Event)))
      return await Event.findByIdAndUpdate(input.Event, actualEvent)
    }
  },

  Event: {
    invitations: async (parent: IEvent) => {
      const inv = await InvitationEvent.find({ event: parent._id })
      return inv
    },
    location: async (parent: IEvent) => {
      return await location.findById(parent.location)
    },
    host: async (parent: IEvent) => {
      return await users.findById(parent.host)
    },
    whoDeleted: async (parent: IEvent) => {
      return await users.findById(parent.whoDeleted)
    }
  }
}
