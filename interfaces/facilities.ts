interface FacilityLinks {
  self: string;
  errorsHistory: string;
  patientsLatestErrors: string;
}

export interface FacilityStatistics {
  lastUpdated: string;
  totalPatients: number;
  patientsReceivingMessages: number;
  patientsReceivingMessageSuccess: number;
  patientsReceivingMessageError: number;
}

interface FacilityDataFlowSchema {
  pkbIn: boolean;
  pkbOut: boolean;
  pkbMessageExclusions: string[];
}

interface FacilityLatestMessage {
  lastUpdated: string;
  lastMessageReceivedAt: string;
}
export interface Facility {
  id: string;
  description: string;

  latestMessage: FacilityLatestMessage;
  statistics: FacilityStatistics;
  dataFlow: FacilityDataFlowSchema;

  links: FacilityLinks;
}
