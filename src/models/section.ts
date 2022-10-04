//dependecies
import { ISections } from '../interfaces'
import { Schema, model, models } from 'mongoose'

const sectionSechema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true }
  },
  { timestamps: true }
)

export default models['Section']
  ? model<ISections>('Section')
  : model<ISections>('Section', sectionSechema)
