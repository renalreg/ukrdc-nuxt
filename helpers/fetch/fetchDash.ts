import { useContext } from '@nuxtjs/composition-api'
import { DashResponse } from '@/interfaces/dash'

export default function () {
  const { $axios, $config } = useContext()

  async function fetchDashboard(): Promise<DashResponse> {
    return (await $axios.$get(`${$config.apiBase}/v1/dash/`)) as DashResponse
  }

  return { fetchDashboard }
}
