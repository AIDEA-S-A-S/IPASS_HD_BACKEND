import location from '../../models/location'
import { IRiskReset } from 'interfaces'
import RiskReset from '../../models/riskReset'
export const resolver = {
  Query: {
    async listRiskReset() {
      return await RiskReset.find().lean()
    },
    async getRiskReset(_: any, { _id }: any) {
      return await RiskReset.findById(_id._id).lean()
    }
  },
  Mutation: {
    async createRiskReset(_: any, { input }: any) {
      const newRiskReset = new RiskReset(input)
      return await newRiskReset.save()
    },
    async updateRiskReset(_: any, { input }: any) {
      try {
        return await RiskReset.findByIdAndUpdate(input._id, input)
      } catch (error) {
        console.error(error)
      }
    },
    async deleteRiskReset(_: any, { input }: any) {
      return await RiskReset.findByIdAndDelete(input._id)
    },
    async deleteRiskResetAll() {
      return await RiskReset.remove({})
    }
  }
}
