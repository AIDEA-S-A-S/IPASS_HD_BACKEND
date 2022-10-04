//dependecies
import { model, models, Schema } from 'mongoose'
import { IDevice } from '../interfaces'

const deviceSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    serialNumber: { type: String, required: true, unique: true },
    status: { type: String },
    exists: { type: Boolean },
    actualLocation: { type: Schema.Types.ObjectId, ref: 'Location' },
    enableVideo: { type: Boolean, required: true },
    enableTalk: { type: Boolean, required: true },
    timeWait: { type: Number }
  },
  { timestamps: true }
)
export default models['Device'] ? model<IDevice>('Device') : model<IDevice>('Device', deviceSchema)
