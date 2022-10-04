//dependecies
import { model, models, Schema } from 'mongoose'
import { iTimeZone } from '../interfaces'

const timeZoneSchema: Schema = new Schema(
  {
    name: { type: String },
    start: { type: String },
    end: { type: String },
    abbreviation: { type: String },
    days: { type: [{ type: String }] }
  },
  { timestamps: true }
)

export default models['timeZoneSchema']
  ? model<iTimeZone>('timeZoneSchema')
  : model<iTimeZone>('timeZoneSchema', timeZoneSchema)
