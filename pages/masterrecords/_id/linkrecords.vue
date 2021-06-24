<template>
  <div>
    <LoadingIndicator v-if="$fetchState.pending"></LoadingIndicator>
    <div v-for="link in linkRecords" v-else :key="link.id">
      <TextL1 class="mb-2 w-full text-center">Link Record {{ link.id }}</TextL1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <PersonsRecordCard class="border-2 border-red-500" :record="link.person" :label="link.person.id.toString()" />

        <NuxtLink :to="`/masterrecords/${link.masterRecord.id}`">
          <masterrecordsRecordCard
            class="border-2 border-indigo-500"
            :record="link.masterRecord"
            :label="link.masterRecord.id.toString()"
          />
        </NuxtLink>
      </div>
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
