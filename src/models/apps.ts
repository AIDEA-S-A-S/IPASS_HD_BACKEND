//dependecies
import { model, models, Schema } from 'mongoose'
import { IApps } from '../interfaces'

const appsSchema: Schema = new Schema(
  {
    name: { type: String },
    url: { type: String, required: true, unique: true },
    clientID: { type: String, required: true, unique: true },
    abbreviation: { type: String, required: true, unique: true },
    clientIDSecret: { type: String, required: true, unique: true },
    tokenKey: { type: String, required: true, unique: true }
  },

  { timestamps: true }
)
export default models['apps'] ? model<IApps>('apps') : model<IApps>('apps', appsSchema)
