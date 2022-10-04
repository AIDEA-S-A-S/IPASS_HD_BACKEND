//dependecies
import { IVisitorCategory } from '../interfaces'
import { Schema, model, models } from 'mongoose'

const visitorCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true }
  },
  { timestamps: true }
)
export default models['visitorCategory']
  ? model<IVisitorCategory>('visitorCategory')
  : model<IVisitorCategory>('visitorCategory', visitorCategorySchema)
