export interface Code {
  codingStandard: string
  code: string
  description: string
  objectType: string
  creationDate: string
  updateDate: string
  units: string
}

export interface CodeMap {
  sourceCodingStandard: string
  sourceCode: string
  destinationCodingStandard: string
  destinationCode: string
  creationDate: string
  updateDate: string
}
