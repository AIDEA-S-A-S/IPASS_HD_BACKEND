//dependecies
import { model, models, Schema } from 'mongoose'
//Types
import { IHistoryUser } from '../interfaces'

const historyUserSchema: Schema<any> = new Schema(
  {
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: {
      type: String,
      required: true
    },
    // password: { type: String },
    privilegeID: { type: Schema.Types.ObjectId, required: true },
    active: { type: Boolean, required: true },
    // token: { type: String },
    admin: { type: Schema.Types.ObjectId, ref: 'User' },
    canCreateHost: Boolean,
    allEventWithAuth: Boolean,
    whoDeleted: { type: Schema.Types.ObjectId, ref: 'User' },
    deletedDate: { type: Date },
    state: { type: String },
    origID: { type: String }
  },
  {
    timestamps: true
  }
)

export default models['HistoryUser']
  ? model<IHistoryUser>('HistoryUser')
  : model<IHistoryUser>('HistoryUser', historyUserSchema)
