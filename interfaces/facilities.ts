export interface FacilitySummary {
  id: string
  description: string
}

interface FacilityMessageSummary {
  totalIdsCount: number
  successIdsCount: number
  errorIdsCount: number
  errorIds: string[]
}

export interface FacilityStatistics {
  lastUpdated: string
  patientRecords: number
  messages: FacilityMessageSummary
}

export interface Facility extends FacilitySummary {
  statistics: FacilityStatistics
}
