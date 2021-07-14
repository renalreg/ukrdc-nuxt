<template>
  <div>
    <FacilitiesOverview :code="facilityCode" />
  </div>
</template>

<script lang="ts">
import { defineComponent, useRoute, computed, useMeta } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const route = useRoute()

    // Head
    const { title } = useMeta()
    title.value = `${route.value.params.code}`

    const facilityCode = computed(() => route.value.params.code)
    return {
      facilityCode,
    }
  },

  head: {
    title: 'Facility',
  },
})
</script>
