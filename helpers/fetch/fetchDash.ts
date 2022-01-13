import { useContext } from '@nuxtjs/composition-api'
import { DashResponse } from '@/interfaces/dash'

export default function () {
  const { $api } = useContext()

  async function fetchDashboard(): Promise<DashResponse> {
    return (await $api.$get('/v1/dash/')) as DashResponse
  }

  return { fetchDashboard }
}
