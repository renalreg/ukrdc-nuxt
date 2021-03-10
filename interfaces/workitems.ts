import { MasterRecord } from '@/interfaces/masterrecords'
import { Person } from '@/interfaces/persons'
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
}

export interface WorkItem extends WorkItemShort {
  masterRecord: MasterRecord
  person: Person
}
