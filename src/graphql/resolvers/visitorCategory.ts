import VisitorCategory from '../../models/visitorCategory'

export const resolver = {
  Query: {
    async listVisitorCategory() {
      return await VisitorCategory.find().lean()
    },
    async getVisitorCategory(_: any, { _id }: any) {
      return await VisitorCategory.findById(_id).lean()
    }
  },
  Mutation: {
    async createVisitorCategory(_: any, { input }: any) {
      const newVisitorCategory = new VisitorCategory(input)
      return await newVisitorCategory.save()
    },
    async updateVisitorCategory(_: any, { input }: any) {
      try {
        return await VisitorCategory.findByIdAndUpdate(input._id, input)
      } catch (error) {
        console.error(error)
      }
    },
    async deleteVisitorCategory(_: any, { input }: any) {
      return await VisitorCategory.findByIdAndDelete(input._id)
    },
    async deleteVisitorCategoryAll() {
      return await VisitorCategory.remove({})
    }
  }
}
