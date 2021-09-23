<template>
  <div>
    <div v-if="warnings.length > 0 || messages.length > 0" class="mb-8">
      <genericAlertWarning v-for="message in warnings" :key="message" :message="message"> </genericAlertWarning>

      <genericAlertInfo v-for="message in messages" :key="message" :message="message"> </genericAlertInfo>
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
import { defineComponent, onMounted, ref, useRouter, watch } from '@nuxtjs/composition-api'
import useFacilities from '@/helpers/useFacilities'
import { DashResponse } from '@/interfaces/dash'
import fetchDash from '~/helpers/fetch/fetchDash'

export default defineComponent({
  setup() {
    const router = useRouter()
    const { facilities, facilityIds, facilityLabels, selectedFacility } = useFacilities()
    const { fetchDashboard } = fetchDash()

    // Data refs

    const response = ref({} as DashResponse)
    const messages = ref([] as string[])
    const warnings = ref([] as string[])

    const error = ref('')

    // Data fetching

    async function getDash() {
      const dashResponse = await fetchDashboard()
      // Fetch the dashboard response from our API server
      response.value = dashResponse
      messages.value = dashResponse.messages
      warnings.value = dashResponse.warnings
    }

    watch(selectedFacility, () => {
      // Our facility selector applies a query param when a facility is selected
      // We watch this query param, and if it changes, we navigate to that facilities page
      if (selectedFacility.value) {
        router.push({ path: `/facilities/${selectedFacility.value}` })
      }
    })

    onMounted(() => {
      getDash()
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
