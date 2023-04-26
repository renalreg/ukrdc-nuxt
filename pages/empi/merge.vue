<template>
  <div>
    <BaseModalConfirm
      ref="beginMergeAlert"
      title="Begin Record Merge"
      message="Are you sure you want to begin merging these records?"
      icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      :danger="true"
      @confirm="requestMerge()"
    />

    <div class="mx-auto mb-4 max-w-7xl">
      <h1>Merge Records</h1>
    </div>

    <div class="mb-6 block gap-2 lg:flex">
      <div class="flex-1">
        <div v-if="superseded">
          <BaseButton class="w-full" @click="clearSuperceeded"> Change Superseded Record </BaseButton>
          <NuxtLink :to="`/masterrecords/${superseded.id}`">
            <MasterRecordCard
              class="mt-4"
              :record="superseded"
              :label="`Superseded Record ${superseded.id.toString()}`"
              :highlight="highlightSections"
            />
          </NuxtLink>
        </div>
        <div v-else>
          <EMPISearch v-if="searchingFor === 'superseded'" :number-types="['UKRDC']" @select="selectSuperceeded" />
          <BaseButton v-else class="w-full" @click="searchingFor = 'superseded'"> Search for a Record </BaseButton>
        </div>
      </div>

      <div class="my-4 mb-2 flex flex-none flex-row justify-center lg:my-0 lg:w-8 lg:flex-col lg:justify-start">
        <div class="flex-shrink">
          <button
            v-tooltip="'Switch Records'"
            class="mx-auto block w-8 rounded-md border border-gray-300 bg-white font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="switchRecords"
          >
            <IconArrowsRightLeft class="mx-auto my-2 hidden text-gray-400 lg:block" />
            <IconArrowsUpDown class="mx-auto my-2 block text-gray-400 lg:hidden" />
          </button>
        </div>
        <div class="hidden flex-grow flex-col justify-center lg:flex">
          <div v-show="superseded && superseding" class="h-8">
            <IconArrowRight class="mx-auto my-2 text-gray-400" />
          </div>
        </div>
      </div>

      <div class="flex-1">
        <div v-if="superseding">
          <BaseButton class="w-full" @click="clearsuperseding"> Change Superseding Record </BaseButton>
          <NuxtLink :to="`/masterrecords/${superseding.id}`">
            <MasterRecordCard
              class="mt-4"
              :record="superseding"
              :label="`Superseding Record ${superseding.id.toString()}`"
              :highlight="highlightSections"
            />
          </NuxtLink>
        </div>
        <div v-else>
          <EMPISearch v-if="searchingFor === 'superseding'" :number-types="['UKRDC']" @select="selectsuperseding" />
          <BaseButton v-else class="w-full" @click="searchingFor = 'superseding'"> Search for a Record </BaseButton>
        </div>
      </div>
    </div>

    <BaseAlertWarning v-if="mergeBlockDescription" class="mb-4" :message="mergeBlockDescription" />

    <BaseAlertError
      v-if="highlightSections.length > 0"
      class="mb-4"
      :message="`You are about to merge records with mismatching demographics for: ${highlightSections.join(', ')}`"
    />

    <div v-if="readyToMerge">
      <div class="mb-6">
        <h2 class="mb-2">Merge Details</h2>
        <p>
          Master Record <b>{{ supersededId }}</b> will be merged into Master Record <b>{{ supersedingId }}</b
          >.
        </p>
        <p>
          Demographic data on record <b>{{ supersededId }}</b> will be replaced by demographic data from record
          <b>{{ supersedingId }}</b
          >.
        </p>
        <p>
          All Patient Records linked to Master Record <b>{{ supersededId }}</b> will be re-linked to Master Record
          <b>{{ supersedingId }}</b
          >.
        </p>
      </div>

      <div class="flex gap-2">
        <BaseButton :primary="true" colour="red" @click="beginMergeAlert?.show()">Begin Record Merge</BaseButton>
        <BaseButton v-if="callbackPath" :to="callbackPath">Cancel</BaseButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useContext,
  useRoute,
  useRouter,
  watch,
} from "@nuxtjs/composition-api";
import { MasterRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseAlertError from "~/components/base/BaseAlertError.vue";
import BaseAlertWarning from "~/components/base/BaseAlertWarning.vue";
import BaseButton from "~/components/base/BaseButton.vue";
import BaseModalConfirm from "~/components/base/BaseModalConfirm.vue";
import EMPISearch from "~/components/EMPISearch.vue";
import IconArrowsRightLeft from "~/components/icons/hero/20/solid/IconArrowsRightLeft.vue";
import IconArrowsUpDown from "~/components/icons/hero/20/solid/IconArrowsUpDown.vue";
import IconArrowRight from "~/components/icons/hero/24/solid/IconArrowRight.vue";
import MasterRecordCard from "~/components/MasterRecordCard.vue";
import useQuery from "~/composables/query/useQuery";
import useApi from "~/composables/useApi";
import { ModalInterface } from "~/interfaces/modal";

type Direction = "superseding" | "superseded";

export default defineComponent({
  components: {
    BaseButton,
    BaseModalConfirm,
    BaseAlertError,
    BaseAlertWarning,
    IconArrowRight,
    IconArrowsRightLeft,
    IconArrowsUpDown,
    MasterRecordCard,
    EMPISearch,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { $toast } = useContext();
    const { stringQuery } = useQuery();
    const { patientIndexOperationsApi, masterRecordsApi } = useApi();

    // Modals

    const beginMergeAlert = ref<ModalInterface>();

    // Data refs

    const supersededId = stringQuery("superseded", null, true, false);
    const supersedingId = stringQuery("superseding", null, true, false);
    const callbackPath = stringQuery("callback", null);

    const superseded = ref<MasterRecordSchema>();
    const superseding = ref<MasterRecordSchema>();

    const searchingFor = ref<Direction>();

    const readyToMerge = computed(() => {
      return superseded.value?.id && superseding.value?.id && superseded.value?.id !== superseding.value?.id;
    });

    const mergeBlockDescription = computed(() => {
      if (superseded.value?.id && superseding.value?.id) {
        if (superseded.value?.id === superseding.value?.id) {
          return "A record cannot be merged into itself. Please select a different record on one side.";
        }
        if (superseded.value?.nationalidType !== superseding.value?.nationalidType) {
          return `You are about to merge a ${superseded.value?.nationalidType} record into a ${superseding.value?.nationalidType} record.`;
        }
      }
      return "";
    });

    // Data fetching
    function fetchRecords() {
      if (supersededId.value) {
        masterRecordsApi
          .getMasterRecord({
            recordId: Number(supersededId.value),
          })
          .then((response) => {
            superseded.value = response.data;
          });
      }
      if (supersedingId.value) {
        masterRecordsApi
          .getMasterRecord({
            recordId: Number(supersedingId.value),
          })
          .then((response) => {
            superseding.value = response.data;
          });
      }
    }

    onMounted(() => {
      fetchRecords();
    });

    watch([supersededId, supersedingId], () => {
      fetchRecords();
    });

    // Record card style

    const highlightSections = computed<string[]>(() => {
      if (!(superseding.value && superseded.value)) {
        return [];
      }
      const highlight = [];
      if (
        superseding.value.givenname !== superseded.value.givenname ||
        superseding.value.surname !== superseded.value.surname
      ) {
        highlight.push("name");
      }
      if (superseding.value.dateOfBirth !== superseded.value.dateOfBirth) {
        highlight.push("dateOfBirth");
      }
      if (superseding.value.gender !== superseded.value.gender) {
        highlight.push("gender");
      }
      return highlight;
    });

    // Edit merge functions

    function switchRecords() {
      const newQuery = Object.assign({}, route.value.query);
      newQuery.superseded = [supersedingId.value];
      newQuery.superseding = [supersededId.value];
      router.push({
        path: route.value.path,
        query: newQuery,
      });
    }

    function clearMerge() {
      superseding.value = undefined;
      superseded.value = undefined;
      searchingFor.value = undefined;
      const newQuery = Object.assign({}, route.value.query);
      newQuery.superseded = [null];
      newQuery.superseding = [null];
      router.push({
        path: route.value.path,
        query: newQuery,
      });
    }

    function clearsuperseding() {
      superseding.value = undefined;
      supersedingId.value = null;
      searchingFor.value = "superseding";
    }

    function clearSuperceeded() {
      superseded.value = undefined;
      supersededId.value = null;
      searchingFor.value = "superseded";
    }

    function selectsuperseding(id: string) {
      supersedingId.value = id;
    }

    function selectSuperceeded(id: string) {
      supersededId.value = id;
    }

    // Do merge

    function requestMerge() {
      if (superseded.value && superseding.value) {
        patientIndexOperationsApi
          .postEmpiMerge({
            mergeRequest: {
              superseded: superseded.value.id,
              superseding: superseding.value.id,
            },
          })
          .then(() => {
            $toast.show({
              type: "success",
              title: "Success",
              message: "Record merge request sent successfully",
              timeout: 10,
              classTimeout: "bg-green-600",
            });
            clearMerge();
            if (callbackPath.value) {
              router.push(callbackPath.value);
            }
          })
          .finally(() => {
            const el = beginMergeAlert.value as ModalInterface;
            el.hide();
          });
      }
    }

    return {
      beginMergeAlert,
      supersededId,
      supersedingId,
      callbackPath,
      superseded,
      superseding,
      searchingFor,
      highlightSections,
      clearsuperseding,
      clearSuperceeded,
      selectsuperseding,
      selectSuperceeded,
      switchRecords,
      readyToMerge,
      mergeBlockDescription,
      requestMerge,
    };
  },
});
</script>
