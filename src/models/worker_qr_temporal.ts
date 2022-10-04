//dependecies
import { Schema, model, models } from 'mongoose'
//Types
import { IWorker_qr_temporal } from '../interfaces'

const workerSchema: Schema = new Schema(
  {
    QR: String,
    worker: { type: Schema.Types.ObjectId, ref: 'Worker' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    timeEnd: String,
    used: Boolean,
    valid: Boolean,
    location: { type: Schema.Types.ObjectId, ref: 'Location', required: true }
  },
  {
    timestamps: true
  }
)

export default models['Worker_qr_temporal']
  ? model<IWorker_qr_temporal>('Worker_qr_temporal')
  : model<IWorker_qr_temporal>('Worker_qr_temporal', workerSchema)
