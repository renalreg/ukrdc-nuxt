<template>
  <div class="sensitive">
    <BaseLoadingContainer :loading="!medications">
      <p v-if="medications && medications.length <= 0" class="text-center">No medications on record</p>
      <div v-if="activeMedications.length > 0" class="mt-4">
        <h2 class="text-sm font-medium uppercase tracking-wide text-gray-500">Active</h2>

        <ul class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          <li v-for="(item, index) of activeMedications" :key="index" class="col-span-1">
            <patientrecordsMedicationCard :item="item" />
          </li>
        </ul>
      </div>

      <div v-if="inactiveMedications.length > 0" class="mt-4">
        <h2 class="text-sm font-medium uppercase tracking-wide text-gray-500">Inactive</h2>

        <ul class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          <li v-for="(item, index) of inactiveMedications" :key="index" class="col-span-1">
            <patientrecordsMedicationCard :item="item" />
          </li>
        </ul>
      </div>
    </BaseLoadingContainer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { MedicationSchema, PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";
import BaseLoadingContainer from "~/components/base/BaseLoadingContainer.vue";

import useApi from "~/composables/useApi";

export default defineComponent({
  components: {
    BaseLoadingContainer,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },

  setup(props) {
    const { patientRecordsApi } = useApi();

    // Data refs
    const medications = ref<MedicationSchema[]>();

    // Data fetching
    onMounted(() => {
      patientRecordsApi
        .getPatientMedications({
          pid: props.record.pid,
        })
        .then((response) => {
          medications.value = response.data;
        });
    });

    // Split active and inactive medications

    const activeMedications = computed(() => {
      if (!medications.value) return [];
      return medications.value?.filter(function (item: MedicationSchema) {
        return item.toTime === null;
      });
    });
    const inactiveMedications = computed(() => {
      if (!medications.value) return [];
      return medications.value?.filter(function (item: MedicationSchema) {
        return item.toTime !== null;
      });
    });

    return {
      activeMedications,
      inactiveMedications,
      medications,
    };
  },
});
</script>
