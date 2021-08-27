<template>
  <div>
    <LoadingIndicator v-if="$fetchState.pending"></LoadingIndicator>
    <div v-else class="grid grid-cols-1 gap-6">
      <MasterrecordsLinkRecord v-for="link in linkRecords" :key="link.id" :record="link" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useFetch, useContext } from '@nuxtjs/composition-api'

import { formatDate } from '@/utilities/dateUtils'
import { formatGender } from '@/utilities/codeUtils'

import { MasterRecord, MasterRecordStatistics } from '@/interfaces/masterrecord'
import { LinkRecord } from '@/interfaces/linkrecords'

export default defineComponent({
  props: {
    record: {
      type: Object as () => MasterRecord,
      required: true,
    },
    stats: {
      type: Object as () => MasterRecordStatistics,
      required: false,
      default: null,
    },
  },
  setup(props) {
    const { $axios } = useContext()

    const linkRecords = ref([] as LinkRecord[])

    useFetch(async () => {
      // Use the record links to load related data concurrently
      linkRecords.value = await $axios.$get(props.record.links.linkrecords)
    })

    return {
      linkRecords,
      formatGender,
      formatDate,
    }
  },
})
</script>

<style></style>
