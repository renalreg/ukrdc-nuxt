import { Patient } from '@/interfaces/patient'

interface ProgramMembership {
  programName: string
  fromTime: string
  toTime: string
}

interface PatientRecordLinks {
  self: string
  laborders: string
  observations: string
  medications: string
  surveys: string

  exportPV: string
  exportPVDocs: string
  exportPVTests: string
  exportRADAR: string
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

export interface PatientRecord extends PatientRecordShort {
  programMemberships: ProgramMembership[]
  patient: Patient
}
