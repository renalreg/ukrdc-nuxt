interface MasterRecordLinks {
  self: string
  related: string
  persons: string
  workitems: string
  patientrecords: string
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
