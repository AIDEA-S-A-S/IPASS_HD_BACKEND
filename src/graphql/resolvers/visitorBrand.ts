import visitorCategory from '../../models/visitorCategory'
import VisitorBrand from '../../models/visitorBrand'
import { addFileS3, deleteFileS3, getFileS3, managementFileS3 } from '../../utils/files'
import { grapqhlFile, IContextGraphql, IVisitorBrand } from 'interfaces'

export const resolver = {
  Query: {
    async listVisitorBrand() {
      return await VisitorBrand.find().lean()
    },
    async getVisitorBrand(_: any, { _id }: any) {
      return await VisitorBrand.findById(_id).lean()
    },
    async getVisitorBrandByCategory(_: any, { categoryID }: any) {
      return await VisitorBrand.find({ category: { $eq: categoryID } })
    }
  },
  Mutation: {
    async createVisitorBrand(_: any, { input }: any, context: IContextGraphql) {
      input.photo = await addFileS3(input.photo as grapqhlFile, context.isProd, 'brand')
      const newVisitorBrand = new VisitorBrand(input)
      return await newVisitorBrand.save()
    },
    async updateVisitorBrand(_: any, { input }: any, context: IContextGraphql) {
      try {
        const actualBrand = await VisitorBrand.findById(input._id)
        input.photo = await managementFileS3(
          input.photo as grapqhlFile,
          actualBrand.photo,
          'brand',
          context.isProd
        )
        return await VisitorBrand.findByIdAndUpdate(input._id, input)
      } catch (error) {
        console.error(error)
      }
    },
    async deleteVisitorBrand(_: any, { input }: any) {
      const actualBrand = await VisitorBrand.findById(input._id)
      deleteFileS3(actualBrand.photo)
      return await VisitorBrand.findByIdAndDelete(input._id)
    },
    async deleteVisitorBrandAll() {
      return await VisitorBrand.remove({})
    }
  },
  VisitorBrand: {
    category: async (parent: IVisitorBrand) => {
      return await visitorCategory.findById(parent.category).lean()
    },
    photo: async (parent: IVisitorBrand) => {
      if (parent.photo.key.includes('https://ipass-oac.s3.amazonaws.com')) {
        return parent.photo
      }
      return getFileS3(parent.photo)
    }
  }
}
