import { computed, onMounted, ref, useContext } from '@nuxtjs/composition-api'
import useQuery from '~/helpers/query/useQuery'

interface Facility {
  id: string
  description: string
}

export default function () {
  const { $axios, $config } = useContext()
  const { stringQuery } = useQuery()

  const facilities = ref([] as Facility[])
  const facilityIds = computed(() => {
    return facilities.value.map(({ id }) => id)
  })
  const facilityLabels = computed(() => {
    return facilities.value.map(({ description }) => description)
  })
  const selectedFacility = stringQuery('facility', null, true)

  async function fetchFacilities() {
    // If we don't already have a list of available facilties, fetch one
    if (facilities.value.length === 0) {
      facilities.value = await $axios.$get(`${$config.apiBase}/v1/facilities/`)
    }
  }

  onMounted(() => {
    fetchFacilities()
  })

  return {
    facilities,
    facilityIds,
    facilityLabels,
    selectedFacility,
    fetchFacilities,
  }
}
