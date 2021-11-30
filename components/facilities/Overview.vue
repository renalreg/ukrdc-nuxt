<!--
Overview (statistics etc) of a single Facility. Used by both the Facilities
page (for multi-facility users), and the homepage (for single-facility users).
-->

<template>
  <div>
    <div class="mb-4">
      <TextH1 v-if="facility"> {{ facility.description }} </TextH1>
      <SkeleText v-else class="h-8 w-1/4 mb-2" />
      <TextL1 v-if="facility">
        {{ facility.id }}
      </TextL1>
      <SkeleText v-else class="h-4 w-1/2" />
    </div>

    <div v-if="facility && !facility.statistics.lastUpdated">
      <TextP>
        No data available. This usually means the service has recently been restarted, and is rebuilding statistics.
      </TextP>
      <TextP> Please try again in a few minutes. </TextP>
    </div>

    <div v-else-if="facility && facility.statistics.lastUpdated">
      <TextL2 class="mb-2 -mt-4 text-right"> Last updated {{ lastUpdatedString }} </TextL2>
      <!-- Basic stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <NuxtLink class="group" :to="{ path: `/masterrecords/`, query: { search: [`facility=${code}`, ''] } }">
          <GenericCard>
            <div class="flex items-center p-4">
              <div class="flex-shrink-0">
                <IconUsers />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <GenericCardDt>Total Patients</GenericCardDt>
                  <dd>
                    <TextHc class="group-hover:underline">{{ facility.statistics.totalPatients }}</TextHc>
                  </dd>
                </dl>
              </div>
            </div>
            <div class="bg-gray-50 text-gray-500 px-4 py-2 text-sm">
              Total patients ever stored in the UKRDC for this facility
            </div>
          </GenericCard>
        </NuxtLink>

        <GenericCard>
          <div class="flex items-center p-4">
            <div class="flex-shrink-0">
              <IconCheck />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <GenericCardDt>Active Passing Records</GenericCardDt>
                <dd>
                  <h1 class="text-2xl font-semibold text-green-600">
                    {{ facility.statistics.patientsReceivingMessageSuccess }}
                  </h1>
                </dd>
              </dl>
            </div>
          </div>
          <div class="bg-gray-50 text-gray-500 px-4 py-2 text-sm">
            Records with active data files being successfully received
          </div>
        </GenericCard>

        <GenericCard>
          <div class="flex items-center p-4">
            <div class="flex-shrink-0">
              <IconExclamation />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <GenericCardDt>Active Failing Records</GenericCardDt>
                <dd>
                  <h1
                    class="text-2xl font-semibold"
                    :class="facility.statistics.patientsReceivingMessageError > 0 ? 'text-red-600' : 'text-green-600'"
                  >
                    {{ facility.statistics.patientsReceivingMessageError }}
                  </h1>
                </dd>
              </dl>
            </div>
          </div>
          <div class="bg-gray-50 text-gray-500 px-4 py-2 text-sm">
            Records with active data files currently failing due to errors
          </div>
        </GenericCard>
      </div>
    </div>

    <!-- Data flow -->
    <GenericCard v-if="facility && facility.dataFlow" class="mb-4">
      <GenericCardContent>
        <GenericDl>
          <GenericDi>
            <TextDt>
              Sending data to
              <a class="hover:underline" href="https://patientsknowbest.com/" target="blank">Patients Know Best</a>
            </TextDt>
            <TextDd>
              <div v-if="facility && facility.dataFlow.pkbOut" class="flex items-center gap-2">
                <div>Yes</div>
                <IconCheckCircle class="inline text-green-600" />
              </div>
              <div v-else>No</div>
            </TextDd>
          </GenericDi>
          <!-- TODO: Add this back in once PKB in is relevant
          <GenericDi>
            <TextDt>
              Receiving data from <a class="hover:underline" href="https://patientsknowbest.com/" target="blank">Patients Know Best</a>
            </TextDt>
            <TextDd>
              <div v-if="facility && facility.dataFlow.pkbIn" class="flex items-center gap-2">
                <div>Yes</div>
                <IconCheckCircle class="inline text-green-600" />
              </div>
              <div v-else>No</div>
            </TextDd>
          </GenericDi>
          -->
          <GenericDi>
            <TextDt>
              Excluding data from
              <a class="hover:underline" href="https://patientsknowbest.com/" target="blank">Patients Know Best</a>
            </TextDt>
            <TextDd>
              <div v-if="facility && facility.dataFlow.pkbMessageExclusions.length > 0" class="flex items-center gap-2">
                <div>{{ facility.dataFlow.pkbMessageExclusions.join(', ') }}</div>
              </div>
              <div v-else>None</div>
            </TextDd>
          </GenericDi>
        </GenericDl>
      </GenericCardContent>
    </GenericCard>

    <!-- Error history -->
    <GenericCard v-if="facilityErrorsHistory">
      <GenericCardHeader>
        <TextH2> Error History </TextH2>
      </GenericCardHeader>
      <GenericCardContent class="p-4">
        <ChartTimeSeries
          class="h-64"
          :data="facilityErrorsHistory"
          label="New Errors"
          @click="historyPointClickHandler"
        />
      </GenericCardContent>
    </GenericCard>

    <!-- Failing NIs -->
    <GenericCard v-if="errorMessages && errorMessagesTotal > 0" class="mt-4">
      <GenericCardHeader>
        <TextH2> Records Currently Failing </TextH2>
        <TextL1>Records where the most recent message received failed to process due to errors.</TextL1>
      </GenericCardHeader>
      <ul class="divide-y divide-gray-200">
        <div v-for="item in errorMessages" :key="item.id" :item="item" class="hover:bg-gray-50">
          <NuxtLink :to="`/messages/${item.id}`">
            <MessagesListItem :item="item" />
          </NuxtLink>
        </div>
      </ul>
      <GenericPaginator
        class="bg-white border-t border-gray-200"
        :jump-to-top="false"
        :page="errorMessagesPage"
        :size="errorMessagesSize"
        :total="errorMessagesTotal"
        @next="errorMessagesPage++"
        @prev="errorMessagesPage--"
        @jump="errorMessagesPage = $event"
      />
    </GenericCard>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useRouter, watch } from '@nuxtjs/composition-api'

