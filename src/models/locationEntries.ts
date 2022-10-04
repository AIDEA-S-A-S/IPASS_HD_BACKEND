//dependecies
import { ILocationEntries } from 'interfaces'
import { Schema, model, models } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
const LocationEntriesSchema: Schema = new Schema(
  {
    contact: { type: Schema.Types.ObjectId, ref: 'Contact' },
    location: { type: Schema.Types.ObjectId, ref: 'Location' },
    worker: { type: Schema.Types.ObjectId, ref: 'Worker' },
    event: { type: Schema.Types.ObjectId, ref: 'Event' },
    eventExpress: { type: Schema.Types.ObjectId, ref: 'EventExpress' },
    hourIn: String,
    hourOut: String,
    host: { type: Schema.Types.ObjectId, ref: 'User' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    type: String,
    qrType: String,
    typeQr: String,
    isEntry: Boolean,
    visitantData: {
      brand: { type: Schema.Types.ObjectId, ref: 'visitorBrand' },
      category: { type: Schema.Types.ObjectId, ref: 'visitorCategory' },
      direction: { type: Schema.Types.ObjectId, ref: 'visitorPlace' },
      place: String,
      readedMRZ: {
        birthDate: String,
        expirationDate: String,
        sex: String,
        firstName: String,
        lastName: String,
        nationality: String,
        documentNumber: String
      },
      readedPDF: {
        num1: String,
        type: String,
        name: String,
        expedition: String,
        expiration: String,
        licNum: String,
        num2: String
      }
    }
  },

  { timestamps: true }
)

//@ts-ignore
LocationEntriesSchema.plugin(aggregatePaginate)

export default models['LocationEntries']
  ? model<ILocationEntries>('LocationEntries')
  : model<ILocationEntries>('LocationEntries', LocationEntriesSchema)
