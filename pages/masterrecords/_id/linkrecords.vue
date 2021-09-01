<template>
  <div>
    <LoadingIndicator v-if="!linkRecords"></LoadingIndicator>
    <div v-else class="grid grid-cols-1 gap-6">
      <MasterrecordsLinkRecord v-for="link in linkRecords" :key="link.id" :record="link" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, useContext } from '@nuxtjs/composition-api'

import { formatDate } from '@/helpers/utils/dateUtils'
import { formatGender } from '@/helpers/utils/codeUtils'

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

    // Data refs

    const linkRecords = ref<LinkRecord[]>()

    // Data fetching

    async function fetchLinkRecords() {
      // Use the record links to load related data concurrently
      linkRecords.value = await $axios.$get(props.record.links.linkrecords)
    }

    onMounted(() => {
      fetchLinkRecords()
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
