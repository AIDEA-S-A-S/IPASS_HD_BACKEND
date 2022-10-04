import VisitorPlace from '../../models/visitorPlace'

export const resolver = {
  Query: {
    async listVisitorPlace() {
      return await VisitorPlace.find().lean()
    },
    async getVisitorPlace(_: any, { _id }: any) {
      return await VisitorPlace.findById(_id).lean()
    }
  },
  Mutation: {
    async createVisitorPlace(_: any, { input }: any) {
      const newVisitorPlace = new VisitorPlace(input)
      return await newVisitorPlace.save()
    },
    async updateVisitorPlace(_: any, { input }: any) {
      try {
        return await VisitorPlace.findByIdAndUpdate(input._id, input)
      } catch (error) {
        console.error(error)
      }
    },
    async deleteVisitorPlace(_: any, { input }: any) {
      return await VisitorPlace.findByIdAndDelete(input._id)
    },
    async deleteVisitorPlaceAll() {
      return await VisitorPlace.remove({})
    }
  }
}
