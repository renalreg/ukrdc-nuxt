<template>
  <div>
    <NuxtLink :to="`/patientrecords/${record.pid}/`">
      <BaseAlertWarning v-if="!recordProbablyContainsData" class="mb-4">
        <div>
          <p class="text-yellow-700">
            You are currently viewing {{ recordDescription }}, which may not contain medical data.
          </p>
          <p class="text-yellow-700">Click to check Related Records for available data feed records.</p>
        </div>
      </BaseAlertWarning>
    </NuxtLink>
    <BaseTabsNavigation id="medical-tabs" class="mb-6" :tabs="tabs" :mini="true" :eager-to-collapse="true" />
    <NuxtChild v-if="record" :record="record" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, useRoute, useRouter } from "@nuxtjs/composition-api";
import { PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseAlertWarning from "~/components/base/alert/BaseAlertWarning.vue";
import BaseTabsNavigation from "~/components/base/BaseTabsNavigation.vue";
import { isInformational, isMembership } from "~/helpers/recordUtils";
import { TabItem } from "~/interfaces/tabs";

export default defineComponent({
  components: {
    BaseTabsNavigation,
    BaseAlertWarning,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },

  setup(props) {
    const route = useRoute();
    const router = useRouter();

    // Record type checks

    const recordProbablyContainsData = computed<boolean>(() => {
      return !(isInformational(props.record) || isMembership(props.record));
    });

    const recordDescription = computed<string>(() => {
      if (isInformational(props.record)) {
        return `an informational ${props.record.sendingfacility} record`;
      } else if (isMembership(props.record)) {
        const membershipType = props.record.sendingextract === "RADAR" ? "RADAR" : props.record.sendingfacility;
        return `a ${membershipType} membership record`;
      } else {
        return `a ${props.record.sendingextract} record sent by ${props.record.sendingfacility}`;
      }
    });

    // Navigation

    const tabs = [
      {
        name: "Results",
        href: `/patientrecords/${route.value.params.pid}/medical/results`,
      },
      {
        name: "Observations",
        href: `/patientrecords/${route.value.params.pid}/medical/observations`,
      },
      {
        name: "Diagnoses",
        href: `/patientrecords/${route.value.params.pid}/medical/diagnoses`,
      },
      {
        name: "Medications",
        href: `/patientrecords/${route.value.params.pid}/medical/medications`,
      },
      {
        name: "Treatments",
        href: `/patientrecords/${route.value.params.pid}/medical/treatments`,
      },
      {
        name: "Dialysis",
        href: `/patientrecords/${route.value.params.pid}/medical/dialysis`,
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
        router.push(`/patientrecords/${route.value.params.pid}/medical/results`);
      }
    });

    return {
      recordProbablyContainsData,
      recordDescription,
      tabs,
    };
  },
});
</script>
