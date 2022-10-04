//dependecies
import { IMasterLocation } from 'interfaces'
import { Schema, model, models } from 'mongoose'

const masterLocationSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: [{ type: Schema.Types.ObjectId, ref: 'Location' }] },
    onlyAllowAuthUSers: Boolean,
    state: { type: String },
    deletedDate: { type: Date },
    whoDeleted: { type: Schema.Types.ObjectId, ref: 'User' },
    tree: { type: Object }
  },

  { timestamps: true }
)
export default models['MasterLocation']
  ? model<IMasterLocation>('MasterLocation')
  : model<IMasterLocation>('MasterLocation', masterLocationSchema)
