<template>
  <GenericTable>
    <thead class="bg-gray-50">
      <tr>
        <th scope="col" class="px-6 py-3 text-left">
          <div class="flex">
            <TextTh>Code</TextTh>
            <IconDynamicSort :active="sortBy === 'id'" :asc="idOrderAscending" @toggle="toggleId" />
          </div>
        </th>
        <th scope="col" class="px-6 py-3 text-left hidden md:block"><TextTh>Name</TextTh></th>
        <th scope="col" class="px-6 py-3 text-left">
          <div class="flex">
            <TextTh>Total Records</TextTh>
            <IconDynamicSort
              :active="sortBy === 'statistics.patient_records'"
              :asc="totalOrderAscending"
              @toggle="toggleTotal"
            />
          </div>
        </th>
        <th scope="col" class="px-6 py-3 text-left">
          <div class="flex">
            <TextTh>Failing Records</TextTh>
            <IconDynamicSort
              :active="sortBy === 'statistics.error_IDs_count'"
              :asc="failingOrderAscending"
              @toggle="toggleFailing"
            />
          </div>
        </th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr
        v-for="facility in facilities"
        :key="facility.id"
        class="hover:bg-gray-50 cursor-pointer"
        @click="$emit('select', facility.id)"
      >
        <GenericTableCell class="font-medium text-gray-900">{{ facility.id }}</GenericTableCell>
        <GenericTableCell class="hidden md:block">{{ facility.description }}</GenericTableCell>
        <GenericTableCell>{{ facility.statistics.patientRecords }}</GenericTableCell>
        <GenericTableCell class="flex items-center">
          <IconCircle
            class="inline"
            :class="facility.statistics.errorIdsCount > 0 ? 'text-red-700' : 'text-green-600'"
          />
          <p>{{ facility.statistics.errorIdsCount }}</p>
        </GenericTableCell>
      </tr>
    </tbody>
  </GenericTable>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { FacilitySummary } from '~/interfaces/facilities'

export default defineComponent({
  props: {
    facilities: {
      type: Array as () => FacilitySummary[],
      required: false,
      default: null,
    },
  },
  setup(_, { emit }) {
    const sortBy = ref<string | null>(null)

    const idOrderAscending = ref(true)
    const totalOrderAscending = ref(false)
    const failingOrderAscending = ref(false)

    function toggleId() {
      if (sortBy.value === 'id') {
        idOrderAscending.value = !idOrderAscending.value
      }
      sortBy.value = 'id'
      emit('sort', { sortBy: sortBy.value, orderBy: idOrderAscending.value ? 'asc' : 'desc' })
    }

    function toggleTotal() {
      if (sortBy.value === 'statistics.patient_records') {
        totalOrderAscending.value = !totalOrderAscending.value
      }
      sortBy.value = 'statistics.patient_records'
      emit('sort', { sortBy: sortBy.value, orderBy: totalOrderAscending.value ? 'asc' : 'desc' })
    }

    function toggleFailing() {
      if (sortBy.value === 'statistics.error_IDs_count') {
        failingOrderAscending.value = !failingOrderAscending.value
      }
      sortBy.value = 'statistics.error_IDs_count'
      emit('sort', { sortBy: sortBy.value, orderBy: totalOrderAscending.value ? 'asc' : 'desc' })
    }

    return {
      idOrderAscending,
      totalOrderAscending,
      failingOrderAscending,
      sortBy,
      toggleId,
      toggleTotal,
      toggleFailing,
    }
  },
})
</script>
