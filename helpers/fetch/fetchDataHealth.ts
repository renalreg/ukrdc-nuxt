import { useContext } from '@nuxtjs/composition-api'
import { LastRunTime } from '~/interfaces/admin'
import { MultipleUKRDCIDsPage } from '~/interfaces/datahealth'

export default function () {
  const { $api } = useContext()

  async function fetchMultipleUKRDCIDsPage(page: number, size: number): Promise<MultipleUKRDCIDsPage> {
    return (await $api.$get(
      `/v1/admin/datahealth/multiple_ukrdcids/?page=${page}&size=${size}`
    )) as MultipleUKRDCIDsPage
  }

  async function fetchMultipleUKRDCIDsLastRun(): Promise<LastRunTime> {
    return (await $api.$get(`/v1/admin/datahealth/multiple_ukrdcids/last_run`)) as LastRunTime
  }

  return {
    fetchMultipleUKRDCIDsPage,
    fetchMultipleUKRDCIDsLastRun,
  }
}