import { formatDate } from '@/helpers/utils/dateUtils'

import { Facility } from '~/interfaces/facilities'
import { HistoryItem } from '~/interfaces/common'

import fetchFacilities from '~/helpers/fetch/fetchFacilities'
import { Message } from '~/interfaces/messages'
import { HistoryPointEvent } from '~/interfaces/charts'

import { getPointDateRange } from '@/helpers/utils/chartUtils'

export default defineComponent({
  props: {
    code: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter()
    const { fetchFacility, fetchFacilityErrorsHistory, fetchFacilityPatientsLatestErrorsPage } = fetchFacilities()

    const facility = ref<Facility>()
    const facilityErrorsHistory = ref<HistoryItem[]>()

    // Computed string for statistics last updated time
    const lastUpdatedString = computed(() => {
      if (!facility.value) {
        return ''
      }
      return formatDate(facility.value.statistics.lastUpdated, true)
    })

    // Failing NIs data
    const errorMessages = ref([] as Message[])
    const errorMessagesPage = ref(1)
    const errorMessagesSize = ref(5)
    const errorMessagesTotal = ref(0)

    // History plot click handler

    function historyPointClickHandler(point: HistoryPointEvent) {
      const pointRange = getPointDateRange(point)
      router.push({
        path: '/messages',
        query: {
          since: pointRange.since,
          until: pointRange.until,
          facility: props.code,
          status: ['ERROR', 'RESOLVED'],
        },
      })
    }

    // Data fetching

    async function updateErrorMessages(): Promise<void> {
      if (facility.value) {
        const errorsPage = await fetchFacilityPatientsLatestErrorsPage(
          facility.value,
          errorMessagesPage.value,
          errorMessagesSize.value,
          null
        )
        // Set related errors
        errorMessages.value = errorsPage.items
        errorMessagesPage.value = errorsPage.page
        errorMessagesSize.value = errorsPage.size
        errorMessagesTotal.value = errorsPage.total
      }
    }

    async function updateErrorsHistory(): Promise<void> {
      if (facility.value) {
        facilityErrorsHistory.value = await fetchFacilityErrorsHistory(facility.value)
      }
    }

    onMounted(() => {
      fetchFacility(props.code).then((response) => {
        facility.value = response
        updateErrorMessages()
        updateErrorsHistory()
      })
    })

    watch(errorMessagesPage, () => {
      updateErrorMessages()
    })

    return {
      lastUpdatedString,
      facility,
      facilityErrorsHistory,
      errorMessages,
      errorMessagesPage,
      errorMessagesSize,
      errorMessagesTotal,
      historyPointClickHandler,
    }
  },
})
</script>
