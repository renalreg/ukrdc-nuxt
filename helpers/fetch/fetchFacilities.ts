import { useContext } from '@nuxtjs/composition-api'
import { FacilitySummary } from '~/interfaces/facilities'

export default function () {
  const { $axios, $config } = useContext()

  async function fetchFacilitiesList(): Promise<FacilitySummary[]> {
    return (await $axios.$get(`${$config.apiBase}/v1/facilities/`)) as FacilitySummary[]
  }

  return { fetchFacilitiesList }
}
