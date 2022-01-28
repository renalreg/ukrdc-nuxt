import { PatientNumber } from "~/interfaces/patient";
import { PatientRecordSummary } from "~/interfaces/patientrecord";

const ukrdcMembershipFacilities = ["PV", "PKB"];
const membershipExtracts = ["RADAR"];
const migratedExtracts = ["PVMIG", "HSMIG"];

export interface localNumber {
  label: string;
  number: string;
}

export function isData(record: PatientRecordSummary): boolean {
  if (record.sendingextract === "PV") {
    return true;
  }
  if (
    record.sendingextract === "UKRDC" &&
    !ukrdcMembershipFacilities.includes(record.sendingfacility) &&
    record.sendingfacility !== "TRACING"
  ) {
    return true;
  }
  return false;
}

export function isSurvey(record: PatientRecordSummary): boolean {
  if (record.sendingextract === "SURVEY") {
    return true;
  }
  return false;
}

export function isMigrated(record: PatientRecordSummary) {
  if (migratedExtracts.includes(record.sendingextract)) {
    return true;
  }
  return false;
}

export function isMembership(record: PatientRecordSummary) {
  if (membershipExtracts.includes(record.sendingextract)) {
    return true;
  }
  if (record.sendingextract === "UKRDC" && ukrdcMembershipFacilities.includes(record.sendingfacility)) {
    return true;
  }
  return false;
}

export function isTracing(record: PatientRecordSummary) {
  if (record.sendingextract === "UKRDC" && record.sendingfacility === "TRACING") {
    return true;
  }
  return false;
}

export function firstForename(record: PatientRecordSummary): string {
  return record.patient.names[0]?.given || "";
}

export function firstSurname(record: PatientRecordSummary): string {
  return record.patient.names[0]?.family || "";
}

export function firstMRN(record: PatientRecordSummary): localNumber {
  const mrn = record.patient.numbers.find((i: PatientNumber) => i.numbertype === "MRN");
  if (mrn) {
    return {
      label: mrn.organization === "LOCALHOSP" ? "Hospital" : mrn.organization,
      number: mrn.patientid,
    };
  }
  return {
    label: "",
    number: "",
  };
}
