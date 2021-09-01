<template>
  <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
    <GenericCardSplit v-if="hasPermission('ukrdc:workitems:read')">
      <NuxtLink to="/workitems">
        <dashStatBlock
          :value="workitems ? workitems.day : undefined"
          :previous-value="workitems ? workitems.prev : undefined"
          :invert="true"
          title="New Workitems"
        />
      </NuxtLink>

      <NuxtLink to="/workitems"
        ><dashStatBlock :value="workitems ? workitems.total : undefined" title="Total Workitems"
      /></NuxtLink>
    </GenericCardSplit>
    <GenericCardSplit v-if="hasPermission('ukrdc:records:read')">
      <NuxtLink to="/masterrecords">
        <dashStatBlock
          :value="ukrdcrecords ? ukrdcrecords.day : undefined"
          :previous-value="ukrdcrecords ? ukrdcrecords.prev : undefined"
          :invert="false"
          title="New UKRDC Records"
      /></NuxtLink>

      <NuxtLink to="/masterrecords"
        ><dashStatBlock :value="ukrdcrecords ? ukrdcrecords.total : undefined" title="Total UKRDC Records"
      /></NuxtLink>
    </GenericCardSplit>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { TotalDayPrev } from 'interfaces/statistics'
import usePermissions from '~/helpers/usePermissions'

export default defineComponent({
  props: {
    workitems: {
      type: Object as () => TotalDayPrev,
      required: false,
      default: null,
    },
    ukrdcrecords: {
      type: Object as () => TotalDayPrev,
      required: false,
      default: null,
    },
  },
  setup() {
    const { hasPermission } = usePermissions()
    return { hasPermission }
  },
})
</script>

<style></style>
