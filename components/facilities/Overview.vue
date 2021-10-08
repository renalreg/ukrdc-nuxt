<template>
  <div>
    <LoadingIndicator v-if="!facility"></LoadingIndicator>
    <div v-else>
      <div v-if="showHeading" class="mb-6">
        <TextH1 v-if="facility"> {{ facility.description }} </TextH1>
        <SkeleText v-else class="h-8 w-1/4 mb-2" />
        <TextL1 v-if="facility">
          {{ facility.id }}
        </TextL1>
        <SkeleText v-else class="h-4 w-1/2" />
      </div>

      <div v-if="!facility.statistics.lastUpdated">No data available. Please try again in a few minutes.</div>

      <div v-else>
        <TextL2 class="mb-2"> Last updated {{ lastUpdatedString }} </TextL2>
        <!-- Basic stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <GenericCard>
            <div class="flex items-center p-4">
              <div class="flex-shrink-0">
                <IconUsers />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <GenericCardDt>Total Records</GenericCardDt>
                  <dd>
                    <TextHc>{{ facility.statistics.patientRecords }}</TextHc>
                  </dd>
                </dl>
              </div>
            </div>
          </GenericCard>

          <GenericCard>
            <div class="flex items-center p-4">
              <div class="flex-shrink-0">
                <IconCheck />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <GenericCardDt>Records Currently Passing</GenericCardDt>
                  <dd>
                    <h1 class="text-2xl font-semibold text-green-600">
                      {{ facility.statistics.messages.successIdsCount }}
                    </h1>
                  </dd>
                </dl>
              </div>
            </div>
          </GenericCard>

          <GenericCard>
            <div class="flex items-center p-4">
              <div class="flex-shrink-0">
                <IconExclamation />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <GenericCardDt>Records Currently Failing</GenericCardDt>
                  <dd>
                    <h1
                      class="text-2xl font-semibold"
                      :class="facility.statistics.messages.errorIdsCount > 0 ? 'text-red-600' : 'text-green-600'"
                    >
                      {{ facility.statistics.messages.errorIdsCount }}
                    </h1>
                  </dd>
                </dl>
              </div>
            </div>
          </GenericCard>
        </div>

        <!-- Error history -->
        <GenericCard v-if="facilityErrorsHistory">
          <GenericCardHeader>
            <TextH2> Error History </TextH2>
          </GenericCardHeader>
          <GenericCardContent class="p-4">
            <ChartTimeSeries class="h-64" :data="facilityErrorsHistory" label="New Errors" />
          </GenericCardContent>
        </GenericCard>

        <!-- Failing NIs -->
        <GenericCard v-if="facility.statistics.messages.errorIdsCount > 0" class="mt-4">
          <GenericCardHeader>
            <TextH2> Records Currently Failing </TextH2>
          </GenericCardHeader>
          <ul class="divide-y divide-gray-200">
            <FacilitiesErrorIdsListItem v-for="ni in errorIdsPage" :key="ni" :ni="ni">
              {{ ni }}
            </FacilitiesErrorIdsListItem>
          </ul>
          <GenericPaginator
            class="bg-white border-t border-gray-200"
            :page="errorIdsPageNumber"
            :size="errorIdsPageSize"
            :total="facility.statistics.messages.errorIds.length"
            @next="errorIdsPageNumber++"
            @prev="errorIdsPageNumber--"
          />
        </GenericCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from '@nuxtjs/composition-api'

import { DateTime } from 'luxon'
import { Facility, ErrorHistoryItem } from '@/interfaces/facilities'
import fetchFacilities from '~/helpers/fetch/fetchFacilities'

export default defineComponent({
  props: {
    code: {
      type: String,
      required: true,
    },
    showHeading: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  setup(props) {
    const { fetchFacility, fetchFacilityErrorsHistory } = fetchFacilities()

    const facility = ref<Facility>()
    const facilityErrorsHistory = ref<ErrorHistoryItem[]>()

    const lastUpdatedString = computed(() => {
      if (!facility.value) {
        return ''
      }
      return DateTime.fromISO(facility.value.statistics.lastUpdated).toLocaleString(DateTime.DATETIME_SHORT)
    })

    // Failing NIs data
    const errorIdsPageNumber = ref(1)
    const errorIdsPageSize = ref(5)

    const errorIdsPage = computed(() => {
      if (!facility.value || !facility.value?.statistics.messages.errorIds) {
        return []
      }
      const start = (errorIdsPageNumber.value - 1) * errorIdsPageSize.value
      const end = start + errorIdsPageSize.value
      return facility.value?.statistics.messages.errorIds.slice(start, end)
    })

    onMounted(async () => {
      facility.value = await fetchFacility(props.code)
      facilityErrorsHistory.value = await fetchFacilityErrorsHistory(facility.value)
      console.log()
    })

    return {
      lastUpdatedString,
      facility,
      facilityErrorsHistory,
      errorIdsPage,
      errorIdsPageNumber,
      errorIdsPageSize,
    }
  },
})
</script>
