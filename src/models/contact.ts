//dependecies
import { IContact } from 'interfaces'
import { Schema, model, models } from 'mongoose'
const verifiedDataPDFShema: Schema = new Schema({
  photo: {
    type: {
      filename: String,
      key: String
    }
  },
  documentA: {
    type: {
      filename: String,
      key: String
    }
  },
  documentB: {
    type: {
      filename: String,
      key: String
    }
  },
  num1: String,
  type: String,
  name: String,
  expedition: String,
  expiration: String,
  licNum: String,
  num2: String
})
const contactSchema: Schema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    phone: { type: String },
    indicativo: { type: String },
    nickname: { type: String },
    verified: { stype: Boolean },
    DPI: { type: String, unique: true },
    verifiedData: {
      photo: {
        type: {
          filename: String,
          key: String
        }
      },
      documentA: {
        type: {
          filename: String,
          key: String
        }
      },
      documentB: {
        type: {
          filename: String,
          key: String
        }
      },
      birthDate: String,
      expirationDate: String,
      sex: String,
      lastName: String,
      firstName: String,
      nationality: String,
      documentNumber: String,
      correctionName: String,
      correctionLastname: String,
      correctionNumber: String
    },
    verifiedDataPDF: verifiedDataPDFShema,
    typeVerified: String,
    host: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    super_anfitrion: { type: Schema.Types.ObjectId, ref: 'User' },
    banFinish: { type: String },
    empresa: { type: String },
    location: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
    verificationRegistro: { type: Boolean }
  },

  { timestamps: true }
)
export default models['Contact']
  ? model<IContact>('Contact')
  : model<IContact>('Contact', contactSchema)
