import { computed, onMounted, ref } from '@nuxtjs/composition-api'
import fetchFacilities from './fetch/fetchFacilities'
import useQuery from '~/helpers/query/useQuery'
import { FacilitySummary } from '~/interfaces/facilities'

export default function () {
  const { stringQuery } = useQuery()
  const { fetchFacilitiesList } = fetchFacilities()

  const facilities = ref([] as FacilitySummary[])
  const facilityIds = computed(() => {
    return facilities.value.map(({ id }) => id)
  })
  const facilityLabels = computed(() => {
    return facilities.value.map(({ description }) => description)
  })
  const selectedFacility = stringQuery('facility', null, true)

  async function setFacilities() {
    // If we don't already have a list of available facilties, fetch one
    if (facilities.value.length === 0) {
      facilities.value = await fetchFacilitiesList()
    }
  }

  onMounted(() => {
    setFacilities()
  })

  return {
    facilities,
    facilityIds,
    facilityLabels,
    selectedFacility,
    fetchFacilities,
  }
}
