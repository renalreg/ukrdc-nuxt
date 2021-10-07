import { ref, useContext } from '@nuxtjs/composition-api'
import { buildCommonDateRangeQuery } from './common'
import { MasterRecord } from '~/interfaces/masterrecord'
import { ErrorSource, Message } from '~/interfaces/messages'
import { ChannelMessage } from '~/interfaces/mirth'
import { WorkItem } from '~/interfaces/workitem'

export interface MessagePage {
  items: Message[]
  total: number
  page: number
  size: number
}

export function buildCommonMessageQuery(
  orderBy: string | null,
  status: string | null,
  since: string | null,
  until: string | null
): string {
  let path = ''
  // Order results
  if (orderBy) {
    path = path + `&order_by=${orderBy}`
  }
  // Filter by since-until if it exists
  path = path + buildCommonDateRangeQuery(since, until)
  // Filter by message status
  if (status) {
    path = path + `&status=${status}`
  }
  return path
}

export default function () {
  const { $axios, $config } = useContext()

  const fetchInProgress = ref(false)

  async function fetchMessagesPage(
    page: number,
    size: number,
    orderBy: string | null,
    status: string | null,
    since: string | null,
    until: string | null,
    facility: string | null,
    nationalId: string | null
  ): Promise<MessagePage> {
    let path = `${$config.apiBase}/v1/messages/?page=${page}&size=${size}&sort_by=received`

    // Filter by status and date
    path = path + buildCommonMessageQuery(orderBy, status || 'ERROR', since, until)

    // Filter by facility if it exists
    if (facility) {
      path = path + `&facility=${facility}`
    }
    // Filter by national ID if it exists
    if (nationalId) {
      path = path + `&ni=${nationalId}`
    }

    fetchInProgress.value = true
    const response: MessagePage = await $axios.$get(path)
    fetchInProgress.value = false
    return response
  }

  async function fetchMessage(id: string): Promise<Message> {
    return (await $axios.$get(`${$config.apiBase}/v1/messages/${id}`)) as Message
  }

  async function fetchMessageMasterRecords(message: Message): Promise<MasterRecord[]> {
    return (await $axios.$get(message.links.masterrecords)) as MasterRecord[]
  }

  async function fetchMessageWorkItems(message: Message): Promise<WorkItem[]> {
    return (await $axios.$get(message.links.workitems)) as WorkItem[]
  }

  async function fetchMessageMirth(message: Message): Promise<ChannelMessage> {
    return (await $axios.$get(message.links.mirth)) as ChannelMessage
  }

  const fetchSourceInProgress = ref(false)

  async function fetchMessageSource(message: Message): Promise<ErrorSource> {
    fetchSourceInProgress.value = true
    try {
      const source: ErrorSource = await $axios.$get(message.links.source)
      return source
    } finally {
      fetchSourceInProgress.value = false
    }
  }

  return {
    fetchInProgress,
    fetchMessagesPage,
    fetchMessage,
    fetchMessageMasterRecords,
    fetchMessageWorkItems,
    fetchMessageMirth,
    fetchMessageSource,
    fetchSourceInProgress,
  }
}
