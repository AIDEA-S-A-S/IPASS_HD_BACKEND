//dependecies
import { IEventExpress } from 'interfaces'
import { model, models, Schema } from 'mongoose'

const eventExpressSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    host: { type: Schema.Types.ObjectId, ref: 'User' },
    start: { type: Date },
    end: { type: Date },
    location: { type: Schema.Types.ObjectId, ref: 'Location' },
    state: { type: String },
    contact: { type: Schema.Types.ObjectId, ref: 'Contact' },
    invitados: [{ type: Schema.Types.ObjectId, ref: 'Contact' }],
    motivo: { type: String },
    authorizedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    hourIn: String,
    hourOut: String,
    open: { type: Boolean, default: false }
  },

  { timestamps: true }
)
export default models['EventExpress']
  ? model<IEventExpress>('EventExpress')
  : model<IEventExpress>('EventExpress', eventExpressSchema)
