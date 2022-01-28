interface LabOrderLinks {
  self: string;
}

interface ResultItemLinks {
  self: string;
}

export interface LabOrderShort {
  id: string;
  enteredAt: string;
  enteredAtDescription: string;
  specimenCollectedTime: string;
  links: LabOrderLinks;
}

export interface ResultItem {
  id: string;
  orderId: string;
  serviceId: string;
  serviceIdDescription: string;
  value: string;
  valueUnits: string;
  links: ResultItemLinks;
}

export interface LabOrder extends LabOrderShort {
  resultItems: ResultItem[];
}
