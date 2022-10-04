import { PubSub } from 'graphql-subscriptions'
import { PubSubEnums } from './pubSubEnums'
export const pubsub = new PubSub()

export const updateContact = (hostId: string) => {
  pubsub.publish(`${PubSubEnums.MODIFIED_CONTACT}-${hostId}`, { userID: hostId })
  pubsub.publish(`${PubSubEnums.MODIFIED_CONTACT}`, {})
}

export const updateEventExpress = () => {
  pubsub.publish(`${PubSubEnums.NEW_EVENT_EXPRESS}`, {})
}

export const toUpdateSecurity = (locationID: string) => {
  pubsub.publish(`${PubSubEnums.TO_SECURITY}-${locationID}`, { locationID })
}

export const updateQrWa = ({ qr, reload }: { qr: string; reload: boolean }) => {
  pubsub.publish(`${PubSubEnums.NEW_QR_WA}`, { qrReloaded: { qr, reload } })
}

export const updateClientWaState = () => {
  pubsub.publish(`${PubSubEnums.CHANGE_STATE_CLIENTWA}`, {})
}
