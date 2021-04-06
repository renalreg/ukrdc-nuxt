export interface DashStatistics {
  day: number
  prev: number
  total: number
}

export interface DashResponse {
  messages: string[]
  warnings: string[]
  ukrdcrecords: DashStatistics
  workitems: DashStatistics
}

export interface ChannelStatistics {
  name: string
  updated: string
  serverId: string
  channelId: string
  received: number
  sent: number
  error: number
  filtered: number
  queued: number
}
