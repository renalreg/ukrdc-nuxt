import { MasterRecord } from '@/interfaces/masterrecord'
import { WorkItemShort } from '@/interfaces/workitem'

interface ErrorLinks {
  self: string
  source: string
}
export interface Message {
  id: string
  messageId: number
  channelId: string
  received: string
  msgStatus: string
  ni: string
  filename: string
  facility: string
  error: string
  status: string

  links: ErrorLinks
}

export interface ExtendedError extends Message {
  masterRecords: MasterRecord[]
  workItems: WorkItemShort[]
}
