import { IContextGraphql, ILocation } from 'interfaces'
import { validateQr } from '../../utils/funtionLocationQr'
import { default as device, default as Device } from '../../models/device'
import Location from '../../models/location'
import masterLocation from '../../models/masterLocation'
import users from '../../models/users'
import { getPermisionsFromToken } from '../../utils'
import { PubSubEnums } from '../../utils/subscriptions/pubSubEnums'
import { pubsub } from '../../utils/subscriptions/sendPub'
import Event from '../../models/event'
import EventExpress from '../../models/eventExpress'
import LocationEntries from '../../models/locationEntries'
import moment from 'moment-timezone'
import InvitationEvent from '../../models/InvitationEvent'
import lodash from 'lodash'
import mongoose from 'mongoose'
import { userWorkerAggregate } from '../../utils/aggregation'
import worker from '../../models/worker'
import { convertToPdfSecurity, generateReportSecurity } from '../../excel/generate_report'
export const resolver = {
  Query: {
    async listLocation(_: any, _2: any, context: IContextGraphql) {
      try {
        const { user, privilege, permision } = await getPermisionsFromToken(
          context.req.tokenAuth as string,
          'Location'
        )
        if (privilege.name === 'Super_admin') {
          return await Location.find().lean()
        } else if (privilege.name === 'admin') {
          return await Location.find({ admins: { $in: user._id } }).lean()
          // return await Location.find().lean()
        } else if (privilege.name === 'host') {
          const admin = await users.findById(user.admin)
          return await Location.find({ admins: { $in: admin?._id } }).lean()
        } else if (privilege.name === 'security') {
          return await Location.find({ security: { $in: user?._id } }).lean()
        } else {
          if (permision.read) {
            return await Location.find().lean()
          } else {
            throw new Error('No permition')
          }
        }
      } catch (error) {
        console.error(error)
        if (context.isProd) {
          throw new Error(error)
        } else {
          return await Location.find().lean()
        }
      }
    },
    async listLocationActive(_: any, _2: any, context: IContextGraphql) {
      const { user, privilege, permision } = await getPermisionsFromToken(
        context.req.tokenAuth as string,
        'Location'
      )
      if (privilege.name === 'Super_admin' || privilege.name === 'super_anfitrion') {
        return await Location.find({ state: { $ne: 'deleted' } }).lean()
      } else if (privilege.name === 'admin') {
        return await Location.find({ admins: { $in: user._id }, state: { $ne: 'deleted' } }).lean()
        // return await Location.find().lean()
      } else if (privilege.name === 'host') {
        const admin = await users.findById(user.admin)
        return await Location.find({
          admins: { $in: admin?._id },
          state: { $ne: 'deleted' }
        }).lean()
      } else if (privilege.name === 'security') {
        return await Location.find({
          security: { $in: user?._id },
          state: { $ne: 'deleted' }
        }).lean()
      } else {
        if (permision.read) {
          return await Location.find().lean()
        } else {
          return await Location.find().lean()
        }
      }
      // return await Location.find({ state: { $ne: 'deleted' } }).lean()
    },
    async getLocationSecurity(_: any, _2: any, context: IContextGraphql) {
      const { user, privilege } = await getPermisionsFromToken(
        context.req.tokenAuth as string,
        'Location'
      )
      if (privilege.name === 'security') {
        return await Location.find({ security: { $in: user._id } }).lean()
      } else {
        throw new Error('No permition')
      }
    },
    async getLocation(_: any, { _id }: any) {
      return await Location.findById(_id).lean()
    },
    async getLocationsByMaster(_: any, { _id }: any) {
      return await Location.find({ masterLocation: _id, state: 'enabled' }).lean()
    },
    async getAllToSecurity(_: any, { locationID }: { locationID: string }) {
      //@ts-ignore
      const events = await Event.find({
        location: new mongoose.Types.ObjectId(locationID),
        state: 'active',
        start: {
          $gte: moment.tz('America/Guatemala').startOf('day').format()
        }
        // end: {
        //   $lte: moment.tz('America/Guatemala').endOf('day').format()
        // }
      })
        .populate('host')
        .populate('location')

      console.log(events)

      //@ts-ignore
      const eventsExpress = await EventExpress.find({
        location: new mongoose.Types.ObjectId(locationID),
        state: 'enable',
        start: {
          $gte: moment.tz('America/Guatemala').startOf('day').format()
        }
        // end: {
        //   $gte: moment.tz('America/Guatemala').format()
        // }
      })
        .populate('host')
        .populate('location')
        .populate('contact')

      const invitations = []
      for (let k = 0; k < events.length; k++) {
        invitations.push(
          await InvitationEvent.find({
            event: events[k]._id
          })
            .populate('contact')
            .populate('location')
        )
      }

      const entries = await LocationEntries.aggregate([
        ...userWorkerAggregate,
        {
          $match: {
            location: new mongoose.Types.ObjectId(locationID)
          }
        },
        {
          $lookup: {
            from: 'locations',
            localField: 'location',
            foreignField: '_id',
            as: 'location'
          }
        },
        {
          $unwind: {
            path: '$location',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'contacts',
            localField: 'contact',
            foreignField: '_id',
            as: 'contact'
          }
        },
        {
          $unwind: {
            path: '$contact',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $match: {
            createdAt: {
              $gte: moment.tz('America/Guatemala').startOf('day').toDate()
            }
          }
        },
        { $sort: { createdAt: -1 } }
      ])
      for (let k = 0; k < entries.length; k++) {
        if (entries[k].event) {
          entries[k].event = await Event.findById(entries[k].event)
            .populate('location')
            .populate('host')
        }
        if (entries[k].eventExpress) {
          entries[k].eventExpress = await EventExpress.findById(entries[k].eventExpress)
            .populate('location')
            .populate('host')
        }
        if (entries[k].worker) {
          entries[k].worker = await worker
            .findById(entries[k].worker._id)
            .populate('nativeLocation')
            .populate('group')
            .populate('timeZone')
        }
        if (entries[k].user) {
          entries[k].user = await users
            .findById(entries[k].user._id)
            .populate('nativeLocation')
            .populate('group')
            .populate('timeZone')
        }
      }

      return { events, eventsExpress, invitations: lodash.flatten(invitations), entries }
    },
    async generateExcelSecurity(_: any, { locationID }: { locationID: string }) {
      //@ts-ignore

      const entries = await LocationEntries.aggregate([
        ...userWorkerAggregate,
        {
          $match: {
            location: new mongoose.Types.ObjectId(locationID)
          }
        },
        {
          $lookup: {
            from: 'locations',
            localField: 'location',
            foreignField: '_id',
            as: 'location'
          }
        },
        {
          $unwind: {
            path: '$location',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'contacts',
            localField: 'contact',
            foreignField: '_id',
            as: 'contact'
          }
        },
        {
          $unwind: {
            path: '$contact',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $match: {
            createdAt: {
              $gte: moment.tz('America/Guatemala').startOf('day').toDate()
            }
          }
        },
        { $sort: { createdAt: -1 } }
      ])

      for (let k = 0; k < entries.length; k++) {
        if (entries[k].event) {
          entries[k].event = await Event.findById(entries[k].event)
            .populate('location')
            .populate('host')
        }
        if (entries[k].eventExpress) {
          entries[k].eventExpress = await EventExpress.findById(entries[k].eventExpress)
            .populate('location')
            .populate('host')
        }
        if (entries[k].worker) {
          entries[k].worker = await worker
            .findById(entries[k].worker._id)
            .populate('nativeLocation')
            .populate('group')
            .populate('timeZone')
        }
        if (entries[k].user) {
          entries[k].user = await users
            .findById(entries[k].user._id)
            .populate('nativeLocation')
            .populate('group')
            .populate('timeZone')
        }
      }

      return generateReportSecurity(entries)
    },
    async generatePDFSecurity(_: any, { locationID }: { locationID: string }) {
      //@ts-ignore

      const entries = await LocationEntries.aggregate([
        ...userWorkerAggregate,
        {
          $match: {
            location: new mongoose.Types.ObjectId(locationID)
          }
        },
        {
          $lookup: {
            from: 'locations',
            localField: 'location',
            foreignField: '_id',
            as: 'location'
          }
        },
        {
          $unwind: {
            path: '$location',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'contacts',
            localField: 'contact',
            foreignField: '_id',
            as: 'contact'
          }
        },
        {
          $unwind: {
            path: '$contact',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $match: {
            createdAt: {
              $gte: moment.tz('America/Guatemala').startOf('day').toDate()
            }
          }
        },
        { $sort: { createdAt: -1 } }
      ])

      for (let k = 0; k < entries.length; k++) {
        if (entries[k].event) {
          entries[k].event = await Event.findById(entries[k].event)
            .populate('location')
            .populate('host')
        }
        if (entries[k].eventExpress) {
          entries[k].eventExpress = await EventExpress.findById(entries[k].eventExpress)
            .populate('location')
            .populate('host')
        }
        if (entries[k].worker) {
          entries[k].worker = await worker
            .findById(entries[k].worker._id)
            .populate('nativeLocation')
            .populate('group')
            .populate('timeZone')
        }
        if (entries[k].user) {
          entries[k].user = await users
            .findById(entries[k].user._id)
            .populate('nativeLocation')
            .populate('group')
            .populate('timeZone')
        }
      }

      return convertToPdfSecurity(entries)
    }
  },
  Mutation: {
    async createLocation(_: any, { input }: any) {
      try {
        const newLocation = new Location(input)
        if (input.device) {
          await Device.findByIdAndUpdate(input.device, {
            $set: {
              actualLocation: newLocation._id,
              status: 'occupied'
            }
          })
        }
        await newLocation.save()
        return true
      } catch (error: any) {
        console.error(error)
        throw new Error(error)
      }
    },
    async updateLocation(_: any, { input }: any) {
      try {
        const location = JSON.parse(JSON.stringify(await Location.findById(input._id)))
        if (location.device && input.device) {
          await Device.findByIdAndUpdate(location.device, {
            status: 'available',
            actualLocation: null
          })
          await Device.findByIdAndUpdate(input.device, {
            status: 'occupied',
            actualLocation: location._id
          })
        } else if (location.device && !input?.device && !input?.admins) {
          await Device.findByIdAndUpdate(location.device, {
            status: 'available',
            actualLocation: null
          })
          input = { ...input, device: null }
        }
        await Location.findByIdAndUpdate(input._id, input)
        return true
      } catch (error: any) {
        console.error(error)
        throw new Error(error)
      }
    },
    async deleteLocation(_: any, { input }: any) {
      try {
        await Location.findByIdAndDelete(input._id)
        return true
      } catch (error: any) {
        throw new Error(error)
      }
    },
    async deleteLocationChangeStatus(_: any, { input }: any) {
      const updateLocation = {
        whoDeleted: input.whoDeleted,
        state: 'deleted',
        deletedDate: new Date()
      }
      const deletedLocation = JSON.parse(
        JSON.stringify(await Location.findByIdAndUpdate(input._id, updateLocation as any))
      )
      await Device.findOneAndUpdate(
        { actualLocation: deletedLocation._id },
        {
          $set: {
            status: 'available',
            actualLocation: null
          }
        }
      )
      const prevMasterLoc = JSON.parse(
        JSON.stringify(await masterLocation.findOne({ location: deletedLocation._id }))
      )

      if (prevMasterLoc) {
        const { location } = prevMasterLoc
        var locsAfterDelete = location.filter((loc: ILocation) => loc._id === deletedLocation._id)

        await masterLocation.findByIdAndUpdate(prevMasterLoc._id, {
          $set: {
            location: locsAfterDelete
          }
        })
      }
      return true
    },
    async deleteLocationAll() {
      try {
        await Location.remove({})
        return true
      } catch (error: any) {
        throw new Error(error)
      }
    },
    async verifyInputQR(
      _: any,
      { input }: { input: { QRCode: string; locationSerial: string; type: string } }
    ) {
      return await validateQr(input.QRCode, input.locationSerial)
    }
  },
  Subscription: {
    subSecurityByLocation: {
      resolve: async (args: { locationID: string }) => {
        return true
      },
      subscribe: async (_1: any, { locationID }: { locationID: string }) => {
        return pubsub.asyncIterator(`${PubSubEnums.TO_SECURITY}-${locationID}`)
      }
    }
  },
  Location: {
    device: async (parent: ILocation) => {
      return await device.findById(parent.device)
    },
    masterLocation: async (parent: ILocation) => {
      return await masterLocation.findById(parent.masterLocation)
    },
    parentLocations: async (parent: ILocation) => {
      return (parent.parentLocations as string[])?.map(async e => await Location.findById(e))
    },
    childLocations: async (parent: ILocation) => {
      return (parent.childLocations as string[])?.map(async e => await Location.findById(e))
    },
    admins: async (parent: ILocation) => {
      return (parent.admins as string[])?.map(async e => await users.findById(e))
    },
    host: async (parent: ILocation) => {
      return (parent.host as string[])?.map(async e => await users.findById(e))
    },
    security: async (parent: ILocation) => {
      return (parent.security as string[])?.map(async e => await users.findById(e))
    },
    whoDeleted: async (parent: ILocation) => {
      return await users.findById(parent.whoDeleted)
    }
  }
}
