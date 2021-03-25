<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
    <div class="mb-6">
      <div class="sm:hidden">
        <label for="tabs" class="sr-only">Select a tab</label>
        <select
          id="tabs"
          name="tabs"
          class="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
          @change="setTab($event.target.value)"
        >
          <option v-for="tab in tabs" :key="tab">{{ tab }}</option>
        </select>
      </div>
      <div class="hidden sm:block">
        <nav class="flex space-x-2" aria-label="Tabs">
          <!-- Current: "bg-indigo-100 text-indigo-700", Default: "text-gray-500 hover:text-gray-700" -->
          <button
            v-for="tab in tabs"
            :key="tab"
            role="tab"
            class="px-3 py-2 font-medium text-sm rounded-md"
            :class="
              currentTab === tab
                ? 'bg-indigo-100 text-indigo-700 '
                : 'text-gray-500 hover:text-gray-700'
            "
            :aria-selected="currentTab === tab"
            @click="setTab(tab)"
          >
            {{ tab }}
          </button>
        </nav>
      </div>
    </div>

    <div v-if="currentTab === 'Overview'">
      <patientrecordsRecordCard
        v-if="!isEmptyObject(record)"
        :record="record"
      />
      <div v-if="!isEmptyObject(record)" class="mt-4">
        <h2 class="text-gray-500 text-xs font-medium uppercase tracking-wide">
          Patient Numbers
        </h2>
        <ul
          class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <li
            v-for="item in record.patient.numbers"
            :key="item.numbertype + item.organization + item.patientid"
            class="col-span-1 flex shadow-sm rounded-md"
          >
            <div
              class="flex-shrink-0 flex items-center justify-center w-16 bg-indigo-600 text-white text-sm font-medium rounded-l-md"
            >
              {{ item.numbertype }}
            </div>
            <div
              class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate"
            >
              <div class="flex-1 px-4 py-2 text-sm truncate">
                <p class="text-gray-900 font-medium hover:text-gray-600">
                  {{ item.patientid }}
                </p>
                <p class="text-gray-500">{{ item.organization }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div
        v-if="
          !isEmptyObject(record) &&
          record.patient.addresses &&
          record.patient.addresses.length > 0
        "
        class="mt-4"
      >
        <h2 class="text-gray-500 text-xs font-medium uppercase tracking-wide">
          Addresses
        </h2>

        <ul
          class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <li
            v-for="item in record.patient.addresses"
            :key="item.street"
            class="col-span-1 flex shadow-sm rounded-md"
          >
            <div
              class="flex-1 flex items-center justify-between border border-gray-200 bg-white rounded-md truncate"
            >
              <div class="flex-1 px-4 py-2 text-sm truncate">
                <p class="text-gray-900 font-medium hover:text-gray-600">
                  {{ item.street }}
                </p>
                <p v-if="item.town" class="text-gray-500">{{ item.town }}</p>
                <p v-if="item.county" class="text-gray-500">
                  {{ item.county }}
                </p>
                <p v-if="item.postcode" class="text-gray-500">
                  {{ item.postcode }}
                </p>
                <p v-if="item.countryDescription" class="text-gray-500">
                  {{ item.countryDescription }}
                </p>
                <p v-if="item.fromTime" class="text-gray-500">
                  Since {{ formatDate(item.fromTime, (t = false)) }}
                </p>
                <span
                  v-if="!item.toTime"
                  class="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-sm mt-2"
                  >Active</span
                >
                <span
                  v-else
                  class="flex-shrink-0 inline-block px-2 py-0.5 text-red-800 text-xs font-medium bg-red-100 rounded-sm mt-2"
                  >Inactive since
                  {{ formatDate(item.toTime, (t = false)) }}</span
                >
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div
        v-if="
          !isEmptyObject(record) &&
          record.programMemberships &&
          record.programMemberships.length > 0
        "
        class="mt-4"
      >
        <h2 class="text-gray-500 text-xs font-medium uppercase tracking-wide">
          Program Memberships
        </h2>

        <ul
          class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <li
            v-for="item in record.programMemberships"
            :key="item.programName"
            class="col-span-1 flex shadow-sm rounded-md"
          >
            <div
              class="flex-1 flex items-center justify-between border border-gray-200 bg-white rounded-md truncate"
            >
              <div class="flex-1 px-4 py-2 text-sm truncate">
                <p class="text-gray-900 font-medium hover:text-gray-600">
                  {{ item.programName }}
                </p>
                <p v-if="item.fromTime" class="text-gray-500">
                  Since {{ formatDate(item.fromTime, (t = false)) }}
                </p>
                <span
                  v-if="!item.toTime"
                  class="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-sm mt-2"
                  >Active</span
                >
                <span
                  v-else
                  class="flex-shrink-0 inline-block px-2 py-0.5 text-red-800 text-xs font-medium bg-red-100 rounded-sm mt-2"
                  >Inactive since
                  {{ formatDate(item.toTime, (t = false)) }}</span
                >
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div v-else>
      <patientrecordsRecordCard
        v-if="!isEmptyObject(record)"
        :record="record"
        :header-only="true"
      />
      <div v-if="currentTab === 'Medications'">
        <PatientrecordsSectionsMedications
          :api-path="record.links.medications"
        />
      </div>
      <div v-if="currentTab === 'Lab Orders'">WIP lab orders component</div>
      <div v-if="currentTab === 'Observations'">WIP observations component</div>
      <div v-if="currentTab === 'Surveys'">WIP surveys component</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import dateUtilsMixin from '@/mixins/dateutils'
import codeUtilsMixin from '@/mixins/coddeutils'
import objectUtilsMixin from '@/mixins/objectutils'
import { PatientRecord } from '~/interfaces/patientrecord'

export default Vue.extend({
  mixins: [dateUtilsMixin, codeUtilsMixin, objectUtilsMixin],

  data() {
    return {
      record: {} as PatientRecord,
      tabs: [
        'Overview',
        'Medications',
        'Lab Orders',
        'Observations',
        'Surveys',
      ],
    }
  },
  async fetch() {
    // Get the main record data
    const path = `/api/patientrecords/${this.$route.params.pid}`
    const res: PatientRecord = await this.$axios.$get(path)
    this.record = res
  },
  head() {
    return {
      title: 'Patient Record',
    }
  },
  computed: {
    currentTab(): string {
      return this.$route.hash.slice(1) || 'Overview'
    },
  },
  methods: {
    setTab(newTab: string): void {
      this.$router.push({
        hash: newTab,
      })
    },
  },
})
</script>
