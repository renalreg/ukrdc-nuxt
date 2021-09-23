export interface PatientName {
  given: string
  family: string
}

export interface PatientNumber {
  patientid: string
  organization: string
  numbertype: string
}

interface PatientAddress {
  fromTime: string
  toTime: string
  street: string
  town: string
  county: string
  postcode: string
  countryDescription: string
}

export interface Patient {
  names: PatientName[]
  numbers: PatientNumber[]
  addresses: PatientAddress[]

  birthTime: string
  deathTime: string
  gender: string

  ethnicGroupDescription: string
  ethnicGroupCode: string
}
