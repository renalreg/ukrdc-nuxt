import { Person } from "@/interfaces/persons";
import { MasterRecord } from "@/interfaces/masterrecord";

interface WorkItemLinks {
  self: string;
  collection: string;
  related: string;
  messages: string;
  merge: string;
  close: string;
  unlink: string;
}

export interface WorkItemAttributes {
  sendingExtract: string;
  sendingFacility: string;
  localid: string;
  dateOfBirth: string;
  dateOfDeath: string;
  gender: string;
  givenname: string;
  surname: string;
}

export interface WorkItem {
  id: number;

  type: number;
  description: string;
  status: number;

  creationDate: string;

  lastUpdated: string;
  updatedBy: string;
  updateDescription: string;

  attributes: WorkItemAttributes;

  masterRecord: MasterRecord;
  person: Person;

  links: WorkItemLinks;
}

interface WorkItemIncoming {
  person: Person;
  masterRecords: MasterRecord[];
}

interface WorkItemDestination {
  persons: Person[];
  masterRecord: MasterRecord;
}

export interface WorkItemExtended extends WorkItem {
  incoming: WorkItemIncoming;
  destination: WorkItemDestination;
  collection: WorkItem[];
}
