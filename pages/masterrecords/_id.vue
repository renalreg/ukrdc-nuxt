<template>
  <div>
    <!-- Issues alert -->
    <div v-if="stats && stats.ukrdcids > 1">
      <NuxtLink :to="`/masterrecords/${record.id}/issues`">
        <GenericAlertError
          class="mb-4"
          :message="`${stats.ukrdcids} UKRDC IDs found for this patient. Click for details.`"
        />
      </NuxtLink>
    </div>

    <div v-if="issueMessage">
      <NuxtLink :to="`/masterrecords/${record.id}/issues`">
        <GenericAlertWarning class="mb-4" :message="issueMessage" />
      </NuxtLink>
    </div>

    <div v-if="record" class="mb-2">
      <TextNameH1 :forename="record.givenname" :surname="record.surname" />
      <TextL1> {{ record.nationalidType }} record </TextL1>
    </div>

    <div class="mb-6"><GenericTabsNavigation :tabs="tabs" /></div>

    <NuxtChild v-if="record" :record="record" :stats="stats" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, useMeta, useRoute } from '@nuxtjs/composition-api'

import { formatDate } from '@/helpers/utils/dateUtils'
import { formatGender } from '@/helpers/utils/codeUtils'
import { insertIf } from '@/helpers/utils/arrayUtils'
import fetchMasterRecords from '@/helpers/fetch/fetchMasterRecords'

import { MasterRecord, MasterRecordStatistics } from '@/interfaces/masterrecord'
import { TabItem } from '@/interfaces/tabs'
import usePermissions from '~/helpers/usePermissions'

export default defineComponent({
  setup() {
    const route = useRoute()
    const { fetchMasterRecord, fetchMasterRecordStatistics } = fetchMasterRecords()
    const { hasPermission } = usePermissions()

    // Head
    const { title } = useMeta()
    title.value = `Record ${route.value.params.id}`

    // Navigation

    const tabs = [
      {
        name: 'Overview',
        href: `/masterrecords/${route.value.params.id}`,
      },
      ...insertIf(hasPermission('ukrdc:messages:read'), {
        name: 'Messages',
        href: `/masterrecords/${route.value.params.id}/messages`,
      }),
      {
        name: 'Link Records',
        href: `/masterrecords/${route.value.params.id}/linkrecords`,
      },
      {
        name: 'Issues',
        href: `/masterrecords/${route.value.params.id}/issues`,
      },
      ...insertIf(hasPermission('ukrdc:audit:records:read'), {
        name: 'Audit',
        href: `/masterrecords/${route.value.params.id}/audit`,
      }),
    ] as TabItem[]

    // Data refs

    const record = ref<MasterRecord>()
    const stats = ref<MasterRecordStatistics>()

    // Data fetching

    async function fetchRecord() {
      record.value = await fetchMasterRecord(route.value.params.id)

      // Get basic record statistics
      stats.value = await fetchMasterRecordStatistics(record.value)
      issueMessage.value = buildErrorMessage(stats.value)
    }

    onMounted(() => {
      fetchRecord()
    })

    // Dynamic UI elements

    const issueMessage = ref<string>()

    function buildErrorMessage(stats?: MasterRecordStatistics): string {
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
    title: 'Master Record',
  },
})
</script>

<style></style>
