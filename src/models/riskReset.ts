//dependecies
import { model, models, Schema } from 'mongoose'
import { IRiskReset } from '../interfaces'

const riskResetSchema: Schema = new Schema(
  {
    time: { type: Number }
  },

  { timestamps: true }
)
export default models['riskReset']
  ? model<IRiskReset>('riskReset')
  : model<IRiskReset>('riskReset', riskResetSchema)
