import { IAuthMiddleware, IContextGraphql, IPrivilege, IUser } from '../../interfaces'
import Language from '../../lang'
import Privileges from '../../models/privilege'
//Models
import User from '../../models/users'
import { getPermisionsFromToken, messageSignUp, sendEmail } from '../../utils'
import { getFiltersTable } from '../../utils/aggregation'
import Privilege from '../../models/privilege'
import masterLocation from '../../models/masterLocation'
import groupWorker from '../../models/groupWorker'
import location from '../../models/location'
import timeZone from '../../models/timeZone'
import mongoose from 'mongoose'
import keyUser from '../../models/keyUser'
import worker from '../../models/worker'
import apps from '../../models/apps'
import { addFileS3, deleteFileS3, toUpdateFiles } from '../../utils/files'
export const resolver = {
  Query: {
    async verifyKeyUser(obj: any, args: any, context: IAuthMiddleware) {
      return await keyUser.findOne({ key: 'JIT-271517-RENAP#OTGHZ' })
    },
    async countUserWorker() {
      const users = await User.count()
      const workers = await groupWorker.count()
      return users + workers
    },
    async listUser(
      obj: any,
      { page, limit, filters = [] }: { page: any; limit: any; filters: any },
      context: IContextGraphql
    ) {
      const { user, privilege, permision } = await getPermisionsFromToken(
        context.req.tokenAuth as string,
        'Users'
      )
      var myAggregate
      if (privilege.name === 'Super_admin') {
        myAggregate = User.aggregate([...getFiltersTable(filters), { $sort: { createdAt: -1 } }])
      } else if (privilege.name === 'admin') {
        myAggregate = User.aggregate([
          ...getFiltersTable(filters),
          {
            $match: {
              admin: new mongoose.Types.ObjectId(user._id)
            }
          },
          { $sort: { createdAt: -1 } }
        ])
      } else {
        if (permision.read) {
          myAggregate = User.aggregate([...getFiltersTable(filters)])
        } else {
          throw new Error('No permition')
        }
      }

      //@ts-ignore
      return await User.aggregatePaginate(myAggregate, {
        limit: limit && limit > 0 ? limit : 10,
        page
      })
    },
    async listAllUsers(obj: any, args: any, context: IContextGraphql) {
      try {
        const { user, privilege, permision } = await getPermisionsFromToken(
          context.req.tokenAuth as string,
          'Users'
        )
        if (privilege.name === 'Super_admin') {
          return await User.find().lean()
        } else if (privilege.name === 'admin') {
          return await User.find({ admin: { $eq: user._id } }).lean()
        } else {
          if (permision.read) {
            return await masterLocation.find().lean()
          } else {
            throw new Error('No permition')
          }
        }
      } catch (error) {
        if (context.isProd) {
          throw new Error(error)
        } else {
          return await User.find().lean()
        }
      }
    },
    async getUser(obj: any, { _id }: any, _: any) {
      return await User.findById(_id).lean()
    },
    async getUsersAdmin(obj: any, args: any, _: any) {
      const adminPriv = await Privileges.findOne({ name: { $eq: 'admin' } })
      return await User.find({ privilegeID: { $eq: adminPriv._id } }).lean()
    },
    async getUserHost(obj: any, args: any, context: IContextGraphql) {
      try {
        const { user, privilege } = await getPermisionsFromToken(
          context.req.tokenAuth as string,
          'Users'
        )
        const hostPriv = await Privilege.findOne({ name: { $eq: 'host' } }).lean()
        if (privilege.name === 'admin') {
          return await User.find({
            admin: { $eq: user._id },
            privilegeID: { $eq: hostPriv._id }
          }).lean()
        } else if (privilege.name === 'Super_admin') {
          return await User.find({
            privilegeID: { $eq: hostPriv._id }
          }).lean()
        } else {
          throw new Error('No permition')
        }
      } catch (error) {
        if (context.isProd) {
          throw new Error(error)
        } else {
          const hostPriv = await Privilege.findOne({ name: { $eq: 'host' } }).lean()
          return await User.find({
            privilegeID: { $eq: hostPriv._id }
          }).lean()
        }
      }
    },
    async getUsersSecurity(obj: any, args: any, context: IAuthMiddleware) {
      const adminPriv = await Privilege.findOne({ name: { $eq: 'security' } })
      const users = await User.find({ privilegeID: { $eq: adminPriv._id } }).lean()
      return users
    }
  },
  Mutation: {
    async addKeyUser(obj: any, { key }: any, context: IContextGraphql) {
      if (key === 'JIT-271517-RENAP#OTGHZ') {
        const newKeyUser = new keyUser({
          key,
          expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30 * 12)
        })
        await newKeyUser.save()
        return true
      } else {
        return false
      }
    },
    async createUser(_: any, input: { input: IUser }, context: IContextGraphql) {
      try {
        const isUser = await User.findOne({ email: input.input.email })
        if (!isUser) {
          input?.input.photo &&
            (input.input.photo = await addFileS3(input.input.photo as any, context.isProd, 'USER'))
          const lang = input.input.lang || 'es'
          delete input.input['lang']
          const { user, privilege } = await getPermisionsFromToken(
            context.req.tokenAuth as string,
            'Users'
          )
          const RoleID: IPrivilege = await Privilege.findById(input.input.privilegeID)
          const newUser = new User({
            ...input.input,
            active: false,
            ...(privilege.name === 'admin' ? { admin: user._id } : {})
          })

          const created = await User.create(newUser)
          await sendEmail(
            newUser.email,
            messageSignUp(lang, newUser._id),
            Language.emailSubjectSignUp[lang]
          )
          // }
          return true
        } else {
          throw new Error('Something were wrong...')
        }
      } catch (err) {
        console.error(err)
        throw new Error('Something were wrong...')
      }
    },

    async updateUser(_: any, { input }: any, context: IContextGraphql) {
      try {
        const user = await User.findById(input._id)
        input?.photo &&
          (input.photo = await toUpdateFiles(user.photo, input.photo, context.isProd, 'WORKER'))
        await User.findByIdAndUpdate(input._id, input)
        return true
      } catch (error: any) {
        throw new Error('error')
      }
    },
    async deleteUser(_: any, { input }: any) {
      try {
        const user = await User.findById(input._id)
        if (user?.photo) {
          await deleteFileS3(user.photo)
        }
        await User.findByIdAndDelete(input._id)
        return true
      } catch (error: any) {
        throw new Error('error')
      }
    },
    async deleteUserAll(_: any, { input }: any) {
      return await User.remove({})
    },
    async setPushToken(_: any, { _id, token, type }: any) {
      try {
        if (type === 'worker') await worker.findByIdAndUpdate(_id, { $set: { tokenExpo: token } })
        if (type === 'user') await User.findByIdAndUpdate(_id, { $set: { tokenExpo: token } })
        return true
      } catch (error) {
        console.error(error)
        throw new Error(error)
      }
    },
    async resetToken(_: any, { _id, type }: any) {
      try {
        if (type === 'worker') await worker.findByIdAndUpdate(_id, { $set: { tokenExpo: null } })
        if (type === 'user') await User.findByIdAndUpdate(_id, { $set: { tokenExpo: null } })
        return true
      } catch (error) {
        console.error(error)
        throw new Error(error)
      }
    }
  },
  // Subscription: {
  //   subUser: {
  //     resolve: async (args: any) => {
  //       return await User.find().lean()
  //     },
  //     subscribe: () => {
  //       return pubsub.asyncIterator(MODIFIED_USER)
  //     }
  //   }
  // },
  User: {
    privilegeID: async (parent: IUser) => {
      return Privileges.findOne({ _id: parent.privilegeID }).lean()
    },
    group: async (parent: IUser) => {
      return (parent.group as string[])?.map(async e => await groupWorker.findById(e).lean())
    },
    nativeLocation: async (parent: IUser) => {
      return parent.nativeLocation?.length > 0
        ? (parent.nativeLocation as string[])?.map(async e => await location.findById(e).lean())
        : []
    },
    timeZone: async (parent: IUser) => {
      return (parent.timeZone as string[])?.map(async e => await timeZone.findById(e).lean())
    },
    apps: async (parent: IUser) => {
      return (parent?.apps as string[])?.map(async e => await apps.findById(e).lean())
    }
  }
}
