//dependecies
import { model, models, Schema } from 'mongoose'
import { IKeyUser } from '../interfaces'

const KeyUserSchema: Schema = new Schema({
  key: { type: String },
  expires: { type: Date }
})

export default models['KeyUser']
  ? model<IKeyUser>('KeyUser')
  : model<IKeyUser>('KeyUser', KeyUserSchema)
