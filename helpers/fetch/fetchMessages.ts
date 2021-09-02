import { ref, useContext } from '@nuxtjs/composition-api'
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
  // Filter by since if it exists
  if (since) {
    path = path + `&since=${since}`
  }
  // Pass `until` to API if it's given
  if (until) {
    path = path + `&until=${until}`
  } else if (since) {
    // If no `until` is given but a `since` is given, then a single date is selected
    // In this case we want to only show that one day, not a dateRange
    path = path + `&until=${since}`
  }
  // Filter by message status
  if (status) {
    path = path + `&status=${status}`
  }
  return path
}

export default function () {
  const { $axios, $config } = useContext()

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
    let path = `${$config.apiBase}/v1/messages/?status=ERROR&page=${page}&size=${size}&sort_by=received`

    // Filter by status and date
    path = path + buildCommonMessageQuery(orderBy, status, since, until)

    // Filter by facility if it exists
    if (facility) {
      path = path + `&facility=${facility}`
    }
    // Filter by national ID if it exists
    if (nationalId) {
      path = path + `&ni=${nationalId}`
    }

    return (await $axios.$get(path)) as MessagePage
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
    const source: ErrorSource = await $axios.$get(message.links.source)
    fetchSourceInProgress.value = false
    return source
  }

  return {
    fetchMessagesPage,
    fetchMessage,
    fetchMessageMasterRecords,
    fetchMessageWorkItems,
    fetchMessageMirth,
    fetchMessageSource,
    fetchSourceInProgress,
  }
}
