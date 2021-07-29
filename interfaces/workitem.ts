import { Person } from '@/interfaces/persons'
import { MasterRecord } from '@/interfaces/masterrecord'

interface WorkItemLinks {
  self: string
  related: string
  errors: string
  merge: string
  close: string
  unlink: string
}

export interface WorkItem {
  id: number

  type: number
  description: string
  status: number
  lastUpdated: string
  updatedBy: string

  updateDescription: string
  attributes: object

  masterRecord: MasterRecord
  person: Person

  links: WorkItemLinks
}

interface WorkItemIncoming {
  person: Person
  masterRecords: MasterRecord[]
}

interface WorkItemDestination {
  persons: Person[]
  masterRecord: MasterRecord
}

export interface WorkItemExtended extends WorkItem {
  incoming: WorkItemIncoming
  destination: WorkItemDestination
}
