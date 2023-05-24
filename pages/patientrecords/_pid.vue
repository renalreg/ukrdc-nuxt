<template>
  <div>
    <div v-if="record && record.patient" class="mb-2 items-center md:flex">
      <div class="mb-4 flex-grow text-center sm:text-left md:mb-0">
        <span>
          <h1 class="sensitive inline capitalize">{{ forename.toLowerCase() }}</h1>
          <h1 class="sensitive inline capitalize italic">
            {{ surname.toLowerCase() }}
          </h1>
        </span>
      </div>
      <div class="flex">
        <div v-if="record.masterId">
          <BaseButton :to="`/masterrecords/${record.masterId}`" class="truncate"> View Master Record </BaseButton>
        </div>
        <div v-if="related" class="ml-2">
          <BaseSelect v-model="selectedPid">
            <option v-for="(item, index) in related" :key="index" :value="item.pid">
              From {{ item.sendingfacility }} via {{ item.sendingextract }}
            </option>
          </BaseSelect>
        </div>
      </div>
    </div>

    <div class="mb-6"><BaseTabsNavigation :tabs="tabs" /></div>

    <NuxtChild v-if="record" :record="record" :related="related" />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useMeta,
  useRoute,
  useRouter,
  watch,
} from "@nuxtjs/composition-api";
import { PatientRecordSchema, PatientRecordSummarySchema } from "@ukkidney/ukrdc-axios-ts";

import BaseButton from "~/components/base/BaseButton.vue";
import BaseSelect from "~/components/base/BaseSelect.vue";
import BaseTabsNavigation from "~/components/base/BaseTabsNavigation.vue";
import useApi from "~/composables/useApi";
import { firstForename, firstSurname } from "~/helpers/recordUtils";
import { TabItem } from "~/interfaces/tabs";

export default defineComponent({
  components: {
    BaseButton,
    BaseSelect,
    BaseTabsNavigation,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { patientRecordsApi, ukrdcRecordGroupApi } = useApi();

    // Head
    const { title } = useMeta();
    title.value = `Record ${route.value.params.pid}`;

    // Data refs

    const record = ref<PatientRecordSchema>();
    const related = ref<PatientRecordSummarySchema[]>();

    // Data fetching

    function getRecord() {
      // Fetch patient record
      patientRecordsApi
        .getPatient({
          pid: route.value.params.pid,
        })
        .then((response) => {
          record.value = response.data;

          // Now we have the record, find other records with the same UKRDC ID
          ukrdcRecordGroupApi
            .getUkrdcidRecords({
              ukrdcid: record.value.ukrdcid,
            })
            .then((response) => {
              related.value = response.data;
            });
        });
    }

    onMounted(() => {
      getRecord();
    });

    // PID Switcher UI

    const selectedPid = ref(route.value.params.pid);

    watch(selectedPid, (value: string) => {
      router.push({ name: route.value.name!, params: { pid: value } });
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
        href: `/patientrecords/${route.value.params.pid}`,
      },
      {
        name: "Medications",
        href: `/patientrecords/${route.value.params.pid}/medications`,
      },
      {
        name: "Treatments",
        href: `/patientrecords/${route.value.params.pid}/treatments`,
      },
      {
        name: "Results",
        href: `/patientrecords/${route.value.params.pid}/results`,
      },
      {
        name: "Observations",
        href: `/patientrecords/${route.value.params.pid}/observations`,
      },
      {
        name: "Documents",
        href: `/patientrecords/${route.value.params.pid}/documents`,
      },
      {
        name: "Surveys",
        href: `/patientrecords/${route.value.params.pid}/surveys`,
      },
    ] as TabItem[];

    return {
      record,
      related,
      selectedPid,
      forename,
      surname,
      tabs,
    };
  },
  head: {
    title: "Patient Record",
  },
});
</script>
