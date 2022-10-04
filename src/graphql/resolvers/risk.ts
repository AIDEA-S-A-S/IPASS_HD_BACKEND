import Risk from '../../models/risk'
export const resolver = {
  Query: {
    async listRisk() {
      return await Risk.find().lean()
    },
    async getRisk(_: any, { _id }: any) {
      return await Risk.findById(_id).lean()
    }
  },
  Mutation: {
    async createRisk(_: any, { input }: any) {
      const newRisk = new Risk(input)
      return await newRisk.save()
    },
    async updateRisk(_: any, { input }: any) {
      try {
        return await Risk.findByIdAndUpdate(input._id, input)
      } catch (error) {
        console.error(error)
      }
    },
    async deleteRisk(_: any, { input }: any) {
      return await Risk.findByIdAndDelete(input._id)
    },
    async deleteRiskAll() {
      return await Risk.remove({})
    },
    async callRisk(_: any, { input }: any) {
      const { actions, ban } = input
      for (let action of actions) {
        if (action == 'Tablero') {
          console.log('Tablero')
        }
        if (action == 'App') {
          console.log('App')
        }
        if (action == 'Email') {
          console.log('Email')
        }
        if (action == 'Bloquear') {
          console.log('Bloquear', ban)
        }
      }
    }
  }
}
