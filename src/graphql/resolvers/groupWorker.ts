import Location from '../../models/location'
import { IGroupWorker } from 'interfaces'
import GroupWorker from '../../models/groupWorker'
import location from '../../models/location'

export const resolver = {
  Query: {
    async listGroupWorker() {
      return await GroupWorker.find().lean()
    },
    async listGroupWorkerIfExist() {
      return await GroupWorker.find({ exists: { $eq: true } }).lean()
    }
  },
  Mutation: {
    async createGroupWorker(_: any, { input }: any) {
      try {
        const groupWorker = new GroupWorker({ ...input, exists: true })
        const saved = await groupWorker.save()
        return true
      } catch (error) {
        throw new Error(error)
      }
    },
    async updateGroupWorker(_: any, { input }: any) {
      try {
        const saved = await GroupWorker.findByIdAndUpdate(input._id, input)
        return true
      } catch {
        throw new Error('Error')
      }
    },
    async deleteGroupWorker(_: any, { input }: any) {
      try {
        await GroupWorker.findByIdAndUpdate(input._id, { exists: false })
        return true
      } catch (error: any) {
        throw new Error(error)
      }
    },
    async deleteGroupWorkerAll() {
      try {
        await GroupWorker.remove({})
        return true
      } catch (error: any) {
        throw new Error(error)
      }
    }
  },
  GroupWorker: {
    location: async (parent: IGroupWorker) => {
      return (parent.location as string[]).map(async e => await location.findById(e).lean())
    }
  }
}
