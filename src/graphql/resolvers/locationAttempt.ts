import { ILocationAttempt } from 'interfaces'
import moment from 'moment-timezone'
import contact from '../../models/contact'
import LocationAttempt from '../../models/locationAttempt'
import worker from '../../models/worker'
export const resolver = {
  Query: {
    async listLocationAttempt() {
      return await LocationAttempt.find().lean()
    },
    async getLocationAttempt(_: any, { _id }: any) {
      return await LocationAttempt.findById(_id._id).lean()
    },
    async listAttemptsToday() {
      const today = moment.tz('America/Guatemala')
      //@ts-ignore
      return await LocationAttempt.find({
        updatedAt: { $gte: today.startOf('day').format(), $lte: today.endOf('day').format() }
      })
    },
    async listAttemptsAllInternal() {
      return await LocationAttempt.find({
        type: { $in: ['0003', '0004', '0005'] }
      })
    },

    async listAttemptsMonthInternal() {
      const month = moment.tz('America/Guatemala')
      //@ts-ignore
      return await LocationAttempt.find({
        createdAt: { $gte: month.startOf('month').format(), $lte: month.endOf('month').format() },
        type: { $in: ['0003', '0004', '0005'] }
      })
    },
    async listAttemptsMonthExternal() {
      const month = moment.tz('America/Guatemala')
      //@ts-ignore
      return await LocationAttempt.find({
        createdAt: {
          $gte: month.startOf('month').format(),
          $lte: month.endOf('month').format()
        },
        type: { $in: ['0000', '0001', '0002', '0006'] }
      })
    },
    async listAttemptsAllExternal() {
      return await LocationAttempt.find({
        type: { $in: ['0000', '0001', '0002', '0006'] }
      })
    },
    async listAttemptsYesterday() {
      const yesterday = moment().subtract(1, 'day')
      //@ts-ignore
      return await LocationAttempt.find({
        updatedAt: {
          $gte: yesterday.startOf('day').format(),
          $lte: yesterday.endOf('day').format()
        }
      })
    }
  },
  Mutation: {
    async createLocationAttempt(_: any, { input }: any) {
      const newLocationAttempt = new LocationAttempt(input)
      return await newLocationAttempt.save()
    },
    async updateLocationAttempt(_: any, { input }: any) {
      try {
        return await LocationAttempt.findByIdAndUpdate(input._id, input)
      } catch (error) {
        console.error(error)
      }
    },
    async deleteLocationAttempt(_: any, { input }: any) {
      return await LocationAttempt.findByIdAndDelete(input._id)
    },
    async deleteLocationAttemptAll() {
      return await LocationAttempt.remove({})
    }
  },
  LocationAttempt: {
    worker: async (parent: ILocationAttempt) => {
      return await worker.findById(parent.worker).lean()
    },
    contact: async (parent: ILocationAttempt) => {
      return await contact.findById(parent.contact).lean()
    }
  }
}
