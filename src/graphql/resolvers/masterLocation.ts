import users from '../../models/users'
import { IContextGraphql, IEvent, ILocation, IMasterLocation, IUser } from 'interfaces'
import Location from '../../models/location'
import masterLocation from '../../models/masterLocation'
import { getPermisionsFromToken } from '../../utils'

export const resolver = {
  Query: {
    async listMasterLocation(_: any, _2: any, context: IContextGraphql) {
      try {
        const { user, privilege, permision } = await getPermisionsFromToken(
          context.req.tokenAuth as string,
          'MasterLocation'
        )

        if (privilege.name === 'Super_admin') {
          return await masterLocation.find().lean()
        } else if (privilege.name === 'admin') {
          return await masterLocation.find({ admins: { $in: [user._id] } }).lean()
        } else {
          if (permision.read) {
            return await masterLocation.find().lean()
          } else {
            throw new Error('No permition')
          }
        }
      } catch (error) {
        console.error(error)
        if (context.isProd) {
          throw new Error(error)
        } else {
          return await masterLocation.find().lean()
        }
      }
    },
    async listMasterLocationActive(_: any, _2: any, context: IContextGraphql) {
      try {
        const { user, privilege, permision } = await getPermisionsFromToken(
          context.req.tokenAuth as string,
          'MasterLocation'
        )
        if (privilege.name === 'Super_admin') {
          return await masterLocation.find({ state: { $eq: 'active' } }).lean()
        } else if (privilege.name === 'admin') {
          return await masterLocation
            .find({ admins: { $in: [user._id] }, state: { $eq: 'active' } })
            .lean()
        } else {
          if (permision.read) {
            return await masterLocation.find({ state: { $eq: 'active' } }).lean()
          } else {
            throw new Error('No permition')
          }
        }
      } catch (error) {
        if (context.isProd) {
          throw new Error(error)
        } else {
          return await masterLocation.find({ state: { $eq: 'active' } }).lean()
        }
      }
    },
    async getMasterLocation(_: any, { _id }: any) {
      return await masterLocation.findById(_id).lean()
    }
  },
  Mutation: {
    async createMasterLocation(_: any, { input }: { input: IMasterLocation }) {
      const newMasterLocation = new masterLocation(input)
      if (input.location?.length > 0) {
        ;(input.location as string[]).forEach(
          async location =>
            await Location.findByIdAndUpdate(location, { masterLocation: newMasterLocation._id })
        )
      }
      newMasterLocation.state = 'active'
      const saved: IMasterLocation = JSON.parse(JSON.stringify(await newMasterLocation.save()))
      return saved
    },
    async updateMasterLocation(_: any, { input }: { input: IMasterLocation }) {
      try {
        const updated: IMasterLocation = await masterLocation.findByIdAndUpdate(input._id, input)
        if (input.location) {
          ;(input.location as string[])?.forEach(async location => {
            await Location.findByIdAndUpdate(location, { masterLocation: input._id })
          })
          const toDelete = (JSON.parse(JSON.stringify(updated.location)) as string[])
            .map(e => ((input.location as string[])?.includes(e) ? null : e))
            .filter(x => x !== null)

          toDelete?.forEach(
            async element => await Location.findByIdAndUpdate(element, { masterLocation: null })
          )
        }

        return updated
      } catch (error) {
        console.error(error)
      }
    },
    async deleteMasterLocation(_: any, { input }: any) {
      const deleted = await masterLocation.findByIdAndDelete(input._id)

      return deleted
    },
    async deleteMasterLocationChangeStatus(_: any, { input }: any) {
      const actualDate = new Date()
      const updateMasterLocation = {
        whoDeleted: input.whoDeleted,
        state: 'deleted',
        deletedDate: actualDate
      }
      const deleted = await masterLocation.findByIdAndUpdate(input._id, updateMasterLocation as any)
      const toDelete: IMasterLocation = JSON.parse(JSON.stringify(input))
      toDelete.operation = 'delete'

      return deleted
    },
    async deleteMasterLocationAll() {
      return await masterLocation.remove({})
    },
    async createDummyData(_: any, { count }: { count: number }) {
      const newIds = []
      for (let k = 0; k < count; k++) {
        const newMasterLocation = new masterLocation({
          name: `fakeName-${k}`,
          address: `fakeAddress-${k}`,
          onlyAllowAuthUSers: [true, false][Math.floor(Math.random() * 2)]
        })
        newIds.push(await (await newMasterLocation.save())._id)
      }

      return true
    }
  },
  MasterLocation: {
    location: async (parent: IMasterLocation) => {
      return (parent.location as string[]).map(async e => await Location.findById(e).lean())
    },
    whoDeleted: async (parent: IEvent) => {
      return users.findById(parent.whoDeleted)
    }
  }
}
