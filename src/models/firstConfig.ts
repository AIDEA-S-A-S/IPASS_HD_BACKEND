//dependecies
import { IFirstConfig } from '../interfaces'
import { Schema, model, models } from 'mongoose'

const FirstConfigSchema: Schema = new Schema({
  alreadyLogin: { type: Boolean, default: false }
})

export default models['FirstConfig']
  ? model<IFirstConfig>('FirstConfig')
  : model<IFirstConfig>('FirstConfig', FirstConfigSchema)
