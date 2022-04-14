<template>
  <div>
    <div v-if="dash && (dash.warnings.length > 0 || dash.messages.length > 0)" class="mb-8">
      <genericAlertWarning v-for="message in dash.warnings" :key="message" :message="message"> </genericAlertWarning>
      <genericAlertInfo v-for="message in dash.messages" :key="message" :message="message"> </genericAlertInfo>
    </div>

    <AdminDashboard v-if="isAdmin" class="mb-6" />

    <TextH2 class="mb-4">My Facilities</TextH2>
    <FacilitiesTable @select="$router.push({ path: `/facilities/${$event}` })" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, useContext, useRouter } from "@nuxtjs/composition-api";
import { DashResponse } from "@/interfaces/dash";

import fetchDash from "~/helpers/fetch/fetchDash";

import usePermissions from "~/helpers/usePermissions";

export default defineComponent({
  setup() {
    const router = useRouter();
    const { $okta } = useContext();
    const { isAdmin, availableFacilities, hasMultipleFacilities } = usePermissions();
    const { fetchDashboard } = fetchDash();

    // Data refs

    const dash = ref<DashResponse>();

    function redirectToOnlyFacility() {
      if (availableFacilities.value?.length === 1) {
        router.push({ path: `/facilities/${availableFacilities.value[0]}` });
      }
    }

    onMounted(async () => {
      redirectToOnlyFacility();
      if (await $okta.isAuthenticated()) {
        dash.value = await fetchDashboard();
      }
    });

    return {
      dash,
      hasMultipleFacilities,
      availableFacilities,
      isAdmin,
    };
  },

  head: {
    title: "Dashboard",
  },
});
</script>
