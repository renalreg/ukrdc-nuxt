import { Person } from '@/interfaces/persons'
import { MasterRecord } from '~/interfaces/masterrecord'

interface WorkItemLinks {
  self: string
  related: string
  merge: string
  close: string
}
export interface WorkItemSummary {
  id: number
  personId: number
  masterId: number
}

export interface WorkItemShort extends WorkItemSummary {
  type: number
  description: string
  status: number
  lastUpdated: string
  updatedBy: string
  updateDescription: string
  attributes: object

  links: WorkItemLinks
}

export interface WorkItem extends WorkItemShort {
  masterRecord: MasterRecord
  person: Person
}
