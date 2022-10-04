//dependecies
import { IAuthenticator } from 'interfaces'
import { Schema, model, models } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
const authenticatorSchema: Schema = new Schema(
  {
    app: { type: Schema.Types.ObjectId, ref: 'apps' },
    code: String,
    status: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    worker: { type: Schema.Types.ObjectId, ref: 'Worker' },
    used: Boolean,
    entries: [
      {
        hourIn: String
      }
    ]
  },

  { timestamps: true }
)

//@ts-ignore
authenticatorSchema.plugin(aggregatePaginate)

export default models['authenticator']
  ? model<IAuthenticator>('authenticator')
  : model<IAuthenticator>('authenticator', authenticatorSchema)
