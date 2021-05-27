<template>
  <div>
    <TextH1>My Facilities</TextH1>
    <GenericSearchableSelect
      v-model="selectedFacility"
      class="my-4"
      :options="facilityIds"
      :labels="facilityLabels"
      hint="Select a facility..."
      :mount-opened="true"
      :closable="false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, useFetch, useRouter, watch } from '@nuxtjs/composition-api'
import useFacilities from '@/mixins/useFacilities'

export default defineComponent({
  props: {},
  setup() {
    const router = useRouter()
    const { facilities, facilityIds, facilityLabels, selectedFacility, fetchFacilities } = useFacilities()

    useFetch(async () => {
      await fetchFacilities()
    })

    watch(selectedFacility, () => {
      if (selectedFacility.value) {
        router.push({ path: `/facilities/${selectedFacility.value}` })
      }
    })

    return {
      facilities,
      facilityIds,
      facilityLabels,
      selectedFacility,
    }
  },
})
</script>
