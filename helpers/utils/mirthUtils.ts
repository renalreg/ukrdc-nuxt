import { ChannelMessage } from '~/interfaces/mirth'

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
