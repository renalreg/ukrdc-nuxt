import { useContext } from '@nuxtjs/composition-api'
import { WorkItem } from '~/interfaces/workitem'

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

  return { fetchWorkItemsPage }
}
