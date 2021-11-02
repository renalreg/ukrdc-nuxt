import { ref, useContext } from '@nuxtjs/composition-api'
import { buildCommonDateRangeQuery } from './common'
import { LabOrder, LabOrderShort, ResultItem } from '~/interfaces/laborder'
import { LinkRecordSummary } from '~/interfaces/linkrecords'
import { MasterRecord } from '~/interfaces/masterrecord'
import { Medication } from '~/interfaces/medication'
import { Observation } from '~/interfaces/observation'
import { PatientRecord, PatientRecordSummary, PatientRecordFull } from '~/interfaces/patientrecord'
import { Person, PidXRef } from '~/interfaces/persons'
import { Survey } from '~/interfaces/survey'
import { Treatment } from '~/interfaces/treatment'
import { WorkItem } from '~/interfaces/workitem'
import { PatientDocumentSummary, PatientDocument } from '~/interfaces/document'

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

export interface DocumentsPage {
  items: PatientDocumentSummary[]
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

  async function fetchPatientRecordRelated(record: PatientRecord): Promise<PatientRecordSummary[]> {
    return (await $axios.$get(record.links.related)) as PatientRecordSummary[]
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
    orderId: string | null,
    since: string | null,
    until: string | null
  ): Promise<ResultsPage> {
    let path = `${record.links.results}?page=${page}&size=${size}`

    // Filter by service if it exists
    if (serviceId) {
      path = path + `&service_id=${serviceId}`
    }
    // Filter by since-until if it exists
    path = path + buildCommonDateRangeQuery(since, until)
    // Filter by order ID if it exists
    if (orderId) {
      path = path + `&order_id=${orderId}`
    }

    return (await $axios.$get(path)) as ResultsPage
  }

  async function fetchPatientRecordResultServices(record: PatientRecord): Promise<ResultService[]> {
    return (await $axios.$get(record.links.resultServices)) as ResultService[]
  }

  async function deletePatientRecordResultItem(item: ResultItem): Promise<void> {
    await $axios.$delete(item.links.self)
  }

  async function fetchPatientRecordLabOrdersPage(
    record: PatientRecord,
    page: number,
    size: number
  ): Promise<LabOrdersPage> {
    return (await $axios.$get(`${record.links.laborders}?page=${page}&size=${size}`)) as LabOrdersPage
  }

  async function fetchPatientRecordLabOrder(record: PatientRecord, orderId: string): Promise<LabOrder> {
    return (await $axios.$get(`${record.links.laborders}${orderId}`)) as LabOrder
  }

  async function deletePatientRecordLabOrder(order: LabOrderShort): Promise<void> {
    await $axios.$delete(order.links.self)
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

  async function fetchPatientRecordDocumentsPage(
    record: PatientRecord,
    page: number,
    size: number
  ): Promise<DocumentsPage> {
    return (await $axios.$get(`${record.links.documents}?page=${page}&size=${size}`)) as DocumentsPage
  }

  async function fetchPatientRecordDocument(record: PatientRecord, docId: string): Promise<PatientDocument> {
    return (await $axios.$get(`${record.links.documents}${docId}/`)) as PatientDocument
  }

  const documentDownloadInProgress = ref(false)

  function downloadPatientRecordDocument(patientDocument: PatientDocument): void {
    documentDownloadInProgress.value = true
    $axios({
      url: patientDocument.links.download,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', patientDocument.filename || `${patientDocument.documentname}.txt`)
      document.body.appendChild(link)
      link.click()
      documentDownloadInProgress.value = false
    })
  }

  async function postPatientRecordExport(record: PatientRecordSummary, scope: string | null): Promise<void> {
    let path: string
    switch (scope) {
      case null || 'pv': {
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
    record: PatientRecordSummary,
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
    deletePatientRecordResultItem,
    fetchPatientRecordResultServices,
    fetchPatientRecordLabOrdersPage,
    fetchPatientRecordLabOrder,
    deletePatientRecordLabOrder,
    fetchPatientRecordObservationsPage,
    fetchPatientRecordObservationCodes,
    fetchPatientRecordDocumentsPage,
    fetchPatientRecordDocument,
    downloadPatientRecordDocument,
    documentDownloadInProgress,
    fetchPatientRecordSurveys,
    postPatientRecordExport,
    postPatientRecordDelete,
  }
}
