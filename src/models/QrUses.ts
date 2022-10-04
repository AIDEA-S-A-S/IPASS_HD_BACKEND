//dependecies
import { QrUses } from 'interfaces'
import { Schema, model, models } from 'mongoose'

const UsesSchema: Schema = new Schema(
  {
    location: { type: Schema.Types.ObjectId, ref: 'Location', order: Number }
  },
  { timestamps: true }
)

const qrUsesSchema: Schema = new Schema(
  {
    QrCode: { type: String, required: true },
    uses: [UsesSchema]
  },

  { timestamps: true }
)
export default models['QrUses'] ? model<QrUses>('QrUses') : model<QrUses>('QrUses', qrUsesSchema)
