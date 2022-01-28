export interface PatientName {
  given: string;
  family: string;
}

export interface PatientNumber {
  patientid: string;
  organization: string;
  numbertype: string;
}

interface PatientAddress {
  fromTime: string;
  toTime: string;
  street: string;
  town: string;
  county: string;
  postcode: string;
  countryDescription: string;
}

interface ContactDetails {
  use: string;
  value: string;
  commenttext: string;
}

interface GPInfo {
  code: string;
  gpname: string;
  street: string;
  postcode: string;
  contactvalue: string;
  type: string;
}

interface FamilyDoctor {
  id: string;
  gpname: string;

  gpid: string;
  gpInfo: GPInfo;

  gppracticeid: string;
  gpPracticeInfo: GPInfo;

  addressuse: string;
  fromtime: string;
  totime: string;
  town: string;
  county: string;
  postcode: string;
  countrycode: string;
  countrycodestd: string;
  countrydesc: string;
  contactuse: string;
  contactvalue: string;
  email: string;
  commenttext: string;
}

export interface Patient {
  names: PatientName[];
  numbers: PatientNumber[];
  addresses: PatientAddress[];
  contactdetails: ContactDetails[];

  familydoctor: FamilyDoctor;

  birthTime: string;
  deathTime: string;
  gender: string;

  ethnicGroupDescription: string;
  ethnicGroupCode: string;
}
