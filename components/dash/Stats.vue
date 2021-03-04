<template>
  <div>
    <dl
      class="mt-5 grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow divide-y divide-gray-200 md:grid-cols-2 md:divide-y-0 md:divide-x"
    >
      <NuxtLink to="/workitems">
        <dashStatBlock
          :value="workitems.day"
          :previous-value="workitems.prev"
          :invert="true"
          title="New Workitems"
        />
      </NuxtLink>

      <NuxtLink to="/workitems"
        ><dashStatBlock :value="workitems.total" title="Total Workitems"
      /></NuxtLink>
    </dl>
    <dl
      class="mt-5 grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow divide-y divide-gray-200 md:grid-cols-2 md:divide-y-0 md:divide-x"
    >
      <NuxtLink to="/masterrecords">
        <dashStatBlock
          :value="ukrdcrecords.day"
          :previous-value="ukrdcrecords.prev"
          title="New UKRDC Records"
      /></NuxtLink>

      <NuxtLink to="/masterrecords"
        ><dashStatBlock :value="ukrdcrecords.total" title="Total UKRDC Records"
      /></NuxtLink>
    </dl>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { DashStatistics } from 'interfaces/dash'

export default Vue.extend({
  props: {
    workitems: {
      type: Object as () => DashStatistics,
      required: true,
    },
    ukrdcrecords: {
      type: Object as () => DashStatistics,
      required: true,
    },
  },
  data() {
    return {}
  },
  methods: {},
})
</script>

<style></style>
