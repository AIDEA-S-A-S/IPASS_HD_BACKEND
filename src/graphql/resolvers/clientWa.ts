import { clientWa, withOutSession } from '../../utils/clientWa'
import { PubSubEnums } from '../../utils/subscriptions/pubSubEnums'
import { pubsub, updateQrWa } from '../../utils/subscriptions/sendPub'

export const resolver = {
  Query: {
    async getClientState() {
      try {
        if (clientWa) {
          const state = await clientWa.getState()
          const info = clientWa.info
          return { state, info }
        } else {
          return null
        }
      } catch (error) {
        return null
      }
    }
  },

  Mutation: {
    async loginClientWa() {
      try {
        if (clientWa) {
          await clientWa.destroy()
        }
        withOutSession()
        return true
      } catch (error) {
        return false
      }
    }
  },
  Subscription: {
    qrReloaded: {
      subscribe: () => {
        return pubsub.asyncIterator(`${PubSubEnums.NEW_QR_WA}`)
      }
    },
    subGetState: {
      resolve: async () => {
        return true
      },
      subscribe: () => {
        return pubsub.asyncIterator(`${PubSubEnums.CHANGE_STATE_CLIENTWA}`)
      }
    }
  }
}
