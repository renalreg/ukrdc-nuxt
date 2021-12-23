import { MasterRecord } from './masterrecord'

interface MultipleUKRDCIDsGroupItem {
  lastUpdated: string
  masterRecord: MasterRecord
}

export interface MultipleUKRDCIDsGroup {
  groupId: number
  records: MultipleUKRDCIDsGroupItem[]
}

export interface MultipleUKRDCIDsPage {
  items: MultipleUKRDCIDsGroup[]
  total: number
  page: number
  size: number
}
