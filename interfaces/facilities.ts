import { TotalDayPrev } from '@/interfaces/statistics'

export interface FacilitySummary {
  id: string
  description: string
}

export interface FacilityStatistics {
  recordsWithErrors: number
  patientRecords: TotalDayPrev
  errors: TotalDayPrev
}

export interface Facility extends FacilitySummary {
  statistics: FacilityStatistics
}
