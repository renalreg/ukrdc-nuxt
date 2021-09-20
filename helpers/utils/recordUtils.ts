import { PatientRecordSummary } from '~/interfaces/patientrecord'

const ukrdcMembershipFacilities = ['PV', 'PKB']
const membershipExtracts = ['RADAR']
const migratedExtracts = ['PVMIG', 'HSMIG']

export function isData(record: PatientRecordSummary): boolean {
  if (record.sendingextract === 'PV') {
    return true
  }
  if (
    record.sendingextract === 'UKRDC' &&
    !ukrdcMembershipFacilities.includes(record.sendingfacility) &&
    record.sendingfacility !== 'TRACING'
  ) {
    return true
  }
  return false
}

export function isSurvey(record: PatientRecordSummary): boolean {
  if (record.sendingextract === 'SURVEY') {
    return true
  }
  return false
}

export function isMigrated(record: PatientRecordSummary) {
  if (migratedExtracts.includes(record.sendingextract)) {
    return true
  }
  return false
}

export function isMembership(record: PatientRecordSummary) {
  if (membershipExtracts.includes(record.sendingextract)) {
    return true
  }
  if (record.sendingextract === 'UKRDC' && ukrdcMembershipFacilities.includes(record.sendingfacility)) {
    return true
  }
  return false
}

export function isTracing(record: PatientRecordSummary) {
  if (record.sendingextract === 'UKRDC' && record.sendingfacility === 'TRACING') {
    return true
  }
  return false
}
