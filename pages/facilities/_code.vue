<template>
  <div>
    <!-- Show dashboard alerts for users with only one facility, that is, for whom this page IS their dashboard -->
    <DashboardAlerts v-if="!hasMultipleFacilities" class="mb-4" />

    <div class="mb-2">
      <h1 v-if="facility">{{ facility.description }}</h1>
      <BaseSkeleText v-else class="mb-2 h-8 w-1/4" />
      <h5 v-if="facility">
        {{ facility.id }}
      </h5>
      <BaseSkeleText v-else class="h-4 w-1/2" />
    </div>

    <div class="mb-6"><GenericTabsNavigation :tabs="tabs" /></div>

    <NuxtChild v-if="facility && extracts" :facility="facility" :extracts="extracts" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useMeta, useRoute } from "@nuxtjs/composition-api";
import { FacilityDetailsSchema, FacilityExtractsSchema } from "@ukkidney/ukrdc-axios-ts";
import BaseSkeleText from "~/components/base/BaseSkeleText.vue";

import usePermissions from "~/composables/usePermissions";

import { TabItem } from "~/interfaces/tabs";
import useApi from "~/composables/useApi";
import { insertIf } from "~/helpers/arrayUtils";

export default defineComponent({
  components: {
    BaseSkeleText,
  },
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

    // const tabs = [
    //   {
    //     name: "Overview",
    //     href: `/facilities/${route.value.params.code}`,
    //   },
    //   {
    //     name: "Errors",
    //     href: `/facilities/${route.value.params.code}/errors`,
    //   },
    // ] as TabItem[];

    const tabs = computed<TabItem[]>(() => {
      return [
        {
          name: "Overview",
          href: `/facilities/${route.value.params.code}`,
        },
        {
          name: "Errors",
          href: `/facilities/${route.value.params.code}/errors`,
        },
        ...insertIf(showStats.value, {
          name: "Demographics",
          href: `/facilities/${route.value.params.code}/demographics`,
        }),
      ];
    });

    // Data refs
    const facility = ref<FacilityDetailsSchema>();
    const extracts = ref<FacilityExtractsSchema>();

    const showStats = computed<boolean>(() => {
      if (extracts.value) {
        return extracts.value.ukrdc > 0;
      }
      return false;
    });

    // Data fetching

    onMounted(() => {
      facilitiesApi
        .getFacility({
          code: code.value,
        })
        .then((response) => {
          facility.value = response.data;
        });
      facilitiesApi
        .getFacilityExtracts({
          code: code.value,
        })
        .then((response) => {
          extracts.value = response.data;
        });
    });

    return {
      hasMultipleFacilities,
      tabs,
      code,
      facility,
      extracts,
    };
  },

  head: {
    title: "Facility",
  },
});
</script>
