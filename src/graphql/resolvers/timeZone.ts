import TimeZone from '../../models/timeZone'

export const resolver = {
  Query: {
    async listTimeZone() {
      return await TimeZone.find().lean()
    },
    async getTimeZone(_: any, { _id }: any) {
      return await TimeZone.findById(_id).lean()
    }
  },
  Mutation: {
    async createTimeZone(_: any, { input }: any) {
      try {
        const newTimeZone = new TimeZone(input)
        return await newTimeZone.save()
      } catch (error) {
        console.error(error)
        throw new Error(error.message)
      }
    },
    async updateTimeZone(_: any, { input }: any) {
      try {
        return await TimeZone.findByIdAndUpdate(input._id, input)
      } catch (error) {
        console.error(error)
      }
    },
    async deleteTimeZone(_: any, { input }: any) {
      return await TimeZone.findByIdAndDelete(input._id)
    },
    async deleteTimeZoneAll() {
      return await TimeZone.remove({})
    }
  }
}
