import Location from '../../models/location'
import { IDevice } from 'interfaces'
import Device from '../../models/device'

export const resolver = {
  Query: {
    async listDevice() {
      //   const toDelete = await Device.find({ exists: false }).lean()
      //   for (let k = 0; k < toDelete.length; k++) {
      //     await Device.findByIdAndDelete(toDelete[k]._id).lean()
      //   }

      // return await Device.find({ exists: false }).lean()
      return await Device.find().lean()
    },
    async listAvailableDevices() {
      return await Device.find({ status: { $eq: 'available' } })
    },
    async listDeviceIfExists() {
      return await Device.find({ exists: { $eq: true } }).lean()
    },
    async getDevice(_: any, { _id }: any) {
      return await Device.findById(_id).lean()
    },
    async getLocationBySerialNumber(_: any, { serialNumber }: any) {
      return await Device.findOne({ serialNumber: { $eq: serialNumber } }).lean()
    }
  },
  Mutation: {
    async createDevice(_: any, { input }: any) {
      const device = await Device.findOne({ serialNumber: input.serialNumber })

      if (device) {
        if (device.exists) {
          throw new Error('Device already exists')
        } else {
          await Device.findOneAndUpdate(
            { serialNumber: input.serialNumber },
            { ...input, exists: true, status: 'available' },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          )
          return true
        }
      } else {
        await Device.findOneAndUpdate(
          { serialNumber: input.serialNumber },
          { ...input, exists: true, status: 'available' },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
        return true
      }
    },
    async updateDevice(_: any, { input }: any) {
      let toChange = input
      const { _id, ...toUpdate } = toChange
      if (input.actualLocation) {
        toChange = { ...input, status: 'occupied' }
      }
      try {
        await Device.findByIdAndUpdate(_id, toUpdate)
      } catch {
        throw new Error('Serial Duplicated')
      }
      return true
    },
    async deleteDevice(_: any, { input }: any) {
      try {
        const deletedDevice = JSON.parse(
          JSON.stringify(await Device.findByIdAndUpdate(input._id, { exists: false }))
        )
        if (deletedDevice.actualLocation) {
          await Location.findByIdAndUpdate(deletedDevice.actualLocation._id, {
            $set: {
              device: null
            }
          })
        }
        return true
      } catch (error: any) {
        throw new Error(error)
      }
    },
    async deleteDeviceAll() {
      try {
        await Device.remove({})
        return true
      } catch (error: any) {
        throw new Error(error)
      }
    }
  },
  Device: {
    actualLocation: async (parent: IDevice) => {
      return await Location.findById(parent.actualLocation).lean()
    }
  }
}
