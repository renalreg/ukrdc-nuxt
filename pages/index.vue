<template>
  <div>
    <div v-if="dash && (dash.warnings.length > 0 || dash.messages.length > 0)" class="mb-8">
      <genericAlertWarning v-for="message in dash.warnings" :key="message" :message="message"> </genericAlertWarning>
      <genericAlertInfo v-for="message in dash.messages" :key="message" :message="message"> </genericAlertInfo>
    </div>

    <AdminDashboard v-if="isAdmin" class="mb-6" />

    <div v-if="hasMultipleFacilities">
      <TextH2 class="mb-4">My Facilities</TextH2>
      <FacilitiesTable @select="$router.push({ path: `/facilities/${$event}` })" />
    </div>
    <FacilitiesOverview v-else-if="availableFacilities.length > 0" :code="availableFacilities[0]" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from '@nuxtjs/composition-api'
import { DashResponse } from '@/interfaces/dash'

import fetchDash from '~/helpers/fetch/fetchDash'

import usePermissions from '~/helpers/usePermissions'
import useAuth from '~/helpers/useAuth'

export default defineComponent({
  auth: false,

  setup() {
    const { signedIn } = useAuth()
    const { isAdmin, getFacilities, hasMultipleFacilities } = usePermissions()
    const { fetchDashboard } = fetchDash()

    // Data refs

    const dash = ref<DashResponse>()

    const availableFacilities = computed(() => {
      return getFacilities()
    })

    onMounted(async () => {
      if (signedIn()) {
        dash.value = await fetchDashboard()
      }
    })

    return {
      dash,
      hasMultipleFacilities,
      availableFacilities,
      isAdmin,
    }
  },

  head: {
    title: 'Dashboard',
  },
})
</script>
