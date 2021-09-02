import { useContext } from '@nuxtjs/composition-api'
import { buildCommonMessageQuery, MessagePage } from './fetchMessages'
import { WorkItem, WorkItemExtended } from '~/interfaces/workitem'

interface WorkItemPage {
  items: WorkItem[]
  total: number
  page: number
  size: number
}

export default function () {
  const { $axios, $config } = useContext()

  async function fetchWorkItemsPage(
    page: number,
    size: number,
    orderBy: string,
    statuses: (string | null)[] = [],
    facility: string | null
  ): Promise<WorkItemPage> {
    let path = `${$config.apiBase}/v1/workitems/?page=${page}&size=${size}&sort_by=last_updated&order_by=${orderBy}`
    // Pass selected statuses to the API
    for (const status of statuses) {
      path = path + `&status=${status}`
    }
    // Filter by facility if it exists
    if (facility) {
      path = path + `&facility=${facility}`
    }

    return (await $axios.$get(path)) as WorkItemPage
  }

  async function fetchWorkItem(id: string): Promise<WorkItemExtended> {
    return (await $axios.$get(`${$config.apiBase}/v1/workitems/${id}/`)) as WorkItemExtended
  }

  async function closeWorkItem(id: string, comment: string): Promise<void> {
    await $axios.$post(`${$config.apiBase}/v1/workitems/${id}/close/`, {
      comment,
    })
  }

  async function putWorkItemComment(id: string, comment: string): Promise<void> {
    await $axios.$put(`${$config.apiBase}/v1/workitems/${id}/`, {
      comment,
    })
  }

  async function fetchWorkItemCollection(workItem: WorkItem): Promise<WorkItem[]> {
    return (await $axios.$get(workItem.links.collection)) as WorkItem[]
  }

  async function fetchWorkItemMessagesPage(
    workItem: WorkItem,
    page: number,
    size: number,
    orderBy: string | null,
    status: string | null,
    since: string | null,
    until: string | null
  ): Promise<MessagePage> {
    let path = `${workItem.links.messages}?page=${page}&size=${size}&sort_by=received`
    // Filter by status and date
    path = path + buildCommonMessageQuery(orderBy, status, since, until)
    return (await $axios.$get(path)) as MessagePage
  }

  return {
    fetchWorkItemsPage,
    fetchWorkItem,
    closeWorkItem,
    putWorkItemComment,
    fetchWorkItemCollection,
    fetchWorkItemMessagesPage,
  }
}
