interface PatientDocumentLinks {
  self: string
  download: string
}

export interface PatientDocumentSummary {
  id: string
  pid: string

  documenttime: string
  documentname: string

  filename: string
  filetype: string

  enteredbydesc: string
  enteredatcode: string

  links: PatientDocumentLinks
}

export interface PatientDocument extends PatientDocumentSummary {
  idx: number

  notetext: string
  documenttypecode: string
  documenttypecodestd: string
  documenttypedesc: string

  cliniciancode: string
  cliniciancodestd: string
  cliniciandesc: string

  statuscode: string
  statuscodestd: string
  statusdesc: string
  enteredbycode: string
  enteredbycodestd: string

  enteredatcodestd: string
  enteredatdesc: string

  documenturl: string
  updatedon: string
  actioncode: string
  externalid: string

  updateDate: string
  creationDate: string

  repositoryUpdateDate: string
}
