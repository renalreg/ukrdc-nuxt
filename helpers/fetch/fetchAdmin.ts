import { useContext } from '@nuxtjs/composition-api'
import { buildCommonMessageQuery } from './fetchMessages'
import { HistoryItem } from '~/interfaces/common'

export default function () {
  const { $axios, $config } = useContext()

  async function fetchWorkItemsHistory(since: string | null, until: string | null): Promise<HistoryItem[]> {
    let path = `${$config.apiBase}/v1/admin/workitems_history/`
    // Filter by date
    path = path + buildCommonMessageQuery(null, [], since, until)

    return (await $axios.$get(path)) as HistoryItem[]
  }

  async function fetchErrorsHistory(since: string | null, until: string | null): Promise<HistoryItem[]> {
    let path = `${$config.apiBase}/v1/admin/errors_history/`
    // Filter by date
    path = path + buildCommonMessageQuery(null, [], since, until)

    return (await $axios.$get(path)) as HistoryItem[]
  }

  return {
    fetchWorkItemsHistory,
    fetchErrorsHistory,
  }
}
