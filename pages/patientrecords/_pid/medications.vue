<template>
  <div>
    <LoadingContainer :loading="!medications">
      <TextP v-if="medications && medications.length <= 0" class="text-center">No medications on record</TextP>
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
    </LoadingContainer>
  </div>
</template>

<script lang="ts">
import { Medication } from "@/interfaces/medication";
import { PatientRecord } from "@/interfaces/patientrecord";
import fetchPatientRecords from "~/helpers/fetch/fetchPatientRecords";

export default defineComponent({
  props: {
    record: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },

  setup(props) {
    const { fetchPatientRecordMedications } = fetchPatientRecords();

    // Data refs
    const medications = ref<Medication[]>();

    // Data fetching
    onMounted(async () => {
      medications.value = await fetchPatientRecordMedications(props.record);
    });

    // Split active and inactive medications

    const activeMedications = computed(() => {
      if (!medications.value) return [];
      return medications.value?.filter(function (item: Medication) {
        return item.toTime === null;
      });
    });
    const inactiveMedications = computed(() => {
      if (!medications.value) return [];
      return medications.value?.filter(function (item: Medication) {
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
