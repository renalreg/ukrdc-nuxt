interface ChannelMessageLinks {
  self: string
}

export interface ConnectorMessageData {
  channelId: string
  content: string
  contentType: string
  dataType: string
  encrypted: boolean
  messageId: string
  messageDataId: string
}

export interface ConnectorMessage {
  chainId: number
  orderId: number
  serverId: string
  channelId: string
  channelName: string
  connectorName: string

  messageId: string
  errorCode: number
  sendAttempts: number

  raw: ConnectorMessageData
  encoded: ConnectorMessageData
}

export interface ChannelMessage {
  messageId: number
  serverId: string
  channelId: string
  processed: boolean

  connectorMessages: ConnectorMessage[]

  links: ChannelMessageLinks
}
