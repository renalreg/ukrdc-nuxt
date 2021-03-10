interface PatientRecordLinks {
  self: string
  laborders: string
  observations: string
  medications: string
  surveys: string
}

export interface PatientRecordShort {
  pid: string
  sendingfacility: string
  sendingextract: string
  localpatientid: string
  ukrdcid: string
  repositoryCreationDate: string
  repositoryUpdateDate: string

  links: PatientRecordLinks
}
