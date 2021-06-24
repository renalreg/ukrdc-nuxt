import { Person } from '@/interfaces/persons'
import { MasterRecord } from '@/interfaces/masterrecord'

export interface LinkRecord {
  id: number
  person: Person
  masterRecord: MasterRecord
}
