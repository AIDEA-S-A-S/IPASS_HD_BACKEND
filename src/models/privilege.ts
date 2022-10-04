//dependecies
import { IPrivilege } from '../interfaces'
import { Schema, model, models } from 'mongoose'

const privilegeSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: {
      type: [
        new Schema({
          sectionID: { type: Schema.Types.ObjectId, required: true },
          read: Boolean,
          create: Boolean,
          delete: Boolean,
          update: Boolean
        })
      ]
    }
  },
  { timestamps: true }
)

export default models['Privilege']
  ? model<IPrivilege>('Privilege')
  : model<IPrivilege>('Privilege', privilegeSchema)
