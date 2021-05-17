<template>
  <div>
    <div
      v-if="medications.length <= 0"
      class="text-sm text-gray-500 text-center"
    >
      No medications on record
    </div>
    <div v-if="activeMedications.length > 0" class="mt-4">
      <h2 class="text-gray-500 text-xs font-medium uppercase tracking-wide">
        Active
      </h2>

      <ul
        class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <li
          v-for="(item, index) of activeMedications"
          :key="index"
          class="col-span-1"
        >
          <patientrecordsMedicationCard :item="item" />
        </li>
      </ul>
    </div>

    <div v-if="inactiveMedications.length > 0" class="mt-4">
      <h2 class="text-gray-500 text-xs font-medium uppercase tracking-wide">
        Inactive
      </h2>

      <ul
        class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <li
          v-for="(item, index) of inactiveMedications"
          :key="index"
          class="col-span-1"
        >
          <patientrecordsMedicationCard :item="item" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useFetch,
  useContext,
  computed,
} from '@nuxtjs/composition-api'

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

    const medications = ref([] as Medication[])

    useFetch(async () => {
      const res: Medication[] = await $axios.$get(
        props.record.links.medications
      )
      medications.value = res
    })

    const activeMedications = computed(() => {
      return medications.value.filter(function (item: Medication) {
        return item.toTime === null
      })
    })
    const inactiveMedications = computed(() => {
      return medications.value.filter(function (item: Medication) {
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
