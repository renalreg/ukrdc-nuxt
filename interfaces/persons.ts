export interface PidXRef {
  id: number;
  pid: string;
  sendingFacility: string;
  sendingExtract: string;
  localid: string;
}

interface PersonLinks {
  self: string;
  patientrecord: string;
  masterrecords: string;
}

export interface Person {
  id: number;
  originator: string;
  localid: string;
  localidType: string;
  dateOfBirth: string;
  gender: string;
  dateOfDeath: string;
  givenname: string;
  surname: string;
  xrefEntries: PidXRef[];
  links: PersonLinks;
}
