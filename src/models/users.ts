//dependecies
import { Schema, model, models } from 'mongoose'
import bcrypt from 'bcryptjs'
//Types
import { IUser } from '../interfaces'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    name1: { type: String },
    name2: { type: String },
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
    photo: {
      type: {
        filename: String,
        key: String
      }
    },
    codeWorker: { type: String },
    tokenExpo: { type: String },
    verifyLogin: { type: Boolean },
    password: { type: String },
    privilegeID: { type: Schema.Types.ObjectId, required: true, ref: 'Privilege' },
    active: { type: Boolean, required: true },
    admin: { type: Schema.Types.ObjectId, ref: 'User' },
    canCreateHost: Boolean,
    allEventWithAuth: Boolean,
    canAccessToApp: { type: Boolean },
    canAccessToWeb: { type: Boolean },
    document: { type: String, unique: true },
    typeDocument: String,
    code: Boolean,
    phone: String,
    QR: String,
    temporal_Qr: {
      type: Schema.Types.ObjectId,
      ref: 'Worker_qr_temporal'
    },
    group: [{ type: Schema.Types.ObjectId, ref: 'GroupWorker' }],
    nativeLocation: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
    canUseAuthenticator: Boolean,
    timeZone: [{ type: Schema.Types.ObjectId, ref: 'timeZoneSchema' }],
    banFinish: { type: String },
    security: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
    apps: [{ type: Schema.Types.ObjectId, ref: 'apps' }]
  },
  {
    timestamps: true
  }
)
//@ts-ignore
userSchema.plugin(aggregatePaginate)

userSchema.methods.encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

userSchema.methods.matchPassword = async function (password: string) {
  // @ts-ignore
  return await bcrypt.compare(password, this.password)
}

export default models['User'] ? model<IUser>('User') : model<IUser>('User', userSchema)
