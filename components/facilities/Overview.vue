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
      <!-- New errors -->
      <GenericCardSplit class="mb-4">
        <dashStatBlock
          :value="facility.statistics.errors ? facility.statistics.errors.day : undefined"
          :previous-value="facility.statistics.errors ? facility.statistics.errors.prev : undefined"
          :invert="true"
          title="New Errors"
        />

        <dashStatBlock
          :value="facility.statistics.errors ? facility.statistics.errors.total : undefined"
          title="Total Errors"
        />
      </GenericCardSplit>

      <!-- New records -->
      <GenericCardSplit class="mb-4">
        <dashStatBlock
          :value="facility.statistics.patientRecords ? facility.statistics.patientRecords.day : undefined"
          :previous-value="facility.statistics.patientRecords ? facility.statistics.patientRecords.prev : undefined"
          :invert="false"
          title="New Records"
        />

        <dashStatBlock
          :value="facility.statistics.patientRecords ? facility.statistics.patientRecords.total : undefined"
          title="Total Records"
        />
      </GenericCardSplit>

      <GenericCard>
        <!-- Card header -->
        <GenericCardHeader>
          <TextH2> Data Quality </TextH2>
        </GenericCardHeader>
        <!-- Card content -->
        <div
          class="
            grid grid-cols-1
            items-center
            overflow-hidden
            divide-y divide-gray-200
            md:grid-cols-2 md:divide-y-0 md:divide-x
          "
        >
          <div class="pl-4 py-4">
            <div class="mb-4">
              <dt class="text-base font-normal text-gray-900">Total Patient Records</dt>
              <dd class="mt-1 flex justify-between items-baseline md:block lg:flex">
                <TextHc>
                  {{ facility.statistics.patientRecords.total }}
                </TextHc>
              </dd>
            </div>

            <div>
              <dt class="text-base font-normal text-gray-900">Patient Records with Errors</dt>
              <dd class="mt-1 flex justify-between items-baseline md:block lg:flex">
                <TextHc>
                  {{ facility.statistics.recordsWithErrors }}
                </TextHc>
              </dd>
            </div>
          </div>
          <div class="h-full pl-4 flex items-center">
            <div class="flex-grow">
              <div class="text-base font-normal text-gray-900">Data Score</div>
              <DashQualityScore :percent="qualityPct" />
            </div>
            <ChartDoughnut
              class="w-44 p-4 float-right"
              :data="[
                facility.statistics.recordsWithErrors,
                facility.statistics.patientRecords.total - facility.statistics.recordsWithErrors,
              ]"
              :colors="['rgb(239, 68, 68)', 'rgb(16, 185, 129)']"
              :labels="['Errors', 'No Errors']"
              :options="{ plugins: { legend: { display: false, position: 'right' } } }"
            />
          </div>
        </div>
      </GenericCard>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useContext } from '@nuxtjs/composition-api'

import { Facility } from '@/interfaces/facilities'

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
    const { $axios, $config } = useContext()

    const facility = ref<Facility>()

    async function fetchFacility() {
      facility.value = await $axios.$get(`${$config.apiBase}/v1/facilities/${props.code}`)
    }

    const qualityPct = computed<number>(() => {
      if (!facility.value) {
        return 0
      }
      const total = facility.value.statistics.patientRecords.total
      if (total === 0) {
        return 100
      }
      const bad = facility.value.statistics.recordsWithErrors
      const good = total - bad
      return (good / total) * 100
    })

    onMounted(() => {
      fetchFacility()
    })

    return {
      facility,
      qualityPct,
    }
  },
})
</script>
