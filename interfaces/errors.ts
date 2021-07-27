interface ErrorLinks {
  self: string
  mirth: string
  workitems: string
  masterrecords: string
  source: string
}

export interface MinimalMessage {
  id: string
  received: string
  msgStatus: string
  ni: string
  filename: string
  facility: string
}
export interface Message extends MinimalMessage {
  messageId: number
  channelId: string
  channel: string
  error: string
  status: string
  msgStatus: string
  links: ErrorLinks
}

export interface ErrorSource {
  content: string
  contentType: string
}
