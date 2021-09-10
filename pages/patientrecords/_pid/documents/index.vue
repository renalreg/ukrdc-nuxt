<template>
  <div>
    <GenericCard>
      <!-- Skeleton results -->
      <ul v-if="!documents" class="divide-y divide-gray-200">
        <SkeleListItem v-for="n in 10" :key="n" />
      </ul>
      <!-- Real results -->
      <ul v-else class="divide-y divide-gray-200">
        <div v-for="item in documents" :key="item.id" :item="item" class="hover:bg-gray-50">
          <NuxtLink :to="`/patientrecords/${$route.params.pid}/documents/${item.id}`">
            <PatientrecordsDocumentListItem :item="item" />
          </NuxtLink>
        </div>
      </ul>
      <GenericPaginator
        class="bg-white border-t border-gray-200"
        :page="page"
        :size="size"
        :total="total"
        @next="page++"
        @prev="page--"
      />
    </GenericCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, useRoute, watch } from '@nuxtjs/composition-api'

import { PatientRecord } from '@/interfaces/patientrecord'
import { PatientDocumentSummary } from '@/interfaces/document'

import { formatDate } from '@/helpers/utils/dateUtils'

import usePagination from '~/helpers/query/usePagination'
import useDateRange from '~/helpers/query/useDateRange'

import fetchPatientRecords from '~/helpers/fetch/fetchPatientRecords'

export default defineComponent({
  props: {
    record: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },
  setup(props) {
    const route = useRoute()
    const { page, total, size } = usePagination()
    const { makeDateRange } = useDateRange()
    const { fetchPatientRecordDocumentsPage } = fetchPatientRecords()

    // Set initial date dateRange
    const dateRange = makeDateRange(null, null, true, false)

    // Data refs

    const documents = ref([] as PatientDocumentSummary[])

    // Data fetching

    async function getDocuments() {
      const documentsPage = await fetchPatientRecordDocumentsPage(props.record, page.value || 0, size.value)
      documents.value = documentsPage.items
      total.value = documentsPage.total
      page.value = documentsPage.page
      size.value = documentsPage.size
    }

    onMounted(() => {
      getDocuments()
    })

    watch(route, () => {
      getDocuments()
    })

    return {
      page,
      size,
      total,
      dateRange,
      documents,
      formatDate,
    }
  },
})
</script>

<style scoped></style>
