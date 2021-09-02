import { useContext } from '@nuxtjs/composition-api'
import { LabOrderShort, ResultItem } from '~/interfaces/laborder'
import { LinkRecordSummary } from '~/interfaces/linkrecords'
import { MasterRecord } from '~/interfaces/masterrecord'
import { Medication } from '~/interfaces/medication'
import { Observation } from '~/interfaces/observation'
import { PatientRecord, PatientRecordFull } from '~/interfaces/patientrecord'
import { Person, PidXRef } from '~/interfaces/persons'
import { Survey } from '~/interfaces/survey'
import { Treatment } from '~/interfaces/treatment'
import { WorkItem } from '~/interfaces/workitem'

export interface ResultsPage {
  items: ResultItem[]
  total: number
  page: number
  size: number
}

export interface ResultService {
  id: string
  description: string
  standard: string
}

export interface LabOrdersPage {
  items: LabOrderShort[]
  total: number
  page: number
  size: number
}

export interface ObservationPage {
  items: Observation[]
  total: number
  page: number
  size: number
}

export interface DeletePIDFromEMPISchema {
  persons: Person[]
  masterRecords: MasterRecord[]
  pidxrefs: PidXRef[]
  workItems: WorkItem[]
  linkRecords: LinkRecordSummary[]
}

export interface DeletePIDResponseSchema {
  hash: string
  committed: boolean

  patientRecord: PatientRecordFull
  empi: DeletePIDFromEMPISchema
}

export default function () {
  const { $axios, $config } = useContext()

  async function fetchPatientRecord(pid: string): Promise<PatientRecord> {
    return (await $axios.$get(`${$config.apiBase}/v1/patientrecords/${pid}/`)) as PatientRecord
  }

  async function fetchPatientRecordRelated(record: PatientRecord): Promise<PatientRecord[]> {
    return (await $axios.$get(record.links.related)) as PatientRecord[]
  }

  async function fetchPatientRecordMedications(record: PatientRecord): Promise<Medication[]> {
    return (await $axios.$get(record.links.medications)) as Medication[]
  }

  async function fetchPatientRecordTreatments(record: PatientRecord): Promise<Treatment[]> {
    return (await $axios.$get(record.links.treatments)) as Treatment[]
  }

  async function fetchPatientRecordResultsPage(
    record: PatientRecord,
    page: number,
    size: number,
    serviceId: string | null,
    orderId: string | null
  ): Promise<ResultsPage> {
    let path = `${record.links.results}?page=${page}&size=${size}`

    // Filter by service if it exists
    if (serviceId) {
      path = path + `&service_id=${serviceId}`
    }

    // Filter by order ID if it exists
    if (orderId) {
      path = path + `&order_id=${orderId}`
    }

    return (await $axios.$get(path)) as ResultsPage
  }

  async function fetchPatientRecordResultServices(record: PatientRecord): Promise<ResultService[]> {
    return (await $axios.$get(record.links.resultServices)) as ResultService[]
  }

  async function fetchPatientRecordLabOrdersPage(
    record: PatientRecord,
    page: number,
    size: number
  ): Promise<LabOrdersPage> {
    return (await $axios.$get(`${record.links.laborders}?page=${page}&size=${size}`)) as LabOrdersPage
  }

  async function fetchPatientRecordObservationsPage(
    record: PatientRecord,
    page: number,
    size: number,
    codes: string[] | null
  ): Promise<ObservationPage> {
    let path = `${record.links.observations}?page=${page}&size=${size}`
    if (codes) {
      for (const code of codes) {
        if (code) {
          path = path + `&code=${code}`
        }
      }
    }
    return (await $axios.$get(path)) as ObservationPage
  }

  async function fetchPatientRecordObservationCodes(record: PatientRecord): Promise<string[]> {
    return (await $axios.$get(record.links.observationCodes)) as string[]
  }

  async function fetchPatientRecordSurveys(record: PatientRecord): Promise<Survey[]> {
    return (await $axios.$get(record.links.surveys)) as Survey[]
  }

  async function postPatientRecordExport(record: PatientRecord, scope: string | null): Promise<void> {
    let path: string
    switch (scope) {
      case null: {
        path = record.links.exportPV
        break
      }
      case 'docs': {
        path = record.links.exportPVDocs
        break
      }
      case 'tests': {
        path = record.links.exportPVTests
        break
      }
      case 'RADAR': {
        path = record.links.exportRADAR
        break
      }
      default: {
        throw new Error('Invalid scope')
      }
    }
    return await $axios.$post(path)
  }

  async function postPatientRecordDelete(
    record: PatientRecord,
    confirmationHash: string | null
  ): Promise<DeletePIDResponseSchema> {
    return (await $axios.$post(record.links.delete, {
      hash: confirmationHash,
    })) as DeletePIDResponseSchema
  }

  return {
    fetchPatientRecord,
    fetchPatientRecordRelated,
    fetchPatientRecordMedications,
    fetchPatientRecordTreatments,
    fetchPatientRecordResultsPage,
    fetchPatientRecordResultServices,
    fetchPatientRecordLabOrdersPage,
    fetchPatientRecordObservationsPage,
    fetchPatientRecordObservationCodes,
    fetchPatientRecordSurveys,
    postPatientRecordExport,
    postPatientRecordDelete,
  }
}
