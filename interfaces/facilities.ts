interface FacilityStatsLinks {
  demographics: string;
}

interface FacilityLinks {
  self: string;
  errorsHistory: string;
  patientsLatestErrors: string;

  stats: FacilityStatsLinks;
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

interface AgePoint {
  age: number;
  count: number;
}

interface GenderPoint {
  gender: number;
  count: number;
}

interface EthnicityPoint {
  ethnicity: string;
  count: number;
}

export interface FacilityDemographicStats {
  ageDist: AgePoint[];
  genderDist: GenderPoint[];
  ethnicityDist: EthnicityPoint[];
}
