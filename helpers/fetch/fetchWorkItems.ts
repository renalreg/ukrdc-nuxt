import { useContext } from '@nuxtjs/composition-api'
import { buildCommonMessageQuery, MessagePage, buildCommonDateRangeQuery } from './common'
import { WorkItem, WorkItemExtended } from '~/interfaces/workitem'

interface WorkItemPage {
  items: WorkItem[]
  total: number
  page: number
  size: number
}

export default function () {
  const { $api } = useContext()

  async function fetchWorkItemsPage(
    page: number,
    size: number,
    orderBy: string,
    statuses: (string | null)[] = [],
    facility: string | null,
    since: string | null,
    until: string | null
  ): Promise<WorkItemPage> {
    let path = `/v1/workitems/?page=${page}&size=${size}&sort_by=last_updated&order_by=${orderBy}`
    // Pass selected statuses to the API
    for (const status of statuses) {
      path = path + `&status=${status}`
    }
    // Filter by facility if it exists
    if (facility) {
      path = path + `&facility=${facility}`
    }
    // Filter by since-until if it exists
    path = path + buildCommonDateRangeQuery(since, until)

    return await $api.$get(path)
  }

  async function fetchWorkItem(id: string): Promise<WorkItemExtended> {
    return (await $api.$get(`/v1/workitems/${id}/`)) as WorkItemExtended
  }

  async function closeWorkItem(id: string, comment: string): Promise<void> {
    await $api.$post(`/v1/workitems/${id}/close/`, {
      comment,
    })
  }

  async function putWorkItemComment(id: string, comment: string): Promise<void> {
    await $api.$put(`/v1/workitems/${id}/`, {
      comment,
    })
  }

  async function fetchWorkItemCollection(workItem: WorkItem): Promise<WorkItem[]> {
    return (await $api.$get(workItem.links.collection)) as WorkItem[]
  }

  async function fetchWorkItemMessagesPage(
    workItem: WorkItem,
    page: number,
    size: number,
    orderBy: string | null,
    statuses: (string | null)[],
    since: string | null,
    until: string | null
  ): Promise<MessagePage> {
    let path = `${workItem.links.messages}?page=${page}&size=${size}&sort_by=received`
    // Filter by status and date
    path = path + buildCommonMessageQuery(orderBy, statuses, since, until)
    return (await $api.$get(path)) as MessagePage
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
