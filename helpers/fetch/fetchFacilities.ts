import { useContext } from '@nuxtjs/composition-api'
import { FacilitySummary, Facility, ErrorHistoryItem } from '~/interfaces/facilities'

export default function () {
  const { $axios, $config } = useContext()

  async function fetchFacilitiesList(): Promise<FacilitySummary[]> {
    return (await $axios.$get(`${$config.apiBase}/v1/facilities/`)) as FacilitySummary[]
  }

  async function fetchFacility(code: string): Promise<Facility> {
    return (await $axios.$get(`${$config.apiBase}/v1/facilities/${code}`)) as Facility
  }

  async function fetchFacilityErrorsHistory(facility: Facility): Promise<ErrorHistoryItem[]> {
    return (await $axios.$get(facility.links.errorsHistory)) as ErrorHistoryItem[]
  }

  return { fetchFacilitiesList, fetchFacility, fetchFacilityErrorsHistory }
}
