import { models, Schema } from 'mongoose'

const pdf417Schema: Schema = new Schema(
  {
    verifiedData: {
      num1: String,
      type: String,
      name: String,
      expedition: String,
      expiration: String,
      licNum: String,
      num2: String
    },
    photo: {
      type: {
        filename: String,
        key: String
      }
    }
  },

  { timestamps: true }
)
