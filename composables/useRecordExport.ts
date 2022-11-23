import { PatientRecordSummarySchema, TrackableTaskSchema } from "@ukkidney/ukrdc-axios-ts";

import useApi from "~/composables/useApi";
import useTasks from "~/composables/useTasks";

export default function () {
  const { patientRecordsApi } = useApi();
  const { pollTask } = useTasks();

  function exportPV(record: PatientRecordSummarySchema) {
    return patientRecordsApi.postPatientExportPv({ pid: record.pid }).then((response) => {
      const task: TrackableTaskSchema = response.data;
      return pollTask(task, 1);
    });
  }

  function exportRADAR(record: PatientRecordSummarySchema) {
    return patientRecordsApi.postPatientExportRadar({ pid: record.pid }).then((response) => {
      const task: TrackableTaskSchema = response.data;
      return pollTask(task, 1);
    });
  }

  function exportPKB(record: PatientRecordSummarySchema) {
    return patientRecordsApi.postPatientExportPkb({ pid: record.pid }).then((response) => {
      const task: TrackableTaskSchema = response.data;
      return pollTask(task, 1);
    });
  }

  return {
    exportPV,
    exportRADAR,
    exportPKB,
  };
}
