<template>
  <div>
    <div class="max-w-7xl mx-auto mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">Codes List</h1>
    </div>

    <div v-if="standards">
      <div v-if="standards.length > 1">
        <GenericSearchableSelect
          v-model="selectedStandard"
          class="mb-4"
          :options="standards"
          hint="Select a coding standard..."
          :mount-opened="false"
          :closable="true"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <!-- Code list -->
      <div>
        <GenericCard>
          <!-- Skeleton results -->
          <ul v-if="$fetchState.pending" class="divide-y divide-gray-200">
            <SkeleListItem v-for="n in 10" :key="n" />
          </ul>
          <!-- Real results -->
          <ul v-else class="divide-y divide-gray-200">
            <CodesListItem
              v-for="code in codes"
              :key="`${code.codingStandard}.${code.code}`"
              class="hover:bg-gray-50 cursor-pointer"
              :code="code"
              @click.native="selectCode(code)"
            />
          </ul>
          <GenericPaginator
            v-if="!$fetchState.pending"
            class="bg-white border-t border-gray-200"
            :page="page"
            :size="size"
            :total="total"
            @next="page++"
            @prev="page--"
          />
        </GenericCard>
      </div>
      <!-- Code details -->
      <GenericCard class="px-4 py-4">
        <div v-if="selectedCode">
          <CodesDetails :code="selectedCode" />
        </div>
        <div v-else>Select a code</div>
      </GenericCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, useFetch, useRoute, watch } from '@nuxtjs/composition-api'

import { Code } from '@/interfaces/codes'
import useQuery from '~/mixins/useQuery'
import usePagination from '~/mixins/usePagination'

interface CodesPage {
  items: Code[]
  total: number
  page: number
  size: number
}

export default defineComponent({
  setup() {
    const route = useRoute()
    const { $axios, $config } = useContext()
    const { page, total, size } = usePagination()
    const { stringQuery } = useQuery()

    const standards = ref<string[]>()
    const selectedStandard = stringQuery('standard', null, true, true)

    const codes = ref([] as Code[])
    const selectedCode = ref<Code>()

    function selectCode(code: Code) {
      selectedCode.value = code
      document.getElementsByTagName('main')[0].scrollTop = 0
    }

    const { fetch } = useFetch(async () => {
      // We only need to fetch the list of standards once
      if (!standards.value) {
        const standardsResponse: string[] = await $axios.$get(`${$config.apiBase}/v1/codes/standards/`)
        // Fetch the dashboard response from our API server
        standards.value = standardsResponse
      }
      // Fetch code list
      let path = `${$config.apiBase}/v1/codes/?page=${page.value}&size=${size.value}`
      // Filter by service if it exists
      if (selectedStandard.value) {
        path = path + `&coding_standard=${encodeURIComponent(selectedStandard.value)}`
      }
      const codesResponse: CodesPage = await $axios.$get(path)
      // Fetch the dashboard response from our API server
      codes.value = codesResponse.items
      total.value = codesResponse.total
      page.value = codesResponse.page
      size.value = codesResponse.size
    })

    watch(route, () => {
      fetch()
    })

    return { standards, selectedStandard, codes, selectedCode, selectCode, page, total, size }
  },
})
</script>
