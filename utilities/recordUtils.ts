import { PatientRecordShort } from '@/interfaces/patientrecord'

const ukrdcMembershipFacilities = ['PV', 'PKB']
const membershipExtracts = ['RADAR']
const migratedExtracts = ['PVMIG', 'HSMIG']

export function isData(record: PatientRecordShort): boolean {
  if (record.sendingextract === 'PV') {
    return true
  }
  if (
    record.sendingextract === 'UKRDC' &&
    !ukrdcMembershipFacilities.includes(record.sendingfacility)
  ) {
    return true
  }
  return false
}

export function isSurvey(record: PatientRecordShort): boolean {
  if (record.sendingextract === 'SURVEY') {
    return true
  }
  return false
}

export function isMigrated(record: PatientRecordShort) {
  if (migratedExtracts.includes(record.sendingextract)) {
    return true
  }
  return false
}

export function isMembership(record: PatientRecordShort) {
  if (membershipExtracts.includes(record.sendingextract)) {
    return true
  }
  if (
    record.sendingextract === 'UKRDC' &&
    ukrdcMembershipFacilities.includes(record.sendingfacility)
  ) {
    return true
  }
  return false
}