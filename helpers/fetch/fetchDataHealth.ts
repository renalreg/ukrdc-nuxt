import { useContext } from '@nuxtjs/composition-api'
import { MultipleUKRDCIDsPage } from '~/interfaces/datahealth'

export default function () {
  const { $api } = useContext()

  async function fetchMultipleUKRDCIDsPage(page: number, size: number): Promise<MultipleUKRDCIDsPage> {
    return (await $api.$get(
      `/v1/admin/datahealth/multiple_ukrdcids/?page=${page}&size=${size}`
    )) as MultipleUKRDCIDsPage
  }

  return {
    fetchMultipleUKRDCIDsPage,
  }
}
