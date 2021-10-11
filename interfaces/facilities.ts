import { Message } from './messages'

interface FacilityLinks {
  self: string
  errorsHistory: string
}

export interface FacilitySummary {
  id: string
  description: string
  links: FacilityLinks
}

interface FacilityMessageSummary {
  totalIdsCount: number
  successIdsCount: number
  errorIdsCount: number
  errorIdsMessages: Message[]
}

export interface FacilityStatistics {
  lastUpdated: string
  patientRecords: number
  messages: FacilityMessageSummary
}

export interface Facility extends FacilitySummary {
  statistics: FacilityStatistics
}

export interface ErrorHistoryItem {
  time: string
  count: number
}
