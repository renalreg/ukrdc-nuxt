<template>
  <LoadingIndicator v-if="!facilities"></LoadingIndicator>
  <div v-else>
    <SearchBar v-model="searchboxString" :focus="false" :show-button="false" />
    <GenericTable>
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left">
            <div class="flex">
              <TextTh>Code</TextTh>
              <IconDynamicSort :active="sortBy === 'id'" :asc="isAscending['id']" @toggle="toggleSort('id')" />
            </div>
          </th>
          <th scope="col" class="px-6 py-3 text-left hidden md:block"><TextTh>Name</TextTh></th>
          <th scope="col" class="px-6 py-3 text-left">
            <div class="flex">
              <TextTh>Total Records</TextTh>
              <IconDynamicSort
                :active="sortBy === 'statistics.total_patients'"
                :asc="isAscending['statistics.total_patients']"
                @toggle="toggleSort('statistics.total_patients')"
              />
            </div>
          </th>
          <th scope="col" class="px-6 py-3 text-left">
            <div class="flex">
              <TextTh>Failing Records</TextTh>
              <IconDynamicSort
                :active="sortBy === 'statistics.patients_receiving_message_error'"
                :asc="isAscending['statistics.patients_receiving_message_error']"
                @toggle="toggleSort('statistics.patients_receiving_message_error')"
              />
            </div>
          </th>
          <th scope="col" class="px-6 py-3 text-left">
            <div class="flex">
              <TextTh>Sending to PKB</TextTh>
              <IconDynamicFilter :active="filterByPkbOut" @toggle="filterByPkbOut = !filterByPkbOut" />
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="facility in filteredFacilities"
          :key="facility.id"
          class="hover:bg-gray-50 cursor-pointer"
          @click="$emit('select', facility.id)"
        >
          <GenericTableCell class="font-medium text-gray-900">{{ facility.id }}</GenericTableCell>
          <GenericTableCell class="hidden md:block">{{ facility.description }}</GenericTableCell>
          <GenericTableCell>{{ facility.statistics.totalPatients }}</GenericTableCell>
          <GenericTableCell>
            <div class="flex items-center">
              <IconCircle
                v-if="facility.statistics.lastUpdated"
                class="inline"
                :class="facility.statistics.patientsReceivingMessageError > 0 ? 'text-red-700' : 'text-green-600'"
              />
              <p>{{ facility.statistics.patientsReceivingMessageError }}</p>
            </div>
          </GenericTableCell>
          <GenericTableCell>
            <div class="flex items-center">
              <IconCircle class="inline" :class="facility.dataFlow.pkbOut ? 'text-green-600' : 'text-red-700'" />
              <p>{{ facility.dataFlow.pkbOut ? 'Yes' : 'No' }}</p>
            </div>
          </GenericTableCell>
        </tr>
      </tbody>
    </GenericTable>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from '@nuxtjs/composition-api'
import fetchFacilities from '~/helpers/fetch/fetchFacilities'
import { Facility } from '~/interfaces/facilities'

interface IsAscending {
  [key: string]: boolean | null
}

export default defineComponent({
  props: {
    includeEmpty: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  setup(props) {
    const { fetchFacilitiesList } = fetchFacilities()

    // Facility list and filters

    const facilities = ref<Facility[]>()
    const searchboxString = ref('')

    const filterByPkbOut = ref(false)

    const filteredFacilities = computed(() => {
      if (!facilities.value) return []
      return (
        facilities.value
          // Filter by search term
          .filter(
            (option) =>
              option.id.toLowerCase().startsWith(searchboxString.value.toLowerCase()) ||
              option.description.toLowerCase().startsWith(searchboxString.value.toLowerCase())
          )
          // Filter by additional filters, such as PkbOut
          .filter((option) => (filterByPkbOut.value ? option.dataFlow.pkbOut : true))
      )
    })

    // Sorting

    const sortBy = ref<string | null>(null)

    // Set initial order for id sorting. Other columns left as default
    const isAscending = ref<IsAscending>({
      id: true,
    })

    async function fetchTable() {
      const currentisAscending: null | boolean = isAscending.value[sortBy.value || 'default'] || null
      const currentOrderBy: string = currentisAscending ? 'asc' : 'desc'
      facilities.value = await fetchFacilitiesList(sortBy.value, currentOrderBy, props.includeEmpty)
    }

    async function toggleSort(key: string) {
      // Only reverse order if we're sorting by this key already
      if (sortBy.value === key) {
        // !null is true, so this should work always
        isAscending.value[key] = !isAscending.value[key]
      }
      sortBy.value = key
      await fetchTable()
    }

    onMounted(async () => {
      await fetchTable()
    })

    return {
      facilities,
      searchboxString,
      filterByPkbOut,
      filteredFacilities,
      isAscending,
      sortBy,
      toggleSort,
    }
  },
})
</script>
