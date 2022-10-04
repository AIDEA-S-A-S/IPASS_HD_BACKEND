//dependecies
import { IVisitorBrand } from '../interfaces'
import { Schema, model, models } from 'mongoose'

const visitorBrandSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    photo: {
      filename: String,
      key: String
    },
    category: { type: Schema.Types.ObjectId, ref: 'visitorCategory' }
  },
  { timestamps: true }
)
export default models['visitorBrand']
  ? model<IVisitorBrand>('visitorBrand')
  : model<IVisitorBrand>('visitorBrand', visitorBrandSchema)
