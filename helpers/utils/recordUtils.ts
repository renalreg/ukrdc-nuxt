import { NumberSchema, PatientRecordSummarySchema } from "@ukkidney/ukrdc-axios-ts";

const ukrdcMembershipFacilities = ["PV", "PKB"];
const migratedExtracts = ["PVMIG", "HSMIG"];

/*
  Notation: 
  X/Y corresponds to sendingfacility/sendingextract
*/

export interface localNumber {
  label: string;
  number: string;
}

export function isSurvey(record: PatientRecordSummarySchema): boolean {
  // All SURVEY extracts are survey records
  if (record.sendingextract === "SURVEY") {
    return true;
  }
  return false;
}

export function isMigrated(record: PatientRecordSummarySchema) {
  // All *MIG extracts are migrated records
  if (migratedExtracts.includes(record.sendingextract)) {
    return true;
  }
  return false;
}

export function isTracing(record: PatientRecordSummarySchema) {
  // All TRACING facilities are tracing records
  if (record.sendingfacility === "TRACING") {
    return true;
  }
  return false;
}

export function isMembership(record: PatientRecordSummarySchema) {
  // All RADAR extracts are membership records
  if (record.sendingextract === "RADAR") {
    return true;
  }
  // All UKRR facilities are membership records
  if (record.sendingfacility === "UKRR") {
    return true;
  }
  // UKRDC extracts are only memberships if they are from certain facilities
  if (record.sendingextract === "UKRDC" && ukrdcMembershipFacilities.includes(record.sendingfacility)) {
    return true;
  }
  return false;
}

export function isData(record: PatientRecordSummarySchema): boolean {
  // Everything else is a data record
  return !(isSurvey(record) || isMigrated(record) || isTracing(record) || isMembership(record));
}

// General record utilities

export function firstForename(record: PatientRecordSummarySchema): string {
  return record.patient?.names[0]?.given || "";
}

export function firstSurname(record: PatientRecordSummarySchema): string {
  return record.patient?.names[0]?.family || "";
}

export function firstMRN(record: PatientRecordSummarySchema): localNumber {
  const mrn = record.patient?.numbers.find((i: NumberSchema) => i.numbertype === "MRN");
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
