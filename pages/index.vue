<template>
  <div>
    <div class="mb-8">
      <genericAlertWarning v-for="message in response.warnings" :key="message" :message="message">
      </genericAlertWarning>

      <genericAlertInfo v-for="message in response.messages" :key="message" :message="message"> </genericAlertInfo>
    </div>

    <!-- Admins will get workitems and records stats -->
    <div v-if="response.workitems && response.ukrdcrecords" class="max-w-7xl mx-auto mb-8">
      <dashStats :workitems="response.workitems" :ukrdcrecords="response.ukrdcrecords" />
    </div>

    <div v-if="facilities">
      <div v-if="facilities.length > 1">
        <TextH2>My Facilities</TextH2>
        <GenericSearchableSelect
          v-model="selectedFacility"
          class="my-4"
          :options="facilityIds"
          :labels="facilityLabels"
          hint="Select a facility..."
          :mount-opened="true"
          :closable="false"
        />
      </div>

      <FacilitiesOverview v-else-if="facilities.length > 0" :code="facilities[0].id" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useFetch, useContext, watch, useRouter } from '@nuxtjs/composition-api'
import useFacilities from '@/mixins/useFacilities'

import { DashResponse } from '@/interfaces/dash'

export default defineComponent({
  setup() {
    const router = useRouter()
    const { $axios, $config } = useContext()
    const { facilities, facilityIds, facilityLabels, selectedFacility, fetchFacilities } = useFacilities()

    const response = ref({} as DashResponse)
    const messages = ref([] as string[])
    const warnings = ref([] as string[])

    const error = ref('')

    useFetch(async () => {
      const dashResponse: DashResponse = await $axios.$get(`${$config.apiBase}/v1/dash/`)
      // Fetch the dashboard response from our API server
      response.value = dashResponse
      messages.value = dashResponse.messages
      warnings.value = dashResponse.warnings

      await fetchFacilities()
    })

    watch(selectedFacility, () => {
      if (selectedFacility.value) {
        router.push({ path: `/facilities/${selectedFacility.value}` })
      }
    })

    return {
      facilities,
      facilityIds,
      facilityLabels,
      selectedFacility,
      response,
      messages,
      warnings,
      error,
    }
  },

  head: {
    title: 'Dashboard',
  },
})
</script>
