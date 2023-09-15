<template>
  <div>
    <BaseTabsNavigation id="stats-tabs" class="mb-6" :tabs="tabs" :mini="true" />

    <NuxtChild v-if="facility && extracts" :facility="facility" :extracts="extracts" />

    <BaseAlertInfo>
      <div class="text-blue-700">
        The data displayed on this page have yet to be fully verified and may be subject to change or correction.
        <br />
        They should be used for the purposes of improving data quality and accuracy, and should not be used to form the
        basis of clinical decisions.
      </div>
    </BaseAlertInfo>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, useRoute, useRouter } from "@nuxtjs/composition-api";
import { FacilityDetailsSchema, FacilityExtractsSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseAlertInfo from "~/components/base/alert/BaseAlertInfo.vue";
import BaseTabsNavigation from "~/components/base/BaseTabsNavigation.vue";

export default defineComponent({
  components: {
    BaseTabsNavigation,
    BaseAlertInfo,
  },
  props: {
    facility: {
      type: Object as () => FacilityDetailsSchema,
      required: true,
    },
    extracts: {
      type: Object as () => FacilityExtractsSchema,
      required: true,
    },
  },

  setup() {
    const route = useRoute();
    const router = useRouter();

    // Navigation

    const tabs = [
      {
        name: "Demographics",
        href: `/facilities/${route.value.params.code}/statistics/demographics`,
      },
      {
        name: "KRT",
        href: `/facilities/${route.value.params.code}/statistics/krt`,
      },
    ];

    onMounted(() => {
      // Default to demographics stats
      if (route.value.path === `/facilities/${route.value.params.code}/statistics`) {
        router.push(`/facilities/${route.value.params.code}/statistics/demographics`);
      }
    });

    return {
      tabs,
    };
  },
});
</script>
