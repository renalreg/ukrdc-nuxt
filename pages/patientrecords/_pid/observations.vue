<template>
  <div>
    <GenericSelect v-model="selectedCodeString" class="mb-4">
      <option :value="null">All Observations</option>
      <option v-for="item in availableCodes" :key="item">
        {{ item }}
      </option>
    </GenericSelect>

    <!-- Small data card display -->
    <div class="lg:hidden">
      <GenericCardFlat
        v-for="(item, index) in observations"
        :key="`${item.observationCode}-${index}-card`"
        class="grid grid-cols-3 gap-2 mb-4 px-4 py-4"
      >
        <div
          class="text-xs font-medium text-gray-500 uppercase tracking-wider col-span-1"
        >
          Type
        </div>
        <TextP class="col-span-2 font-medium text-gray-900"
          >{{ item.observationDesc }} {{ item.prePost }}</TextP
        >
        <div
          class="text-xs font-medium text-gray-500 uppercase tracking-wider col-span-1"
        >
          Value
        </div>
        <TextP class="col-span-2"
          >{{ item.observationValue }} {{ item.observationUnits }}</TextP
        >
        <div
          class="text-xs font-medium text-gray-500 uppercase tracking-wider col-span-1"
        >
          Entered At
        </div>
        <div class="col-span-2">
          <TextP>{{ item.enteredAt }}</TextP>
          <TextP>{{ item.enteredAtDescription }}</TextP>
        </div>
        <div
          class="text-xs font-medium text-gray-500 uppercase tracking-wider col-span-1"
        >
          Entered On
        </div>
        <TextP class="col-span-2">{{ formatDate(item.observationTime) }}</TextP>
      </GenericCardFlat>
    </div>
    <!-- Large table display -->
    <div class="-my-2 -mx-4 sm:-mx-6 md:-mx-8 overflow-x-auto hidden lg:block">
      <div
        class="py-2 px-4 sm:px-6 md:px-8 align-middle inline-block min-w-full overflow-hidden"
      >
        <GenericCard>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Value
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Entered At
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Entered On
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(item, index) in observations"
                :key="`${item.observationCode}-${index}`"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ item.observationDesc }} {{ item.prePost }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.observationValue }} {{ item.observationUnits }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <p>{{ item.enteredAt }}</p>
                  <p>{{ item.enteredAtDescription }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(item.observationTime) }}
                </td>
              </tr>
            </tbody>
          </table>
        </GenericCard>
      </div>
    </div>

    <div v-if="observations.length > 0" class="mt-4">
      <GenericCard>
        <GenericPaginator
          v-if="!$fetchState.pending"
          :page="page"
          :size="size"
          :total="total"
          @next="page++"
          @prev="page--"
        />
      </GenericCard>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  watch,
  ref,
  useRoute,
  useRouter,
  useFetch,
  useContext,
  computed,
} from '@nuxtjs/composition-api'

import usePagination from '@/mixins/usePagination'

import { arrayQuery } from '@/utilities/queryUtils'
import { formatDate } from '@/utilities/dateUtils'

import { Observation } from '@/interfaces/observation'
import { PatientRecord } from '@/interfaces/patientrecord'

interface ObservationPage {
  items: Observation[]
  total: number
  page: number
  size: number
}

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
    const { $axios } = useContext()
    const { page, total, size } = usePagination()

    const observations = ref([] as Observation[])

    const availableCodes = ref([] as string[])
    const selectedCodes = ref(
      (arrayQuery(route.value.query.code) || []) as string[]
    )

    const selectedCodeString = computed({
      get: () => selectedCodes.value[0] || '',
      set: (newCode: string) => {
        selectedCodes.value = [newCode]

        // Reset page when we change the filter
        const newQuery = {
          page: '0',
          code: selectedCodes.value,
        }
        router.push({
          path: route.value.path,
          query: newQuery,
        })
      },
    })

    watch(route, () => {
      fetch()
    })

    const { fetch } = useFetch(async () => {
      const apiPath = props.record.links.observations
      let path = `${apiPath}?page=${page.value}&size=${size.value}`

      for (const code of selectedCodes.value) {
        if (code) {
          path = path + `&code=${code}`
        }
      }

      const res: ObservationPage = await $axios.$get(path)
      observations.value = res.items
      total.value = res.total
      page.value = res.page
      size.value = res.size

      // If we don't already have a list of available codes, fetch one
      if (availableCodes.value.length === 0) {
        availableCodes.value = await $axios.$get(`${apiPath}codes`)
      }
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
