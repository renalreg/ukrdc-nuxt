<template>
  <div class="mt-6 text-center">Not yet implemented</div>
</template>

<script lang="ts">
import Vue from 'vue'

import dateUtilsMixin from '@/mixins/dateutils'
import codeUtilsMixin from '@/mixins/coddeutils'

import { Survey } from '@/interfaces/survey'

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
      surveys: [] as Survey[],
    }
  },
  async fetch() {
    const res: Survey[] = await this.$axios.$get(this.apiPath)
    this.surveys = res
  },
})
</script>
