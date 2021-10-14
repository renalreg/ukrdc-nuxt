import { Message } from './messages'

interface FacilityLinks {
  self: string
  errorsHistory: string
}

export interface FacilityStatisticsSummary {
  lastUpdated: string
  patientRecords: number
  errorIdsCount: number
}

export interface FacilityStatistics extends FacilityStatisticsSummary {
  totalIdsCount: number
  successIdsCount: number
  errorIdsMessages: Message[]
}

export interface FacilitySummary {
  id: string
  description: string
  statistics: FacilityStatisticsSummary
  links: FacilityLinks
}
export interface Facility extends FacilitySummary {
  statistics: FacilityStatistics
}

export interface ErrorHistoryItem {
  time: string
  count: number
}
