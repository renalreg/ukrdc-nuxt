interface FacilityLinks {
  self: string
  errorsHistory: string
  patientsLatestErrors: string
}

export interface FacilityStatistics {
  lastUpdated: string
  totalPatients: number
  patientsReceivingMessages: number
  patientsReceivingMessageSuccess: number
  patientsReceivingMessageError: number
}

export interface FacilitySummary {
  id: string
  description: string
  statistics: FacilityStatistics
  links: FacilityLinks
}

interface FacilityDataFlowSchema {
  pkbIn: boolean
  pkbOut: boolean
  pkbMessageExclusions: string[]
}

export interface Facility extends FacilitySummary {
  dataFlow: FacilityDataFlowSchema
}
