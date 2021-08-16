import { Patient } from '@/interfaces/patient'
import { Medication } from './medication'
import { Observation } from './observation'
import { Survey } from './survey'

interface ProgramMembership {
  programName: string
  fromTime: string
  toTime: string
}

interface PatientRecordLinks {
  self: string
  related: string

  medications: string
  treatments: string
  surveys: string

  observations: string
  observationCodes: string

  results: string
  resultServices: string

  laborders: string

  exportPV: string
  exportPVDocs: string
  exportPVTests: string
  exportRADAR: string
}

export interface PatientRecord {
  pid: string
  sendingfacility: string
  sendingextract: string
  localpatientid: string
  ukrdcid: string
  repositoryCreationDate: string
  repositoryUpdateDate: string
  programMemberships: ProgramMembership[]
  patient: Patient

  links: PatientRecordLinks
}

interface idPidInterface {
  id: string
  pid: string
}

interface Diagnosis {
  id: string
  pid: string

  diagnosisCode: string
  diagnosisCodeStd: string
  diagnosisDesc: string

  identificationTime: string
  onsetTime: string

  comments: string
}

interface RenalDiagnosis {
  pid: string

  diagnosisCode: string
  diagnosisCodeStd: string
  diagnosisDesc: string

  identificationTime: string

  comments: string
}

interface Document {
  id: string
  pid: string

  idx: string
  documenttime: string
  notetext: string

  documenttypecode: string
  documenttypecodestd: string
  documenttypedesc: string

  filename: string
  filetype: string
}

interface Encounter {
  id: string
  pid: string

  fromTime: string
  toTime: string
}

interface PVDelete {
  did: number
  pid: string
  observationTime: string
  serviceId: string
}

export interface PatientRecordFull extends PatientRecord {
  socialHistories: idPidInterface[]
  familyHistories: idPidInterface[]
  observations: Observation[]
  allergies: idPidInterface[]
  diagnoses: Diagnosis[]
  renaldiagnoses: RenalDiagnosis[]
  medications: Medication[]
  procedures: idPidInterface[]
  documents: Document[]
  encounters: Encounter[]
  programMemberships: ProgramMembership[]
  clinicalRelationships: idPidInterface[]
  surveys: Survey[]
  pvdelete: PVDelete[]
}
