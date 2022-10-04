import mongoose from 'mongoose'
import { $db } from '../config'

const connect = async () => {
  try {
    await mongoose.connect(
      `mongodb://${$db.username}:${$db.password}@${$db.host}:${$db.port}/${$db.database}?authSource=admin`
    )
    console.info('Db Connected')
  } catch (error: any) {
    console.error(`Error in db connection: ${error}`)
  }
}

export default connect
