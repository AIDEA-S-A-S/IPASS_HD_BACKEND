import Privilege from '../../models/privilege'

export const resolver = {
  Query: {
    async listPrivilege() {
      return await Privilege.find().lean()
    },
    async getPrivilege(_: any, { _id }: any) {
      return await Privilege.findById(_id).lean()
    }
  },
  Mutation: {
    async createPrivilege(_: any, { input }: any) {
      try {
        const newPrivilege = new Privilege(input)
        return await newPrivilege.save()
      } catch (err) {
        console.error(err)
        throw new Error('Something were wrong...')
      }
    },
    async updatePrivilege(_: any, { input }: any) {
      return await Privilege.findByIdAndUpdate(input._id, input)
    },
    async deletePrivilege(_: any, { input }: any) {
      return await Privilege.findByIdAndDelete(input._id)
    },
    async deletePrivilegeAll() {
      return await Privilege.remove({})
    }
  }
}
