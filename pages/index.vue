<template>
  <div>
    <DashboardAlerts class="mb-8" />

    <AdministratorDashboard v-if="isAdmin" class="mb-6" />

    <h2 class="mb-4">My Facilities</h2>
    <FacilitiesTable @select="$router.push({ path: `/facilities/${$event}` })" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, useRouter } from "@nuxtjs/composition-api";

import AdministratorDashboard from "~/components/AdministratorDashboard.vue";
import DashboardAlerts from "~/components/DashboardAlerts.vue";
import FacilitiesTable from "~/components/FacilitiesTable.vue";
import usePermissions from "~/composables/usePermissions";

export default defineComponent({
  components: {
    AdministratorDashboard,
    DashboardAlerts,
    FacilitiesTable,
  },
  setup() {
    const router = useRouter();
    const { isAdmin, availableFacilities, hasMultipleFacilities } = usePermissions();

    // Data refs

    function redirectToOnlyFacility() {
      if (availableFacilities.value?.length === 1) {
        router.push({ path: `/facilities/${availableFacilities.value[0]}` });
      }
    }

    onMounted(() => {
      redirectToOnlyFacility();
    });

    return {
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
