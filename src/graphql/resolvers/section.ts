import Section from '../../models/section'

export const resolver = {
  Query: {
    async listSection() {
      return await Section.find().lean()
    },
    async getSection(_: any, { _id }: any) {
      return await Section.findById(_id._id).lean()
    }
  },
  Mutation: {
    async createSection(_: any, { input }: any) {
      const newSection = new Section(input)
      return await newSection.save()
    },
    async updateSection(_: any, { input }: any) {
      try {
        return await Section.findByIdAndUpdate(input._id, input)
      } catch (error: any) {
        console.error(error)
      }
    },
    async deleteSection(_: any, { input }: any) {
      return await Section.findByIdAndDelete(input._id)
    },
    async deleteSectionAll() {
      return await Section.remove({})
    }
  }
}
