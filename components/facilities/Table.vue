<!--
Table of facilities and their basic statistics
-->

<template>
  <LoadingIndicator v-if="!facilities"></LoadingIndicator>
  <div v-else>
    <SearchBar v-model="searchboxString" :focus="false" :show-button="false" />
    <GenericTable>
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-4 py-3 text-left">
            <div class="flex items-center gap-1">
              <TextTh>Code</TextTh>
              <IconDynamicSort :active="sortBy === 'id'" :asc="isAscending['id']" @toggle="toggleSort('id')" />
            </div>
          </th>
          <th scope="col" class="hidden px-4 py-3 text-left lg:table-cell">
            <TextTh>Name</TextTh>
          </th>
          <th scope="col" class="px-4 py-3 text-left">
            <div class="flex items-center gap-1">
              <TextTh>Total Records</TextTh>
              <IconDynamicSort
                :active="sortBy === 'statistics.total_patients'"
                :asc="isAscending['statistics.total_patients']"
                @toggle="toggleSort('statistics.total_patients')"
              />
            </div>
          </th>
          <th scope="col" class="px-4 py-3 text-left">
            <div class="flex items-center gap-1">
              <TextTh>Failing Records</TextTh>
              <IconDynamicSort
                :active="sortBy === 'statistics.patients_receiving_message_error'"
                :asc="isAscending['statistics.patients_receiving_message_error']"
                @toggle="toggleSort('statistics.patients_receiving_message_error')"
              />
            </div>
          </th>
          <th scope="col" class="px-4 py-3 text-left">
            <div class="flex items-center">
              <TextTh>Sending to PKB</TextTh>
              <IconDynamicFilter :active="filterByPkbOut" @toggle="filterByPkbOut = !filterByPkbOut" />
            </div>
          </th>
          <th scope="col" class="px-4 py-3 text-left">
            <div class="flex items-center gap-1">
              <TextTh>Last Received</TextTh>
              <IconDynamicSort
                :active="sortBy === 'latest_message.last_message_received_at'"
                :asc="isAscending['latest_message.last_message_received_at']"
                @toggle="toggleSort('latest_message.last_message_received_at')"
              />
              <IconDynamicFilter
                :active="filterByLastMessageOver48"
                @toggle="filterByLastMessageOver48 = !filterByLastMessageOver48"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr
          v-for="facility in filteredFacilities"
          :key="facility.id"
          class="cursor-pointer hover:bg-gray-50"
          @click="$emit('select', facility.id)"
        >
          <GenericTableCell class="font-medium text-gray-900">{{ facility.id }}</GenericTableCell>
          <GenericTableCell class="hidden max-w-sm truncate lg:table-cell">{{ facility.description }}</GenericTableCell>
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
              <p>{{ facility.dataFlow.pkbOut ? "Yes" : "No" }}</p>
            </div>
          </GenericTableCell>
          <GenericTableCell>
            <div class="flex items-center gap-2">
              <div>
                {{
                  facility.latestMessage.lastMessageReceivedAt
                    ? formatDate(facility.latestMessage.lastMessageReceivedAt, (t = false))
                    : "> Year Ago"
                }}
              </div>
              <IconExclamation
                v-if="facilityLastMessageOver48(facility)"
                v-tooltip="'No files received in over 48 hours'"
                class="inline text-yellow-600"
              />
            </div>
          </GenericTableCell>
        </tr>
      </tbody>
    </GenericTable>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "@nuxtjs/composition-api";
import fetchFacilities from "@/helpers/fetch/fetchFacilities";
import { formatDate } from "@/helpers/utils/dateUtils";
import { Facility } from "@/interfaces/facilities";

interface IsAscending {
  [key: string]: boolean | null;
}

export default defineComponent({
  props: {
    includeEmpty: {
      // Should facilities with no UKRDC records be included in the list?
      type: Boolean,
      default: false,
      required: false,
    },
    includeInactive: {
      // Should facilities with no feed files in the last year be included in the list?
      type: Boolean,
      default: false,
      required: false,
    },
  },
  setup(props) {
    const { fetchFacilitiesList } = fetchFacilities();

    // Facility list and filters

    const facilities = ref<Facility[]>();
    const searchboxString = ref("");

    const filterByPkbOut = ref(false);
    const filterByLastMessageOver48 = ref(false);

    const filteredFacilities = computed(() => {
      if (!facilities.value) return [];
      return (
        facilities.value
          // Filter by search term
          .filter(
            (option) =>
              option.id.toLowerCase().includes(searchboxString.value.toLowerCase()) ||
              option.description.toLowerCase().includes(searchboxString.value.toLowerCase())
          )
          // Filter by additional filters, such as PkbOut
          .filter((option) => (filterByPkbOut.value ? option.dataFlow.pkbOut : true))
          // Filter by last message over 48 hours
          .filter((option) => (filterByLastMessageOver48.value ? facilityLastMessageOver48(option) : true))
      );
    });

    // Facility warnings
    function facilityLastMessageOver48(facility: Facility) {
      // True if the last message received was over 48 hours ago
      return (
        !facility.latestMessage.lastMessageReceivedAt ||
        new Date(facility.latestMessage.lastMessageReceivedAt).getTime() <
          new Date().setHours(new Date().getHours() - 48)
      );
    }

    // Sorting

    const sortBy = ref<string | null>(null);

    // Set initial order for id sorting. Other columns left as default
    const isAscending = ref<IsAscending>({
      id: true,
    });

    async function fetchTable() {
      const currentisAscending: null | boolean = isAscending.value[sortBy.value || "default"] || null;
      const currentOrderBy: string = currentisAscending ? "asc" : "desc";
      facilities.value = await fetchFacilitiesList(
        sortBy.value,
        currentOrderBy,
        props.includeInactive,
        props.includeEmpty
      );
    }

    async function toggleSort(key: string) {
      // Only reverse order if we're sorting by this key already
      if (sortBy.value === key) {
        // !null is true, so this should work always
        isAscending.value[key] = !isAscending.value[key];
      }
      sortBy.value = key;
      await fetchTable();
    }

    onMounted(async () => {
      await fetchTable();
    });

    watch(
      () => [props.includeInactive, props.includeEmpty],
      async () => {
        await fetchTable();
      }
    );

    return {
      facilities,
      searchboxString,
      filterByPkbOut,
      filterByLastMessageOver48,
      filteredFacilities,
      isAscending,
      sortBy,
      facilityLastMessageOver48,
      toggleSort,
      formatDate,
    };
  },
});
</script>
