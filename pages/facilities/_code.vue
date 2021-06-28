<template>
  <div>
    <LoadingIndicator v-if="$fetchState.pending"></LoadingIndicator>
    <FacilitiesOverview v-else :code="facilityCode" />
  </div>
</template>

<script lang="ts">
import { defineComponent, useRoute, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const route = useRoute()
    const facilityCode = computed(() => route.value.params.code)
    return {
      facilityCode,
    }
  },

  head: {
    title: 'Facilities',
  },
})
</script>
