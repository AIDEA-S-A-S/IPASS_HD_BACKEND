//dependecies
import { model, models, Schema } from 'mongoose'
import { IRisk } from '../interfaces'

const riskSchema: Schema = new Schema(
  {
    name: { type: String },
    try: { type: Number },
    ban: { type: Number },
    actions: { type: [{ type: String }] }
  },

  { timestamps: true }
)
export default models['risk'] ? model<IRisk>('risk') : model<IRisk>('risk', riskSchema)
