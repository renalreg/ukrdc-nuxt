<template>
  <div>
    <!-- Issues alert -->
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
import {
  defineComponent,
  ref,
  useRoute,
  useFetch,
  useContext,
  computed,
} from '@nuxtjs/composition-api'

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
        name: 'Issues',
        href: `/masterrecords/${route.value.params.id}/issues`,
      },
    ] as TabItem[]

    const record = ref<MasterRecord>()
    const stats = ref<MasterRecordStatistics>()

    const issueMessage = computed(() => {
      let msg = ''
      let workItemsMsg = ''
      let errorMsg = ''
      if (stats.value) {
        if (stats.value?.workitems > 0) {
          workItemsMsg += `${stats.value?.workitems} workitem`
        }
        if (stats.value?.workitems > 1) {
          workItemsMsg += 's'
        }
        if (stats.value?.errors > 0) {
          errorMsg += `${stats.value?.errors} error`
        }
        if (stats.value?.errors > 1) {
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
        msg += ' found on record'
      }
      return msg
    })

    useFetch(async () => {
      // Get the main record data
      const path = `${$config.apiBase}/empi/masterrecords/${route.value.params.id}/`
      const res: MasterRecord = await $axios.$get(path)
      record.value = res

      // Get basic record statistics
      const statsRes: MasterRecordStatistics = await $axios.$get(
        record.value.links.statistics
      )
      stats.value = statsRes
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
