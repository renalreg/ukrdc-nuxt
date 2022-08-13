import { MasterRecordSchema } from "@ukkidney/ukrdc-axios-ts";

interface MultipleUKRDCIDsGroupItem {
  lastUpdated: string | null;
  masterRecord: MasterRecordSchema;
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
