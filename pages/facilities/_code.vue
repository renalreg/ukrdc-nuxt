<template>
  <div>
    <!-- Show dashboard alerts for users with only one facility, that is, for whom this page IS their dashboard -->
    <DashboardAlerts v-if="!hasMultipleFacilities" class="mb-4" />

    <div class="mb-2">
      <TextH1 v-if="facility"> {{ facility.description }} </TextH1>
      <SkeleText v-else class="mb-2 h-8 w-1/4" />
      <TextL1 v-if="facility">
        {{ facility.id }}
      </TextL1>
      <SkeleText v-else class="h-4 w-1/2" />
    </div>

    <div class="mb-6"><GenericTabsNavigation :tabs="tabs" /></div>

    <NuxtChild v-if="facility" :facility="facility" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useMeta, useRoute } from "@nuxtjs/composition-api";

import { FacilityDetailsSchema } from "@ukkidney/ukrdc-axios-ts";
import usePermissions from "~/helpers/usePermissions";

import { TabItem } from "~/interfaces/tabs";
import useApi from "~/helpers/useApi";

export default defineComponent({
  setup() {
    const route = useRoute();
    const { hasMultipleFacilities } = usePermissions();

    const { facilitiesApi } = useApi();

    // Head
    const { title } = useMeta();
    title.value = `${route.value.params.code}`;

    // URL parameters
    const code = computed(() => route.value.params.code);

    // Navigation

    const tabs = [
      {
        name: "Overview",
        href: `/facilities/${route.value.params.code}`,
      },
      {
        name: "Errors",
        href: `/facilities/${route.value.params.code}/errors`,
      },
    ] as TabItem[];

    // Data refs
    const facility = ref<FacilityDetailsSchema>();

    // Data fetching

    onMounted(() => {
      facilitiesApi
        .getFacility({
          code: code.value,
        })
        .then((response) => {
          facility.value = response.data;
        });
    });

    return {
      hasMultipleFacilities,
      tabs,
      code,
      facility,
    };
  },

  head: {
    title: "Facility",
  },
});
</script>
