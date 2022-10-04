import { IBreach } from 'interfaces'
import breach from '../../models/breach'
import Location from '../../models/location'
import Contact from '../../models/contact'
import Worker from '../../models/worker'
import User from '../../models/users'
import moment from 'moment-timezone'
import contact from '../../models/contact'
import { getFiltersTable, userWorkerAggregate } from '../../utils/aggregation'
import { generateReportBreach, generateReportBreachPDF } from '../../excel/generate_report'
import location from '../../models/location'

export const resolver = {
  Query: {
    async listBreach() {
      return await breach.find().lean()
    },
    async listBreachLast2Days() {
      const after = moment().subtract(2, 'day')
      //@ts-ignore
      return await breach
        .find({
          createdAt: {
            $gte: after.startOf('day').format()
          }
        })
        .lean()
    },
    async listBreachLast2DaysApp(
      _: any,
      { page, limit, filters = [] }: { page: any; limit: any; filters: any }
    ) {
      const searched = JSON.parse(JSON.stringify(filters.filters))
      delete searched.start
      delete searched.end
      //@ts-ignore
      const myAggregate = breach.aggregate([
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
        ...getFiltersTable(filters.selected),
        {
          $match: {
            createdAt: {
              $gte: moment(filters.start).toDate(),
              $lte: moment(filters.end).toDate()
            }
          }
        },
        { $sort: { createdAt: -1 } }
      ])
      //@ts-ignore
      const resp = await breach.aggregatePaginate(myAggregate, {
        limit: limit && limit > 0 ? limit : 10,
        page
      })

      for (let k = 0; k < resp.docs.length; k++) {
        if (resp.docs[k].user) {
          resp.docs[k].user = await User.findById(
            JSON.parse(JSON.stringify(resp.docs[k].user._id))
          ).populate('nativeLocation')
        }
        if (resp.docs[k].worker) {
          resp.docs[k].worker = await Worker.findById(
            JSON.parse(JSON.stringify(resp.docs[k].worker._id))
          ).populate('nativeLocation')
        }
      }

      return resp
    },
    async getBreach(_: any, { _id }: any) {
      return await breach.findById(_id).lean()
    },
    async generaReportBreach(
      _: any,
      { page, limit, filters = [] }: { page: any; limit: any; filters: any }
    ) {
      const searched = JSON.parse(JSON.stringify(filters.filters))
      delete searched.start
      delete searched.end
      //@ts-ignore
      const resp = await breach.aggregate([
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
        ...getFiltersTable(filters.selected),
        {
          $match: {
            createdAt: {
              $gte: moment(filters.start).toDate(),
              $lte: moment(filters.end).toDate()
            }
          }
        },
        { $sort: { createdAt: -1 } }
      ])

      for (let k = 0; k < resp.length; k++) {
        resp[k].location = await location.findById(JSON.parse(JSON.stringify(resp[k].location)))
        if (resp[k].user) {
          resp[k].user = await User.findById(JSON.parse(JSON.stringify(resp[k].user._id))).populate(
            'nativeLocation'
          )
        }
        if (resp[k].worker) {
          resp[k].worker = await Worker.findById(
            JSON.parse(JSON.stringify(resp[k].worker._id))
          ).populate('nativeLocation')
        }
      }
      return generateReportBreach(resp)
    },
    async generaReportBreachPDF(
      _: any,
      { page, limit, filters = [] }: { page: any; limit: any; filters: any }
    ) {
      const searched = JSON.parse(JSON.stringify(filters.filters))
      delete searched.start
      delete searched.end
      //@ts-ignore
      const resp = await breach.aggregate([
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
        ...getFiltersTable(filters.selected),
        {
          $match: {
            createdAt: {
              $gte: moment(filters.start).toDate(),
              $lte: moment(filters.end).toDate()
            }
          }
        },
        { $sort: { createdAt: -1 } }
      ])

      for (let k = 0; k < resp.length; k++) {
        resp[k].location = await location.findById(JSON.parse(JSON.stringify(resp[k].location)))
        if (resp[k].user) {
          resp[k].user = await User.findById(JSON.parse(JSON.stringify(resp[k].user._id))).populate(
            'nativeLocation'
          )
        }
        if (resp[k].worker) {
          resp[k].worker = await Worker.findById(
            JSON.parse(JSON.stringify(resp[k].worker._id))
          ).populate('nativeLocation')
        }
      }
      return generateReportBreachPDF(resp)
    }
  },
  Mutation: {
    async createBreach(_: any, { input }: any) {
      const newBreach = new breach(input)
      await newBreach.save()
      return true
    },
    async updateBreach(_: any, { input }: any) {
      await breach.findByIdAndUpdate(input._id, input)
      return true
    },

    async unBanUser(_: any, { input }: any) {
      const actualBreach = JSON.parse(
        JSON.stringify(
          await breach.findById(input._id).populate('worker').populate('contact').populate('user')
        )
      )
      if (actualBreach.contact) {
        await contact.findByIdAndUpdate(actualBreach.contact._id, { banFinish: null })
      } else if (actualBreach.user) {
        await User.findByIdAndUpdate(actualBreach.user._id, { banFinish: null })
      } else if (actualBreach.worker) {
        await Worker.findByIdAndUpdate(actualBreach.worker._id, { banFinish: null })
      }
      return true
    },
    async deleteBreach(_: any, { input }: any) {
      try {
        await breach.findByIdAndDelete(input._id)
        return true
      } catch (error: any) {
        throw new Error(error)
      }
    },
    async deleteBreachAll() {
      try {
        await breach.remove({})
        return true
      } catch (error: any) {
        throw new Error(error)
      }
    }
  },
  Breach: {
    location: async (parent: IBreach) => {
      return await Location.findById(parent.location).lean()
    },
    worker: async (parent: IBreach) => {
      return await Worker.findById(parent.worker).lean()
    },
    contact: async (parent: IBreach) => {
      return await Contact.findById(parent.contact).lean()
    },
    user: async (parent: IBreach) => {
      return await User.findById(parent.user).lean()
    }
  }
}
