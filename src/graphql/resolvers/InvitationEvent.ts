import { IEvent, IInvitationEvent, ILocation, IMasterLocation, IUser } from 'interfaces'
import moment from 'moment'
import { toUpdateSecurity } from '../../utils/subscriptions/sendPub'
import { uuid } from 'uuidv4'
import Language from '../../lang'
import contact from '../../models/contact'
import event from '../../models/event'
import invitationEvent from '../../models/InvitationEvent'
import location from '../../models/location'
import masterLocation from '../../models/masterLocation'
import users from '../../models/users'
import worker_qr_temporal from '../../models/worker_qr_temporal'
import { messageEvent, messageVerifiedContactForEvent, sendEmail } from '../../utils'
import { createRoute } from '../../utils/createRoute'
export const resolver = {
  Query: {
    async listInvitationEvent() {
      return await invitationEvent.find().lean()
    },
    async getInvitationEvent(_: any, { _id }: any) {
      return await invitationEvent.findById(_id).lean()
    },
    async listInvitationEventByEvent(_: any, { _id }: any) {
      return (
        await invitationEvent
          .find({ event: { $eq: _id } })
          .lean()
          .populate('contact')
      ).filter(e => e.contact !== null)
    }
  },
  Mutation: {
    async createInvitationEvent(_: any, { input }: { input: IInvitationEvent }) {
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
      input.confirmed = null
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
      // const actualLoc = await location.findById(newInvitationEvent.location)
      // const rt = await createRoute(actualLoc._id)
      // newInvitationEvent.routes = rt

      const saved = await newInvitationEvent.save()
      toUpdateSecurity(saved.location as string)
      return saved
    },
    async updateInvitationEvent(_: any, { input }: any) {
      try {
        const updated = await invitationEvent.findByIdAndUpdate(input._id, input)
        const actualevent: IEvent = JSON.parse(JSON.stringify(await event.findById(updated.event)))
        toUpdateSecurity(updated.location as string)
        return updated
      } catch (error) {
        console.error(error)
      }
    },
    async deleteInvitationEvent(_: any, { input }: any) {
      const deleted = await invitationEvent.findByIdAndDelete(input._id)
      // const oldEvent = await event.findById(deleted.event)
      toUpdateSecurity(deleted.location as string)
      return deleted
    },
    async deleteInvitationEventAll() {
      return await invitationEvent.remove({})
    },
    async generateHostQR(_: any, { _id, location }: { _id: string; location: string }) {
      try {
        const temporal_Qr = new worker_qr_temporal({
          user: _id,
          QR: uuid(),
          used: false,
          valid: true,
          location,
          timeEnd: moment.tz('America/Guatemala').add(45, 'seconds').format()
        })
        temporal_Qr.save()
        return temporal_Qr
      } catch (error: any) {
        throw new Error(error)
      }
    }
  },

  InvitationEvent: {
    event: async (parent: IInvitationEvent) => {
      return await event.findById(parent.event)
    },
    contact: async (parent: IInvitationEvent) => {
      return await contact.findById(parent.contact)
    },
    host: async (parent: IInvitationEvent) => {
      return await users.findById(parent.host)
    },
    location: async (parent: IInvitationEvent) => {
      return await location.findById(parent.location)
    }
  }
}
