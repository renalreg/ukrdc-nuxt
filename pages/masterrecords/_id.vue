<template>
  <div>
    <!-- Issues alert -->
    <div v-if="stats && stats.ukrdcids > 1">
      <GenericAlertError
        class="mb-4"
        :message="`${stats.ukrdcids} UKRDC IDs found for this patient. See Linked Master Records`"
      />
    </div>

    <div v-if="issueMessage">
      <NuxtLink :to="`/masterrecords/${record.id}/issues`">
        <GenericAlertWarning class="mb-4" :message="issueMessage" />
      </NuxtLink>
    </div>

    <div v-if="record" class="mb-2">
      <TextH1 v-if="record.givenname" class="capitalize">
        {{ record.givenname.toLowerCase() }}
        {{ record.surname.toLowerCase() }}
      </TextH1>
      <TextL1> {{ record.nationalidType }} record </TextL1>
    </div>

    <div class="mb-6"><GenericNavigationTabsLine :tabs="tabs" /></div>

    <NuxtChild v-if="record" :record="record" :stats="stats" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useRoute, useFetch, useContext } from '@nuxtjs/composition-api'

import { formatDate } from '@/utilities/dateUtils'
import { formatGender } from '@/utilities/codeUtils'

import { MasterRecord, MasterRecordStatistics } from '@/interfaces/masterrecord'
import { TabItem } from '@/interfaces/tabs'

export default defineComponent({
  setup() {
    const route = useRoute()
    const { $axios, $config } = useContext()

    const tabs = [
      {
        name: 'Overview',
        href: `/masterrecords/${route.value.params.id}`,
      },
      {
        name: 'Link Records',
        href: `/masterrecords/${route.value.params.id}/linkrecords`,
      },
      {
        name: 'Issues',
        href: `/masterrecords/${route.value.params.id}/issues`,
      },
    ] as TabItem[]

    const record = ref<MasterRecord>()
    const stats = ref<MasterRecordStatistics>()

    function buildErrorMessage(stats: MasterRecordStatistics): string {
      let msg = ''
      let workItemsMsg = ''
      let errorMsg = ''
      if (stats) {
        if (stats?.workitems > 0) {
          workItemsMsg += `${stats?.workitems} workitem`
        }
        if (stats?.workitems > 1) {
          workItemsMsg += 's'
        }
        if (stats?.errors > 0) {
          errorMsg += `${stats?.errors} error`
        }
        if (stats?.errors > 1) {
          errorMsg += 's'
        }
      }
      if (workItemsMsg) {
        msg += workItemsMsg
      }
      if (workItemsMsg && errorMsg) {
        msg += ' and '
      }
      if (errorMsg) {
        msg += errorMsg
      }
      if (workItemsMsg || errorMsg) {
        msg += ' found on record. Click for details.'
      }
      return msg
    }

    const issueMessage = ref<string>()

    useFetch(async () => {
      // Get the main record data
      const path = `${$config.apiBase}/v1/masterrecords/${route.value.params.id}/`
      const res: MasterRecord = await $axios.$get(path)
      record.value = res

      // Get basic record statistics
      const statsRes: MasterRecordStatistics = await $axios.$get(record.value.links.statistics)
      stats.value = statsRes
      issueMessage.value = buildErrorMessage(stats.value)
    })

    return {
      tabs,
      record,
      stats,
      issueMessage,
      formatGender,
      formatDate,
    }
  },
  head: {
    title: 'Master Records',
  },
})
</script>

<style></style>
