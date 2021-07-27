import { MasterRecord } from '@/interfaces/masterrecord'
import { WorkItemShort } from '@/interfaces/workitem'

interface ErrorLinks {
  self: string
  mirth: string
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
  error: string
  status: string
  msgStatus: string
  links: ErrorLinks
}

export interface ExtendedError extends Message {
  masterRecords: MasterRecord[]
  workItems: WorkItemShort[]
}

export interface ErrorSource {
  content: string
  contentType: string
}
