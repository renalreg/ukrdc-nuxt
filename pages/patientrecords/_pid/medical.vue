<template>
  <div>
    <BaseTabsNavigation id="stats-tabs" class="mb-6" :tabs="tabs" :mini="true" />
    <NuxtChild v-if="record" :record="record" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, useRoute, useRouter } from "@nuxtjs/composition-api";
import { PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseTabsNavigation from "~/components/base/BaseTabsNavigation.vue";
import { TabItem } from "~/interfaces/tabs";

export default defineComponent({
  components: {
    BaseTabsNavigation,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },

  setup() {
    const route = useRoute();
    const router = useRouter();

    // Navigation

    const tabs = [
      {
        name: "Medications",
        href: `/patientrecords/${route.value.params.pid}/medical/medications`,
      },
      {
        name: "Treatments",
        href: `/patientrecords/${route.value.params.pid}/medical/treatments`,
      },
      {
        name: "Results",
        href: `/patientrecords/${route.value.params.pid}/medical/results`,
      },
      {
        name: "Observations",
        href: `/patientrecords/${route.value.params.pid}/medical/observations`,
      },
      {
        name: "Documents",
        href: `/patientrecords/${route.value.params.pid}/medical/documents`,
      },
      {
        name: "Surveys",
        href: `/patientrecords/${route.value.params.pid}/medical/surveys`,
      },
    ] as TabItem[];

    onMounted(() => {
      // Default to first child tab
      if (route.value.path === `/patientrecords/${route.value.params.pid}/medical`) {
        router.push(`/patientrecords/${route.value.params.pid}/medical/medications`);
      }
    });

    return {
      tabs,
    };
  },
});
</script>
