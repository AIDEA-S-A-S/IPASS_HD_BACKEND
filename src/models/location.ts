//dependecies
import { ILocation } from '../interfaces'
import { Schema, model, models } from 'mongoose'

const locationSchema: Schema = new Schema(
  {
    masterLocation: { type: Schema.Types.ObjectId, ref: 'MasterLocation' },
    childLocations: { type: [{ type: Schema.Types.ObjectId, ref: 'Location' }] },
    parentLocations: { type: [{ type: Schema.Types.ObjectId, ref: 'Location' }] },
    address: { type: String, required: true },
    name: { type: String, required: true },
    admins: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }] },
    typeCheck: { type: String, required: true },
    host: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }] },
    device: { type: Schema.Types.ObjectId, ref: 'Device' },
    security: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }] },
    state: { type: String },
    empresa: { type: String },
    deletedDate: { type: Date },
    whoDeleted: { type: Schema.Types.ObjectId, ref: 'User' },
    abbreviation: { type: String }
  },

  { timestamps: true }
)
export default models['Location']
  ? model<ILocation>('Location')
  : model<ILocation>('Location', locationSchema)
