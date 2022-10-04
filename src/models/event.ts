//dependecies
import { IEvent } from 'interfaces'
import { Schema, model, models } from 'mongoose'

const eventSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    host: { type: Schema.Types.ObjectId, ref: 'User' },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    location: { type: Schema.Types.ObjectId, ref: 'Location' },
    beforeStart: { type: Number },
    onlyAuthUser: Boolean,
    state: { type: String },
    deletedDate: { type: Date },
    whoDeleted: { type: Schema.Types.ObjectId, ref: 'User' },
    open: { type: Boolean, default: false }
  },

  { timestamps: true }
)
export default models['Event'] ? model<IEvent>('Event') : model<IEvent>('Event', eventSchema)
