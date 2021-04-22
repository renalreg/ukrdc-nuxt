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

export interface MetaDataMap {
  [key: string]: string
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
  sent: ConnectorMessageData
  response: ConnectorMessageData

  metaDataMap: MetaDataMap
}

export interface ChannelMessage {
  messageId: number
  serverId: string
  channelId: string
  processed: boolean

  connectorMessages: ConnectorMessage[]

  links: ChannelMessageLinks
}

export interface MirthMessageResponse {
  status: string
  message: string
}

export interface ChannelStatistics {
  received: number
  sent: number
  error: number
  filtered: number
  queued: number
}

export interface Channel {
  id: string
  name: string
  description: string
  revision: string
  statistics: ChannelStatistics
}

export interface ChannelGroup {
  id: string
  name: string
  description: string
  revision: string
  channels: Channel[]
}
