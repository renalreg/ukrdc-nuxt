import { ChannelMessage, ConnectorMessage } from '~/interfaces/mirth'

export function messageHasErrors(message: ChannelMessage): boolean {
  for (const msg of Object.values(message.connectorMessages)) {
    if (msg.errorCode !== 0) {
      return true
    } else if (msg.metaDataMap?.ERROR) {
      return true
    }
  }
  return false
}

export function connectorMessageError(connectorMessage: ConnectorMessage) {
  if (connectorMessage.metaDataMap?.ERROR) {
    return connectorMessage.metaDataMap.ERROR
  } else if (connectorMessage.errorCode !== 0) {
    return `Error code ${connectorMessage.errorCode}`
  }
  return null
}
