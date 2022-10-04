//dependecies
import { model, models, Schema } from 'mongoose'
//Types
import { IGalery } from '../interfaces'

const galerySchema: Schema = new Schema(
  {
    name: { type: String, required: true }
  },
  {
    timestamps: true
  }
)

export default models['Galery'] ? model<IGalery>('Galery') : model<IGalery>('Galery', galerySchema)
