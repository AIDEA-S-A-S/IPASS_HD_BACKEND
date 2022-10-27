//dependecies
import { model, models, Schema } from 'mongoose'
import { IRiskLayers } from '../interfaces'

const riskLayersSchema: Schema = new Schema(
  {
    layer: { type: String },
    tolerance: { type: Number }
  },
  { timestamps: true }
)
export default models['riskLayers']
  ? model<IRiskLayers>('riskLayers')
  : model<IRiskLayers>('riskLayers', riskLayersSchema)
