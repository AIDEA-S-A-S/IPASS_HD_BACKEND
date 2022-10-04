import { IAuthenticator } from 'interfaces'
import moment from 'moment-timezone'
import { convertToPdf, generateReportAuthenticator } from '../../excel/generate_report'
import apps from '../../models/apps'
import Authenticator from '../../models/authenticator'
import users from '../../models/users'
import worker from '../../models/worker'
import { userWorkerAggregate } from '../../utils/aggregation'

export const resolver = {
  Query: {
    async listAuthenticator(
      obj: any,
      { page, limit, filters = [] }: { page: any; limit: any; filters: any }
    ) {
      const searched = JSON.parse(JSON.stringify(filters.filters))
      delete searched.start
      delete searched.end
      const myAggregate = Authenticator.aggregate([
        {
          $match: {
            status: 'success'
          }
        },
        ...userWorkerAggregate,
        ...searched
          .map((e: any) => ({
            [`finalUser.${Object.keys(e)[0]}`]: {
              $regex: e[Object.keys(e)[0]],
              $options: 'i'
            }
          }))
          .map((e: any) => ({
            $match: e
          })),
        {
          $match: {
            createdAt: {
              $gte: moment(filters.start).toDate(),
              $lte: moment(filters.end).toDate()
            }
          }
        },
        { $sort: { createdAt: 1 } }
      ])
      //@ts-ignore
      const value = await Authenticator.aggregatePaginate(myAggregate, {
        limit: limit && limit > 0 ? limit : 10,
        page
      })

      // return await Authenticator.find({ status: 'success' }).lean()

      return value
    },
    async getAuthenticator(_: any, { _id }: any) {
      return await Authenticator.findById(_id._id).lean()
    }
  },
  Mutation: {
    async generateExcelAuthenticator(
      obj: any,
      { page, limit, filters = [] }: { page: any; limit: any; filters: any }
    ) {
      const searched = JSON.parse(JSON.stringify(filters.filters))
      delete searched.start
      delete searched.end
      const myAggregate = await Authenticator.aggregate([
        {
          $match: {
            status: 'success'
          }
        },
        ...userWorkerAggregate,
        ...searched
          .map((e: any) => ({
            [`finalUser.${Object.keys(e)[0]}`]: {
              $regex: e[Object.keys(e)[0]],
              $options: 'i'
            }
          }))
          .map((e: any) => ({
            $match: e
          })),
        {
          $match: {
            createdAt: {
              $gte: moment(filters.start).toDate(),
              $lte: moment(filters.end).toDate()
            }
          }
        },
        { $sort: { created_at: 1 } },
        {
          $lookup: {
            from: 'apps',
            localField: 'app',
            foreignField: '_id',
            as: 'app'
          }
        },
        {
          $unwind: {
            path: '$app',
            preserveNullAndEmptyArrays: true
          }
        }
      ])
      return await generateReportAuthenticator(myAggregate.reverse())
    },
    async generatePDFAuthenticator(
      obj: any,
      { page, limit, filters = [] }: { page: any; limit: any; filters: any }
    ) {
      const searched = JSON.parse(JSON.stringify(filters.filters))
      delete searched.start
      delete searched.end
      const myAggregate = await Authenticator.aggregate([
        {
          $match: {
            status: 'success'
          }
        },
        ...userWorkerAggregate,
        ...searched
          .map((e: any) => ({
            [`finalUser.${Object.keys(e)[0]}`]: {
              $regex: e[Object.keys(e)[0]],
              $options: 'i'
            }
          }))
          .map((e: any) => ({
            $match: e
          })),
        {
          $match: {
            createdAt: {
              $gte: moment(filters.start).toDate(),
              $lte: moment(filters.end).toDate()
            }
          }
        },
        { $sort: { created_at: 1 } },
        {
          $lookup: {
            from: 'apps',
            localField: 'app',
            foreignField: '_id',
            as: 'app'
          }
        },
        {
          $unwind: {
            path: '$app',
            preserveNullAndEmptyArrays: true
          }
        }
      ])

      return await convertToPdf(myAggregate.reverse())
    },
    async createAuthenticator(_: any, { input }: any) {
      const newAuthenticator = new Authenticator(input)
      return await newAuthenticator.save()
    },
    async updateAuthenticator(_: any, { input }: any) {
      try {
        return await Authenticator.findByIdAndUpdate(input._id, input)
      } catch (error) {
        console.error(error)
      }
    },
    async deleteAuthenticator(_: any, { input }: any) {
      return await Authenticator.findByIdAndDelete(input._id)
    },
    async deleteAuthenticatorAll() {
      return await Authenticator.remove({})
    }
  },
  Authenticator: {
    user: async (parent: IAuthenticator) => {
      return await users.findById(parent.user)
    },
    app: async (parent: IAuthenticator) => {
      return await apps.findById(parent.app)
    },
    worker: async (parent: IAuthenticator) => {
      return await worker.findById(parent.worker)
    }
  }
}
