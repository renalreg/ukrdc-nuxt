<template>
  <div>
    <TextP v-if="observations && observations.length <= 0" class="text-center">No observations on record</TextP>
    <div v-else>
      <GenericSelect v-model="selectedCodeString" class="mb-4">
        <option :value="null">All Observations</option>
        <option v-for="item in availableCodes" :key="item">
          {{ item }}
        </option>
      </GenericSelect>

      <!-- Small data card display -->
      <div class="lg:hidden">
        <PatientrecordsObservationCard
          v-for="(item, index) in observations"
          :key="`${item.observationCode}-${index}-card`"
          :item="item"
        />
      </div>
      <!-- Large table display -->
      <GenericTable class="hidden lg:block">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Value
            </th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Entered At
            </th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Entered On
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <PatientrecordsObservationTableRow
            v-for="(item, index) in observations"
            :key="`${item.observationCode}-${index}`"
            :item="item"
          />
        </tbody>
      </GenericTable>

      <div v-if="observations && observations.length > 0" class="mt-4">
        <GenericCard>
          <GenericPaginator :page="page" :size="size" :total="total" @next="page++" @prev="page--" />
        </GenericCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useRoute, useRouter, watch } from '@nuxtjs/composition-api'

import usePagination from '~/helpers/query/usePagination'

import { arrayQuery } from '@/helpers/utils/queryUtils'
import { formatDate } from '@/helpers/utils/dateUtils'

import { Observation } from '@/interfaces/observation'
import { PatientRecord } from '@/interfaces/patientrecord'
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
    const router = useRouter()
    const { page, total, size } = usePagination()
    const { fetchPatientRecordObservationsPage, fetchPatientRecordObservationCodes } = fetchPatientRecords()

    // Data refs

    const observations = ref<Observation[]>()

    const availableCodes = ref([] as string[])
    const selectedCodes = ref((arrayQuery(route.value.query.code) || []) as string[])

    // Data fetching

    async function fetchObservations() {
      let path = `${props.record.links.observations}?page=${page.value}&size=${size.value}`

      for (const code of selectedCodes.value) {
        if (code) {
          path = path + `&code=${code}`
        }
      }

      const observationsPage = await fetchPatientRecordObservationsPage(
        props.record,
        page.value || 0,
        size.value,
        selectedCodes.value
      )
      observations.value = observationsPage.items
      total.value = observationsPage.total
      page.value = observationsPage.page
      size.value = observationsPage.size

      // If we don't already have a list of available codes, fetch one
      if (availableCodes.value.length === 0) {
        availableCodes.value = await fetchPatientRecordObservationCodes(props.record)
      }
    }

    onMounted(() => {
      fetchObservations()
    })

    watch(route, () => {
      fetchObservations()
    })

    // Observation code filter

    const selectedCodeString = computed({
      get: () => selectedCodes.value[0] || '',
      set: (newCode: string) => {
        selectedCodes.value = [newCode]

        // Reset page when we change the filter
        const newQuery = {
          page: '1',
          code: selectedCodes.value,
        }
        router.push({
          path: route.value.path,
          query: newQuery,
        })
      },
    })

    return {
      page,
      size,
      total,
      observations,
      availableCodes,
      selectedCodeString,
      formatDate,
    }
  },
})
</script>
