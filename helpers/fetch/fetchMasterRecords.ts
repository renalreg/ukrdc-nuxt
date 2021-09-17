import { useContext } from '@nuxtjs/composition-api'
import { buildCommonMessageQuery, MessagePage } from './fetchMessages'
import { MasterRecord, MasterRecordStatistics } from '~/interfaces/masterrecord'
import { MinimalMessage } from '~/interfaces/messages'
import { PatientRecordSummary } from '~/interfaces/patientrecord'
import { LinkRecord } from '~/interfaces/linkrecords'
import { WorkItem } from '~/interfaces/workitem'

export default function () {
  const { $axios, $config } = useContext()

  async function fetchMasterRecord(masterRecordId: string): Promise<MasterRecord> {
    return (await $axios.$get(`${$config.apiBase}/v1/masterrecords/${masterRecordId}/`)) as MasterRecord
  }

  async function fetchMasterRecordRelated(masterRecord: MasterRecord): Promise<MasterRecord[]> {
    return (await $axios.$get(masterRecord.links.related)) as MasterRecord[]
  }

  async function fetchMasterRecordStatistics(masterRecord: MasterRecord): Promise<MasterRecordStatistics> {
    return (await $axios.$get(masterRecord.links.statistics)) as MasterRecordStatistics
  }

  async function fetchMasterRecordMessagesPage(
    masterRecord: MasterRecord,
    page: number,
    size: number,
    orderBy: string | null,
    status: string | null,
    since: string | null,
    until: string | null
  ): Promise<MessagePage> {
    let path = `${masterRecord.links.messages}?page=${page}&size=${size}&sort_by=received`
    // Filter by status and date
    path = path + buildCommonMessageQuery(orderBy, status, since, until)
    return (await $axios.$get(path)) as MessagePage
  }

  async function fetchMasterRecordLatestMessage(masterRecord: MasterRecord): Promise<MinimalMessage | null> {
    return ((await $axios.$get(masterRecord.links.latestMessage)) as MinimalMessage) || null
  }

  async function fetchMasterRecordPatientRecords(masterRecord: MasterRecord): Promise<PatientRecordSummary[]> {
    return (await $axios.$get(masterRecord.links.patientrecords)) as PatientRecordSummary[]
  }

  async function fetchMasterRecordLinkRecords(masterRecord: MasterRecord): Promise<LinkRecord[]> {
    return (await $axios.$get(masterRecord.links.linkrecords)) as LinkRecord[]
  }

  async function fetchMasterRecordWorkItems(masterRecord: MasterRecord): Promise<WorkItem[]> {
    return (await $axios.$get(masterRecord.links.workitems)) as WorkItem[]
  }

  return {
    fetchMasterRecord,
    fetchMasterRecordRelated,
    fetchMasterRecordStatistics,
    fetchMasterRecordMessagesPage,
    fetchMasterRecordLatestMessage,
    fetchMasterRecordPatientRecords,
    fetchMasterRecordLinkRecords,
    fetchMasterRecordWorkItems,
  }
}
