import { IRiskLayers } from 'interfaces'
import RiskLayers from '../../models/riskLayers'
export const resolver = {
  Query: {
    async listRiskLayers() {
      return await RiskLayers.find().lean()
    }
  },
  Mutation: {
    async createRiskLayers(_: any, { input }: any) {
      const newRiskLayers = new RiskLayers(input)
      return await newRiskLayers.save()
    },
    async updateRiskLayers(_: any, { input }: any) {
      try {
        return await RiskLayers.findByIdAndUpdate(input._id, input)
      } catch (error) {
        console.error(error)
      }
    },
    async deleteRiskLayers(_: any, { input }: any) {
      return await RiskLayers.findByIdAndDelete(input._id)
    },
    async deleteRiskLayersAll() {
      return await RiskLayers.remove({})
    }
  }
}
