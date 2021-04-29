<template>
  <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
    <GenericCard
      v-if="$hasPermission('ukrdc:workitems:read')"
      class="grid grid-cols-1 overflow-hidden divide-y divide-gray-200 md:grid-cols-2 md:divide-y-0 md:divide-x"
    >
      <NuxtLink v-if="workitems" to="/workitems">
        <dashStatBlock
          :value="workitems.day"
          :previous-value="workitems.prev"
          :invert="true"
          title="New Workitems"
        />
      </NuxtLink>
      <DashStatBlockPlaceholder v-else />

      <NuxtLink v-if="workitems" to="/workitems"
        ><dashStatBlock :value="workitems.total" title="Total Workitems"
      /></NuxtLink>
      <DashStatBlockPlaceholder v-else />
    </GenericCard>
    <GenericCard
      v-if="$hasPermission('ukrdc:records:read')"
      class="grid grid-cols-1 overflow-hidden divide-y divide-gray-200 md:grid-cols-2 md:divide-y-0 md:divide-x"
    >
      <NuxtLink v-if="ukrdcrecords" to="/masterrecords">
        <dashStatBlock
          :value="ukrdcrecords.day"
          :previous-value="ukrdcrecords.prev"
          title="New UKRDC Records"
      /></NuxtLink>
      <DashStatBlockPlaceholder v-else />

      <NuxtLink v-if="ukrdcrecords" to="/masterrecords"
        ><dashStatBlock :value="ukrdcrecords.total" title="Total UKRDC Records"
      /></NuxtLink>
      <DashStatBlockPlaceholder v-else />
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
