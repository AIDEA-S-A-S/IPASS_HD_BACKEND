//dependecies
import { model, models, Schema } from 'mongoose'
import { ILocationAttempt } from '../interfaces'

const locationAttemptSchema: Schema = new Schema(
  {
    authenticated: { type: Boolean },
    worker: { type: Schema.Types.ObjectId, ref: 'Worker' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    contact: { type: Schema.Types.ObjectId, ref: 'Contact' },
    attempts: { type: Number },
    location: { type: Schema.Types.ObjectId, ref: 'Location' },
    type: { type: String }
  },

  { timestamps: true }
)
export default models['locationAttempt']
  ? model<ILocationAttempt>('locationAttempt')
  : model<ILocationAttempt>('locationAttempt', locationAttemptSchema)
