import { Medication } from "./medication";
import { Observation } from "./observation";
import { Survey } from "./survey";
import { MasterRecord } from "./masterrecord";
import { Patient } from "@/interfaces/patient";
import { PatientDocument } from "@/interfaces/document";

interface ProgramMembership {
  programName: string;
  fromTime: string;
  toTime: string;
}

interface PatientRecordLinks {
  self: string;
  related: string;
  delete: string;

  medications: string;
  treatments: string;
  surveys: string;
  documents: string;

  observations: string;
  observationCodes: string;

  results: string;
  resultServices: string;

  laborders: string;

  exportPV: string;
  exportPVDocs: string;
  exportPVTests: string;
  exportRADAR: string;
  exportPKB: string;
}

export interface PatientRecordSummary {
  pid: string;
  sendingfacility: string;
  sendingextract: string;
  localpatientid: string;
  ukrdcid: string;
  repositoryCreationDate: string;
  repositoryUpdateDate: string;
  programMemberships: ProgramMembership[];
  patient: Patient;

  links: PatientRecordLinks;
}

export interface PatientRecord extends PatientRecordSummary {
  masterRecord: MasterRecord;
}

interface idPidInterface {
  id: string;
  pid: string;
}

interface Diagnosis {
  id: string;
  pid: string;

  diagnosisCode: string;
  diagnosisCodeStd: string;
  diagnosisDesc: string;

  identificationTime: string;
  onsetTime: string;

  comments: string;
}

interface RenalDiagnosis {
  pid: string;

  diagnosisCode: string;
  diagnosisCodeStd: string;
  diagnosisDesc: string;

  identificationTime: string;

  comments: string;
}

interface Encounter {
  id: string;
  pid: string;

  fromTime: string;
  toTime: string;
}

interface PVDelete {
  did: number;
  pid: string;
  observationTime: string;
  serviceId: string;
}

export interface PatientRecordFull extends PatientRecordSummary {
  socialHistories: idPidInterface[];
  familyHistories: idPidInterface[];
  observations: Observation[];
  allergies: idPidInterface[];
  diagnoses: Diagnosis[];
  renaldiagnoses: RenalDiagnosis[];
  medications: Medication[];
  procedures: idPidInterface[];
  documents: PatientDocument[];
  encounters: Encounter[];
  programMemberships: ProgramMembership[];
  clinicalRelationships: idPidInterface[];
  surveys: Survey[];
  pvdelete: PVDelete[];
}
