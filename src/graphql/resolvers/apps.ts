import Apps from '../../models/apps'
import randomBytes from 'randombytes'
export const resolver = {
  Query: {
    async listApps() {
      return await Apps.find().lean()
    },
    async getApps(_: any, { _id }: any) {
      return await Apps.findById(_id._id).lean()
    }
  },
  Mutation: {
    async createApps(_: any, { input }: any) {
      const newApps = new Apps({
        ...input,
        clientID: randomBytes(3 * 4).toString('base64'),
        clientIDSecret: randomBytes(3 * 4).toString('base64')
      })
      return await newApps.save()
    },
    async updateApps(_: any, { input }: any) {
      try {
        return await Apps.findByIdAndUpdate(input._id, input)
      } catch (error) {
        console.error(error)
      }
    },
    async deleteApps(_: any, { input }: any) {
      return await Apps.findByIdAndDelete(input._id)
    },
    async deleteAppsAll() {
      return await Apps.remove({})
    }
  }
}
