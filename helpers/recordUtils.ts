import { NumberSchema, PatientRecordSummarySchema } from "@ukkidney/ukrdc-axios-ts";

const membershipFacilities = ["UKRR", "PV", "PKB"];
const migratedExtracts = ["PVMIG", "HSMIG"];
const informationalFacilities = ["TRACING", "NHSBT"];

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
  return record.sendingextract === "SURVEY";
}

export function isUKRR(record: PatientRecordSummarySchema): boolean {
  // All UKRR extracts are UKRR records, unless sendingfacility is UKRR (then it's a membership)
  return record.sendingextract === "UKRR" && record.sendingfacility !== "UKRR";
}

export function isMigrated(record: PatientRecordSummarySchema) {
  // All *MIG extracts are migrated records
  return migratedExtracts.includes(record.sendingextract);
}

export function isInformational(record: PatientRecordSummarySchema) {
  // All informaitonal records, such as TRACING or NHSBT
  return informationalFacilities.includes(record.sendingfacility);
}

export function isTracing(record: PatientRecordSummarySchema) {
  // Specifically TRACING records
  return record.sendingfacility === "TRACING";
}

export function isMembership(record: PatientRecordSummarySchema) {
  // UKRDC extracts are only memberships if they are from certain facilities
  if (membershipFacilities.includes(record.sendingfacility) || record.sendingextract === "RADAR") {
    return true;
  }
  return false;
}

export function isData(record: PatientRecordSummarySchema): boolean {
  // Everything else is a data record
  return !(isSurvey(record) || isUKRR(record) || isMigrated(record) || isInformational(record) || isMembership(record));
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

export function demographicsUpdateAllowed(record: PatientRecordSummarySchema) {
  if (record.sendingfacility === "PKB" && record.sendingextract === "UKRDC") {
    return true;
  }
  if (record.sendingextract === "PVMIG" || record.sendingextract === "HSMIG") {
    return true;
  }
  return false;
}
