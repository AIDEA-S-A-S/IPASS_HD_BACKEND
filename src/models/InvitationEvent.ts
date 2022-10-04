//dependecies
import { IInvitationEvent } from 'interfaces'
import { Schema, model, models } from 'mongoose'

const routeSchema: Schema = new Schema({
  isIn: Boolean,
  location: String,
  parent: [{}]
})

const InvitationEventSchema: Schema = new Schema(
  {
    contact: { type: Schema.Types.ObjectId, ref: 'Contact' },
    event: { type: Schema.Types.ObjectId, ref: 'Event' },
    confirmed: { type: Boolean },
    alreadySendInvitation: { type: Boolean },
    isIn: Boolean,
    routes: [routeSchema],
    hourIn: String,
    type: String,
    host: { type: Schema.Types.ObjectId, ref: 'User' },
    location: { type: Schema.Types.ObjectId, ref: 'Location' },
    expiration: String
  },

  { timestamps: true }
)
export default models['InvitationEvent']
  ? model<IInvitationEvent>('InvitationEvent')
  : model<IInvitationEvent>('InvitationEvent', InvitationEventSchema)
