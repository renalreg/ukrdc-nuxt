<template>
  <div>
    <div v-if="record && record.patient" class="mb-2 items-center md:flex">
      <div class="mb-4 flex-grow text-center sm:text-left md:mb-0">
        <TextNameH1 :forename="forename" :surname="surname" />
      </div>
      <div class="flex">
        <div v-if="record.masterId">
          <GenericButton :to="`/masterrecords/${record.masterId}`" class="truncate"> View Master Record </GenericButton>
        </div>
        <div v-if="related" class="ml-2">
          <GenericSelect v-model="selectedPid">
            <option v-for="(item, index) in relatedDataRecords" :key="index" :value="item.pid">
              From {{ item.sendingfacility }} via {{ item.sendingextract }}
            </option>
          </GenericSelect>
        </div>
      </div>
    </div>

    <div class="mb-6"><GenericTabsNavigation :tabs="tabs" /></div>

    <NuxtChild v-if="record" :record="record" />
  </div>
</template>

<script lang="ts">
import { PatientRecordSchema, PatientRecordSummarySchema } from "@ukkidney/ukrdc-axios-ts";
import { TabItem } from "~/interfaces/tabs";

import { firstForename, firstSurname, isMembership } from "@/helpers/utils/recordUtils";
import useApi from "~/helpers/useApi";

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { patientRecordsApi } = useApi();

    // Head
    useHead({
      title: computed(() => `Record ${route.params.pid}`),
    });
    // Data refs

    const record = ref<PatientRecordSchema>();
    const related = ref<PatientRecordSummarySchema[]>();

    // Data fetching

    function getRecord() {
      patientRecordsApi
        .getPatient({
          pid: route.params.pid,
        })
        .then((response) => {
          record.value = response.data;
        });

      patientRecordsApi
        .getPatientRelated({
          pid: route.params.pid,
        })
        .then((response) => {
          related.value = response.data;
        });
    }

    onMounted(() => {
      getRecord();
    });

    // PID Switcher UI

    const relatedDataRecords = computed<PatientRecordSummarySchema[]>(() => {
      if (related.value) {
        return related.value.filter((record) => !isMembership(record));
      }
      return [];
    });

    const selectedPid = ref(route.params.pid);

    watch(selectedPid, (value: string) => {
      router.push({ name: route.name!, params: { pid: value } });
    });

    // Dynamic UI elements

    const forename = computed(() => {
      return record.value ? firstForename(record.value) : "";
    });

    const surname = computed(() => {
      return record.value ? firstSurname(record.value) : "";
    });

    // Navigation

    const tabs = [
      {
        name: "Overview",
        href: `/patientrecords/${route.params.pid}`,
      },
      {
        name: "Medications",
        href: `/patientrecords/${route.params.pid}/medications`,
      },
      {
        name: "Treatments",
        href: `/patientrecords/${route.params.pid}/treatments`,
      },
      {
        name: "Results",
        href: `/patientrecords/${route.params.pid}/results`,
      },
      {
        name: "Observations",
        href: `/patientrecords/${route.params.pid}/observations`,
      },
      {
        name: "Documents",
        href: `/patientrecords/${route.params.pid}/documents`,
      },
      {
        name: "Surveys",
        href: `/patientrecords/${route.params.pid}/surveys`,
      },
    ] as TabItem[];

    return {
      record,
      related,
      relatedDataRecords,
      selectedPid,
      forename,
      surname,
      tabs,
    };
  },
});
</script>
