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

export interface Facility {
  id: string;
  description: string;
  statistics: FacilityStatistics;
  dataFlow: FacilityDataFlowSchema;

  links: FacilityLinks;
}
