//dependecies
import { model, models, Schema } from 'mongoose'
//Types
import { IGroupWorker } from '../interfaces'
const workerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    location: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Location'
      }
    ],
    abbreviation: { type: String, required: true },
    exists: Boolean
  },
  {
    timestamps: true
  }
)

export default models['GroupWorker']
  ? model<IGroupWorker>('GroupWorker')
  : model<IGroupWorker>('GroupWorker', workerSchema)
