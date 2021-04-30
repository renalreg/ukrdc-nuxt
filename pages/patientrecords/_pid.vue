<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
    <div v-if="record.patient" class="mb-2">
      <TextH1>
        {{ record.patient.names[0].given }} {{ record.patient.names[0].family }}
      </TextH1>
      <TextL1>
        From {{ record.sendingfacility }} via {{ record.sendingextract }}
      </TextL1>
    </div>

    <div class="mb-6"><GenericNavigationTabsLine :tabs="tabs" /></div>

    <NuxtChild :record="record" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import dateUtilsMixin from '@/mixins/dateutils'
import codeUtilsMixin from '@/mixins/coddeutils'
import objectUtilsMixin from '@/mixins/objectutils'
import { PatientRecord } from '@/interfaces/patientrecord'

interface tabItem {
  name: string
  href: string
}

export default Vue.extend({
  mixins: [dateUtilsMixin, codeUtilsMixin, objectUtilsMixin],

  data() {
    return {
      record: {} as PatientRecord,
      baseTabs: [
        {
          name: 'Overview',
          href: `/patientrecords/${this.$route.params.pid}`,
        },
        {
          name: 'Medications',
          href: `/patientrecords/${this.$route.params.pid}/medications`,
        },
        {
          name: 'Lab Orders',
          href: `/patientrecords/${this.$route.params.pid}/laborders`,
        },
        {
          name: 'Observations',
          href: `/patientrecords/${this.$route.params.pid}/observations`,
        },
        {
          name: 'Surveys',
          href: `/patientrecords/${this.$route.params.pid}/surveys`,
        },
      ] as tabItem[],
    }
  },
  async fetch() {
    // Get the main record data
    const path = `${this.$config.apiBase}/patientrecords/${this.$route.params.pid}/`
    const res: PatientRecord = await this.$axios.$get(path)
    this.record = res
  },
  head() {
    return {
      title: 'Patient Record',
    }
  },
  computed: {
    tabs(): tabItem[] {
      return [
        ...this.baseTabs,
        ...(this.$hasPermission('ukrdc:mirth:write')
          ? [
              {
                name: 'Export',
                href: `/patientrecords/${this.$route.params.pid}/export`,
              },
            ]
          : []),
      ]
    },
  },
})
</script>
