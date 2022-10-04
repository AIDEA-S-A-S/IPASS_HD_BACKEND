//dependecies
import { IVisitorPlace } from '../interfaces'
import { Schema, model, models } from 'mongoose'

const visitorPlaceSchema: Schema = new Schema(
  {
    name: { type: String, required: true }
  },
  { timestamps: true }
)
export default models['visitorPlace']
  ? model<IVisitorPlace>('visitorPlace')
  : model<IVisitorPlace>('visitorPlace', visitorPlaceSchema)
