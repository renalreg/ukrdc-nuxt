<template>
  <div>
    <LoadingIndicator v-if="!medications"></LoadingIndicator>
    <div v-if="medications && medications.length <= 0" class="text-gray-500 text-center">No medications on record</div>
    <div v-if="activeMedications.length > 0" class="mt-4">
      <h2 class="text-gray-500 text-sm font-medium uppercase tracking-wide">Active</h2>

      <ul class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="(item, index) of activeMedications" :key="index" class="col-span-1">
          <patientrecordsMedicationCard :item="item" />
        </li>
      </ul>
    </div>

    <div v-if="inactiveMedications.length > 0" class="mt-4">
      <h2 class="text-gray-500 text-sm font-medium uppercase tracking-wide">Inactive</h2>

      <ul class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="(item, index) of inactiveMedications" :key="index" class="col-span-1">
          <patientrecordsMedicationCard :item="item" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useContext } from '@nuxtjs/composition-api'

import { Medication } from '@/interfaces/medication'
import { PatientRecord } from '@/interfaces/patientrecord'

export default defineComponent({
  props: {
    record: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },

  setup(props) {
    const { $axios } = useContext()

    // Data refs
    const medications = ref<Medication[]>()

    // Data fetching

    async function fetchMedications() {
      medications.value = await $axios.$get(props.record.links.medications)
    }

    onMounted(() => {
      fetchMedications()
    })

    // Split active and inactive medications

    const activeMedications = computed(() => {
      if (!medications.value) return []
      return medications.value?.filter(function (item: Medication) {
        return item.toTime === null
      })
    })
    const inactiveMedications = computed(() => {
      if (!medications.value) return []
      return medications.value?.filter(function (item: Medication) {
        return item.toTime !== null
      })
    })

    return {
      activeMedications,
      inactiveMedications,
      medications,
    }
  },
})
</script>
