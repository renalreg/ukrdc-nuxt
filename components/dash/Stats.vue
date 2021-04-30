<template>
  <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
    <GenericCard
      v-if="$hasPermission('ukrdc:workitems:read')"
      class="grid grid-cols-1 overflow-hidden divide-y divide-gray-200 md:grid-cols-2 md:divide-y-0 md:divide-x"
    >
      <NuxtLink to="/workitems">
        <dashStatBlock
          :value="workitems ? workitems.day : undefined"
          :previous-value="workitems ? workitems.prev : undefined"
          :invert="true"
          title="New Workitems"
        />
      </NuxtLink>

      <NuxtLink to="/workitems"
        ><dashStatBlock
          :value="workitems ? workitems.total : undefined"
          title="Total Workitems"
      /></NuxtLink>
    </GenericCard>
    <GenericCard
      v-if="$hasPermission('ukrdc:records:read')"
      class="grid grid-cols-1 overflow-hidden divide-y divide-gray-200 md:grid-cols-2 md:divide-y-0 md:divide-x"
    >
      <NuxtLink to="/masterrecords">
        <dashStatBlock
          :value="ukrdcrecords ? ukrdcrecords.day : undefined"
          :previous-value="ukrdcrecords ? ukrdcrecords.prev : undefined"
          title="New UKRDC Records"
      /></NuxtLink>

      <NuxtLink to="/masterrecords"
        ><dashStatBlock
          :value="ukrdcrecords ? ukrdcrecords.total : undefined"
          title="Total UKRDC Records"
      /></NuxtLink>
    </GenericCard>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { DashStatistics } from 'interfaces/dash'

export default Vue.extend({
  props: {
    workitems: {
      type: Object as () => DashStatistics,
      required: false,
      default: null,
    },
    ukrdcrecords: {
      type: Object as () => DashStatistics,
      required: false,
      default: null,
    },
  },
  data() {
    return {}
  },
  methods: {},
})
</script>

<style></style>
