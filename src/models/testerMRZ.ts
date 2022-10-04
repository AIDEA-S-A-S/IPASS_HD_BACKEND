
import { Schema, model, models } from 'mongoose'

const sectionSechema: Schema = new Schema(
  {
    verified:Boolean,
    imageName : String
  },
  { timestamps: true }
)
export default models['tester']
  ? model('tester')
  : model('tester', sectionSechema)
