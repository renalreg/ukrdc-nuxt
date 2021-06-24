interface MasterRecordLinks {
  self: string
  statistics: string
  related: string
  errors: string
  linkrecords: string
  persons: string
  workitems: string
  patientrecords: string
}

export interface MasterRecordStatistics {
  workitems: number
  errors: number
  ukrdcids: number
}

export interface MasterRecord {
  id: number
  nationalid: string
  nationalidType: string
  lastUpdated: string
  dateOfBirth: string
  gender: string
  givenname: string
  surname: string
  status: number
  effectiveDate: string
  links: MasterRecordLinks
}
