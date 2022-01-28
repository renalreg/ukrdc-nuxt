import { MasterRecord } from "./masterrecord";

interface MultipleUKRDCIDsGroupItem {
  lastUpdated: string | null;
  masterRecord: MasterRecord;
}

export interface MultipleUKRDCIDsGroup {
  groupId: number | null;
  records: MultipleUKRDCIDsGroupItem[];
}

export interface MultipleUKRDCIDsPage {
  items: MultipleUKRDCIDsGroup[];
  total: number;
  page: number;
  size: number;
}
