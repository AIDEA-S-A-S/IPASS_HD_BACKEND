//dependecies
import { model, models, Schema } from 'mongoose'
import { IBreach } from '../interfaces'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
const breachSchema: Schema = new Schema(
  {
    grade: { type: String },
    location: { type: Schema.Types.ObjectId, ref: 'Location' },
    status: { type: String },
    worker: { type: Schema.Types.ObjectId, ref: 'Worker' },
    contact: { type: Schema.Types.ObjectId, ref: 'Contact' },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

//@ts-ignore
breachSchema.plugin(aggregatePaginate)


export default models['Breach'] ? model<IBreach>('') : model<IBreach>('Breach', breachSchema)
