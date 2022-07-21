<template>
  <div>
    <DashboardAlerts class="mb-8" />

    <AdminDashboard v-if="isAdmin" class="mb-6" />

    <TextH2 class="mb-4">My Facilities</TextH2>
    <FacilitiesTable @select="$router.push({ path: `/facilities/${$event}` })" />
  </div>
</template>

<script lang="ts">
import usePermissions from "~/helpers/usePermissions";

export default defineComponent({
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
