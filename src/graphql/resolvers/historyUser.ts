import privilege from '../../models/privilege'
import { IContextGraphql, IHistoryUser } from 'interfaces'
import historyUser from '../../models/historyUser'
import users from '../../models/users'
import { getPermisionsFromToken } from '../../utils'
export const resolver = {
  Query: {
    async listHistoryUser(_: any, _2: any, context: IContextGraphql) {
      try {
        const { user, privilege, permision } = await getPermisionsFromToken(
          context.req.tokenAuth as string,
          'Event'
        )
        if (privilege.name === 'Super_admin') {
          return await historyUser.find().lean()
        } else if (privilege.name === 'admin') {
          return await historyUser.find({ admins: { $in: [user._id] } }).lean()
        } else {
          if (permision.read) {
            return await historyUser.find().lean()
          } else {
            throw new Error('No permition')
          }
        }
      } catch (error) {
        if (context.isProd) {
          throw new Error(error)
        } else {
          return await historyUser.find().lean()
        }
      }
    },
    async getHistoryUser(_: any, { _id }: any) {
      return await historyUser.findById(_id).lean()
    }
  },
  Mutation: {
    async createHistoryUser(_: any, { input }: { input: IHistoryUser }) {
      try {
        const newHistoryUser = new historyUser(input)
        const saved = await newHistoryUser.save()
        return saved
      } catch (error) {
        throw new Error(error)
      }
    },
    async deleteHistoryUser(_: any, { input }: any) {
      const deleted = await historyUser.findByIdAndDelete(input._id)
      return deleted
    },
    async deleteHistoryUserAll() {
      return await historyUser.remove({})
    }
  },
  HistoryUser: {
    whoDeleted: async (parent: IHistoryUser) => {
      return await users.findById(parent.whoDeleted)
    },
    privilegeID: async (parent: IHistoryUser) => {
      return await privilege.findById(parent.privilegeID)
    }
  }
}
