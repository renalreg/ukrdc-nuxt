<template>
  <div>
    <div v-if="dash && (dash.warnings.length > 0 || dash.messages.length > 0)" class="mb-8">
      <genericAlertWarning v-for="message in dash.warnings" :key="message" :message="message"> </genericAlertWarning>
      <genericAlertInfo v-for="message in dash.messages" :key="message" :message="message"> </genericAlertInfo>
    </div>

    <!-- Admins will get workitems and records stats -->
    <div v-if="dash && dash.workitems && dash.ukrdcrecords" class="max-w-7xl mx-auto mb-8">
      <dashStats :workitems="dash.workitems" :ukrdcrecords="dash.ukrdcrecords" />
    </div>

    <AdminDashboard v-if="isAdmin" class="mb-6" />

    <div v-if="facilities">
      <div v-if="facilities.length > 1">
        <TextH2>My Facilities</TextH2>
        <GenericSearchableSelect
          v-model="selectedFacility"
          class="my-4"
          :options="facilityIds"
          :labels="facilityLabels"
          hint="Select a facility..."
          :mount-opened="false"
          :closable="true"
        />

        <FacilitiesTable @select="selectTable" />
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
import usePermissions from '~/helpers/usePermissions'

export default defineComponent({
  setup() {
    const router = useRouter()
    const { facilities, facilityIds, facilityLabels, selectedFacility } = useFacilities()
    const { fetchDashboard } = fetchDash()

    const { isAdmin } = usePermissions()

    // Data refs

    const dash = ref<DashResponse>()

    function selectTable(id: string) {
      selectedFacility.value = id
    }

    // Data fetching
    watch(selectedFacility, () => {
      // Our facility selector applies a query param when a facility is selected
      // We watch this query param, and if it changes, we navigate to that facilities page
      if (selectedFacility.value) {
        router.push({ path: `/facilities/${selectedFacility.value}` })
      }
    })

    onMounted(async () => {
      dash.value = await fetchDashboard()
    })

    return {
      facilities,
      facilityIds,
      facilityLabels,
      selectedFacility,
      selectTable,
      dash,
      isAdmin,
    }
  },

  head: {
    title: 'Dashboard',
  },
})
</script>
