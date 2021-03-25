<template>
  <div class="mt-4"></div>
</template>

<script lang="ts">
import Vue from 'vue'

import dateUtilsMixin from '@/mixins/dateutils'
import codeUtilsMixin from '@/mixins/coddeutils'

import { Observation } from '@/interfaces/observation'

export default Vue.extend({
  mixins: [dateUtilsMixin, codeUtilsMixin],

  props: {
    apiPath: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      observations: [] as Observation[],
    }
  },
  async fetch() {
    const res: Observation[] = await this.$axios.$get(this.apiPath)
    this.observations = res
  },
})
</script>
