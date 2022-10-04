//dependecies
import { Schema, model, models } from 'mongoose'
import bcrypt from 'bcryptjs'
//Types
import { IWorker } from '../interfaces'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const workerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    name1: { type: String },
    name2: { type: String },
    photo: {
      type: {
        filename: String,
        key: String
      }
    },
    //@ts-ignore
    lastname: { type: String, required: true },
    lastname1: { type: String },
    lastname2: { type: String },
    email: {
      unique: true,
      type: String,
      required: true,
      match: /\S+@\S+\.\S+/,
      index: true
    },
    codeWorker: { type: String },
    canAccessToApp: { type: Boolean },
    canAccessToWeb: { type: Boolean },
    verifyLogin: { type: Boolean },
    document: { type: String, unique: true },
    typeDocument: String,
    password: { type: String },
    tokenExpo: { type: String },
    // privilegeID: { type: Schema.Types.ObjectId, required: true, ref: 'Privilege' },
    active: { type: Boolean, required: true },
    phone: String,
    QR: String,
    temporal_Qr: {
      type: Schema.Types.ObjectId,
      ref: 'Worker_qr_temporal'
    },
    code: Boolean,
    group: [{ type: Schema.Types.ObjectId, ref: 'GroupWorker' }],
    nativeLocation: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
    canUseAuthenticator: Boolean,
    banFinish: { type: String },
    timeZone: [{ type: Schema.Types.ObjectId, ref: 'timeZoneSchema' }],
    apps: [{ type: Schema.Types.ObjectId, ref: 'apps' }]
  },
  {
    timestamps: true
  }
)

//@ts-ignore
workerSchema.plugin(aggregatePaginate)

workerSchema.methods.encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

workerSchema.methods.matchPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password)
}

export default models['Worker'] ? model<IWorker>('Worker') : model<IWorker>('Worker', workerSchema)
