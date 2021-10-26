import { Message } from './messages'

interface FacilityLinks {
  self: string
  errorsHistory: string
}

export interface FacilityStatisticsSummary {
  lastUpdated: string
  totalPatients: number
  patientsReceivingMessages: number
  patientsReceivingMessageSuccess: number
  patientsReceivingMessageError: number
}

export interface FacilityStatistics extends FacilityStatisticsSummary {
  patientsLatestErrors: Message[]
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
