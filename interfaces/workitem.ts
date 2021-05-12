import { Person } from '@/interfaces/persons'
import { MasterRecord } from '@/interfaces/masterrecord'

interface WorkItemLinks {
  self: string
  related: string
  merge: string
  close: string
}

export interface WorkItemShort {
  id: number

  type: number
  description: string
  status: number
  lastUpdated: string
  updatedBy: string

  masterRecord: MasterRecord
  person: Person

  links: WorkItemLinks
}

export interface WorkItem extends WorkItemShort {
  updateDescription: string
  attributes: object
}
