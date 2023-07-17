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

export function isRADAR(record: PatientRecordSummarySchema) {
  return record.sendingextract === "RADAR";
}

export function isMembership(record: PatientRecordSummarySchema) {
  // UKRDC extracts are only memberships if they are from certain facilities
  if (membershipFacilities.includes(record.sendingfacility) || isRADAR(record)) {
    return true;
  }
  return false;
}

export function isData(record: PatientRecordSummarySchema): boolean {
  // Everything else is a data record
  return !(isSurvey(record) || isUKRR(record) || isMigrated(record) || isInformational(record) || isMembership(record));
}

export function isRealSendingFacility(record: PatientRecordSummarySchema): boolean {
  // Any record where sending facility is a real renal unit
  return isData(record) || isUKRR(record) || isMigrated(record);
}

// General record utilities

export function firstForename(record: PatientRecordSummarySchema): string {
  return record.patient?.names[0]?.given || "";
}

export function firstSurname(record: PatientRecordSummarySchema): string {
  return record.patient?.names[0]?.family || "";
}

export function firstMRN(record: PatientRecordSummarySchema): localNumber | null {
  const mrn = record.patient?.numbers.find((i: NumberSchema) => i.numbertype === "MRN");
  if (mrn) {
    return {
      label: mrn.organization === "LOCALHOSP" ? "Hospital" : mrn.organization,
      number: mrn.patientid,
    };
  }
  return null;
}

export function firstNI(record: PatientRecordSummarySchema): localNumber | null {
  const ni = record.patient?.numbers.find((i: NumberSchema) => i.numbertype === "NI");
  if (ni) {
    return {
      label: ni.organization,
      number: ni.patientid,
    };
  }
  return null;
}

export function demographicsUpdateAllowed(record: PatientRecordSummarySchema) {
  // Allow in-house update of PKB membership demographics
  if (record.sendingfacility === "PKB" && record.sendingextract === "UKRDC") {
    return true;
  }
  // Allow in-house update of PV membership demographics now PV is shut down so no direct updates coming in
  if (record.sendingfacility === "PV" && record.sendingextract === "UKRDC") {
    return true;
  }
  if (record.sendingextract === "PVMIG" || record.sendingextract === "HSMIG") {
    return true;
  }
  return false;
}
