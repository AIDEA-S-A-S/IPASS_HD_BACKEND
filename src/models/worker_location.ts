//dependecies
import { IWorkerLocation } from '../interfaces'
import { Schema, model, models } from 'mongoose'

const workerLocationSchema: Schema = new Schema(
  {
    worker: { type: [{ type: Schema.Types.ObjectId, ref: 'Worker' }], required: true },
    location: { type: [{ type: Schema.Types.ObjectId, ref: 'Location' }], required: true }
  },

  { timestamps: true }
)
export default models['Worker_Location']
  ? model<IWorkerLocation>('Worker_Location')
  : model<IWorkerLocation>('Worker_Location', workerLocationSchema)
