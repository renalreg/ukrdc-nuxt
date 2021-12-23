import { ref, useContext } from '@nuxtjs/composition-api'
import { buildCommonMessageQuery, MessagePage } from './common'
import { MasterRecord } from '~/interfaces/masterrecord'
import { ErrorSource, Message } from '~/interfaces/messages'
import { ChannelMessage } from '~/interfaces/mirth'
import { WorkItem } from '~/interfaces/workitem'

export default function () {
  const { $axios, $config } = useContext()

  async function fetchMessagesPage(
    page: number,
    size: number,
    orderBy: string | null,
    statuses: (string | null)[],
    since: string | null,
    until: string | null,
    facility: string | null,
    nationalId: string | null
  ): Promise<MessagePage> {
    let path = `${$config.apiBase}/v1/messages/?page=${page}&size=${size}&sort_by=received`

    // Filter by status and date
    path = path + buildCommonMessageQuery(orderBy, statuses || ['ERROR'], since, until)

    // Filter by facility if it exists
    if (facility) {
      path = path + `&facility=${facility}`
    }
    // Filter by national ID if it exists
    if (nationalId) {
      path = path + `&ni=${nationalId}`
    }

    const response: MessagePage = await $axios.$get(path)
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

  const downloadSourceInProgress = ref(false)

  function downloadMessageSource(message: Message): void {
    downloadSourceInProgress.value = true
    $axios({
      url: message.links.source,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', message.filename || `${message.facility}-{message.id}.txt`)
      document.body.appendChild(link)
      link.click()
      downloadSourceInProgress.value = false
    })
  }

  return {
    fetchMessagesPage,
    fetchMessage,
    fetchMessageMasterRecords,
    fetchMessageWorkItems,
    fetchMessageMirth,
    fetchMessageSource,
    fetchSourceInProgress,
    downloadMessageSource,
    downloadSourceInProgress,
  }
}
