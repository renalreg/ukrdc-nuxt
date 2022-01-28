export interface Treatment {
  id: string;

  fromTime: string;
  toTime: string;

  admitReasonCode: string;
  admitReasonCodeStd: string;
  admitReasonDesc: string;

  dischargeReasonCode: string;
  dischargeReasonCodeStd: string;
  dischargeReasonDesc: string;

  healthCareFacilityCode: string;
}
