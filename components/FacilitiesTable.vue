<!--
Table of facilities and their basic statistics
-->

<template>
  <div>
    <SearchBar v-model="searchboxString" :focus="false" :show-button="false" />
    <BaseTable>
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="text-left">
            <div class="flex items-center gap-1">
              Code
              <BaseSortIcon :active="sortBy === 'id'" :asc="isAscending['id']" @toggle="toggleSort('id')" />
            </div>
          </th>
          <th scope="col" class="hidden text-left lg:table-cell">Name</th>
          <th scope="col" class="text-left">
            <div class="flex items-center gap-1">
              Total Records
              <BaseSortIcon
                :active="sortBy === 'statistics.total_patients'"
                :asc="isAscending['statistics.total_patients']"
                @toggle="toggleSort('statistics.total_patients')"
              />
            </div>
          </th>
          <th scope="col" class="text-left">
            <div class="flex items-center gap-1">
              Failing Records
              <BaseSortIcon
                :active="sortBy === 'statistics.patients_receiving_message_error'"
                :asc="isAscending['statistics.patients_receiving_message_error']"
                @toggle="toggleSort('statistics.patients_receiving_message_error')"
              />
            </div>
          </th>
          <th scope="col" class="text-left">
            <div class="flex items-center">
              Sending to PKB
              <BaseFilterIcon :active="filterByPkbOut" @toggle="filterByPkbOut = !filterByPkbOut" />
            </div>
          </th>
          <th scope="col" class="text-left">
            <div class="flex items-center gap-1">
              Last Received
              <BaseSortIcon
                :active="sortBy === 'last_message_received_at'"
                :asc="isAscending['last_message_received_at']"
                @toggle="toggleSort('last_message_received_at')"
              />
              <BaseFilterIcon
                :active="filterByLastMessageOver48"
                @toggle="filterByLastMessageOver48 = !filterByLastMessageOver48"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody v-if="!facilities" class="divide-y divide-gray-300 bg-white">
        <tr v-for="n in 20" :key="n">
          <td><BaseSkeleText class="h-6 w-12" /></td>
          <td><BaseSkeleText class="h-6 w-64" /></td>
          <td><BaseSkeleText class="h-6 w-12" /></td>
          <td><BaseSkeleText class="h-6 w-12" /></td>
          <td><BaseSkeleText class="h-6 w-12" /></td>
          <td><BaseSkeleText class="h-6 w-32" /></td>
        </tr>
      </tbody>
      <tbody v-else class="divide-y divide-gray-300 bg-white">
        <tr
          v-for="facility in filteredFacilities"
          :key="facility.id"
          class="cursor-pointer hover:bg-gray-50"
          @click="$emit('select', facility.id)"
        >
          <td class="font-medium">{{ facility.id }}</td>
          <td class="hidden max-w-sm truncate lg:table-cell">{{ facility.description }}</td>
          <td>{{ facility.statistics.totalPatients }}</td>
          <td>
            <div class="flex items-center">
              <IconCircle
                class="inline"
                :class="
                  facility.statistics.patientsReceivingMessageError &&
                  facility.statistics.patientsReceivingMessageError > 0
                    ? 'text-red-700'
                    : 'text-green-600'
                "
              />
              <p>{{ facility.statistics.patientsReceivingMessageError }}</p>
            </div>
          </td>
          <td>
            <div class="flex items-center">
              <IconCircle class="inline" :class="facility.dataFlow.pkbOut ? 'text-green-600' : 'text-red-700'" />
              <p>{{ facility.dataFlow.pkbOut ? "Yes" : "No" }}</p>
            </div>
          </td>
          <td>
            <div class="flex items-center gap-2">
              <div>
                {{ facility.lastMessageReceivedAt ? formatDate(facility.lastMessageReceivedAt, false) : "> Year Ago" }}
              </div>
              <IconExclamationTriangle
                v-if="facilityLastMessageOver48(facility)"
                v-tooltip="'No files received in over 48 hours'"
                class="inline h-6 w-6 text-yellow-600"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </BaseTable>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "@nuxtjs/composition-api";
import { FacilityDetailsSchema, FacilitySorterEnum, OrderBy } from "@ukkidney/ukrdc-axios-ts";

import BaseFilterIcon from "~/components/base/BaseFilterIcon.vue";
import BaseSkeleText from "~/components/base/BaseSkeleText.vue";
import BaseSortIcon from "~/components/base/BaseSortIcon.vue";
import BaseTable from "~/components/base/BaseTable.vue";
import IconExclamationTriangle from "~/components/icons/hero/24/outline/IconExclamationTriangle.vue";
import IconCircle from "~/components/icons/IconCircle.vue";
import SearchBar from "~/components/SearchBar.vue";
import useApi from "~/composables/useApi";
import { formatDate } from "~/helpers/dateUtils";
import { facilityLastMessageOver48 } from "~/helpers/facilityUtils";

interface IsAscending {
  [key: string]: boolean;
}

export default defineComponent({
  components: {
    IconCircle,
    BaseTable,
    BaseSortIcon,
    BaseFilterIcon,
    IconExclamationTriangle,
    SearchBar,
    BaseSkeleText,
  },
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
    const { facilitiesApi } = useApi();

    // Facility list and filters

    const facilities = ref<FacilityDetailsSchema[]>();
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
              option.description?.toLowerCase().includes(searchboxString.value.toLowerCase()),
          )
          // Filter by additional filters, such as PkbOut
          .filter((option) => (filterByPkbOut.value ? option.dataFlow.pkbOut : true))
          // Filter by last message over 48 hours
          .filter((option) => (filterByLastMessageOver48.value ? facilityLastMessageOver48(option) : true))
      );
    });

    // Sorting

    const sortBy = ref<FacilitySorterEnum>();

    // Set initial order for id sorting. Other columns left as default
    const isAscending = ref<IsAscending>({
      id: true,
    });

    function fetchTable() {
      const currentisAscending: null | boolean = isAscending.value[sortBy.value || "default"] || null;
      const currentOrderBy: OrderBy = currentisAscending ? "asc" : "desc";

      facilitiesApi
        .getFacilityList({
          sortBy: sortBy.value,
          orderBy: currentOrderBy,
          includeInactive: props.includeInactive,
          includeEmpty: props.includeEmpty,
        })
        .then((response) => {
          facilities.value = response.data;
        });
    }

    function toggleSort(key: FacilitySorterEnum) {
      // Only reverse order if we're sorting by this key already
      if (sortBy.value === key) {
        // !null is true, so this should work always
        isAscending.value[key] = !isAscending.value[key];
      }
      sortBy.value = key;
      fetchTable();
    }

    onMounted(() => {
      fetchTable();
    });

    watch(
      () => [props.includeInactive, props.includeEmpty],
      () => {
        fetchTable();
      },
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

<style scoped lang="postcss">
th {
  @apply px-4 py-3;
}
td {
  @apply whitespace-nowrap px-4 py-4;
}
</style>
