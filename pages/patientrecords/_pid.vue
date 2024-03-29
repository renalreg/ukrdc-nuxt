<template>
  <div>
    <div v-if="record && record.patient" class="mb-8 items-center sm:mb-2 sm:flex">
      <div class="mb-4 flex-grow text-center sm:text-left md:mb-0">
        <span>
          <h1 class="sensitive inline capitalize">{{ forename.toLowerCase() }}</h1>
          <h1 class="sensitive inline capitalize italic">
            {{ surname.toLowerCase() }}
          </h1>
        </span>
        <PatientRecordExtractSummary class="justify-center sm:justify-start" :record="record" />
      </div>
      <div class="flex justify-center sm:justify-start">
        <div v-if="record.masterId">
          <BaseButton :to="`/masterrecords/${record.masterId}`" class="truncate"> View Master Record </BaseButton>
        </div>
      </div>
    </div>

    <div class="mb-6"><BaseTabsNavigation :tabs="tabs" /></div>

    <NuxtChild v-if="record" :record="record" />
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
import { PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseButton from "~/components/base/BaseButton.vue";
import BaseTabsNavigation from "~/components/base/BaseTabsNavigation.vue";
import PatientRecordExtractSummary from "~/components/patientrecord/PatientRecordExtractSummary.vue";
import useApi from "~/composables/useApi";
import usePermissions from "~/composables/usePermissions";
import { insertIf } from "~/helpers/arrayUtils";
import { firstForename, firstSurname } from "~/helpers/recordUtils";
import { TabItem } from "~/interfaces/tabs";

export default defineComponent({
  components: {
    PatientRecordExtractSummary,
    BaseButton,
    BaseTabsNavigation,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { patientRecordsApi } = useApi();
    const { hasPermission } = usePermissions();

    // Head
    const { title } = useMeta();
    title.value = `Record ${route.value.params.pid}`;

    // Data refs

    const record = ref<PatientRecordSchema>();

    // Data fetching

    function getRecord() {
      // Fetch patient record
      patientRecordsApi
        .getPatient({
          pid: route.value.params.pid,
        })
        .then((response) => {
          record.value = response.data;
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
        name: "Medical Record",
        href: `/patientrecords/${route.value.params.pid}/medical`,
        hasChildren: true,
      },
      {
        name: "Data Files",
        href: `/patientrecords/${route.value.params.pid}/messages`,
      },
      ...insertIf(hasPermission("ukrdc:audit:records:read"), {
        name: "Audit",
        href: `/patientrecords/${route.value.params.pid}/audit`,
      }),
    ] as TabItem[];

    return {
      record,
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
