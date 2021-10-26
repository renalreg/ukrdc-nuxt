import { useContext } from '@nuxtjs/composition-api'
import { FacilitySummary, Facility } from '~/interfaces/facilities'
import { HistoryItem } from '~/interfaces/common'

export default function () {
  const { $axios, $config } = useContext()

  async function fetchFacilitiesList(
    sortBy: string | null = null,
    orderBy: string | null = null,
    includeEmpty: boolean = true
  ): Promise<FacilitySummary[]> {
    let path = `${$config.apiBase}/v1/facilities/?include_empty=${includeEmpty}`
    if (sortBy) {
      path = path + `&sort_by=${sortBy}`
    }
    if (orderBy) {
      path = path + `&order_by=${orderBy}`
    }
    return (await $axios.$get(path)) as FacilitySummary[]
  }

  async function fetchFacility(code: string): Promise<Facility> {
    return (await $axios.$get(`${$config.apiBase}/v1/facilities/${code}`)) as Facility
  }

  async function fetchFacilityErrorsHistory(facility: Facility): Promise<HistoryItem[]> {
    return (await $axios.$get(facility.links.errorsHistory)) as HistoryItem[]
  }

  return { fetchFacilitiesList, fetchFacility, fetchFacilityErrorsHistory }
}
