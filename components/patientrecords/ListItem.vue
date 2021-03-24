<template>
  <li>
    <NuxtLink
      :to="`/patientrecords/${item.pid}`"
      class="block hover:bg-gray-50"
    >
      <div class="flex items-center px-4 py-4 sm:px-6">
        <div class="min-w-0 flex-1 flex items-center">
          <div class="min-w-0 grid grid-cols-2 lg:grid-cols-3 md:gap-4 w-full">
            <!-- Name, DoB, gender -->
            <div>
              <p
                class="text-sm font-medium text-indigo-600 capitalize truncate"
              >
                {{ item.sendingfacility }}
              </p>
              <p class="mt-2 flex items-center text-sm text-gray-500">
                via {{ item.sendingextract }}
              </p>
            </div>
            <!-- National ID -->
            <div class="text-right sm:text-left">
              <p class="text-sm text-gray-500">Local ID</p>
              <p class="mt-2 text-sm text-gray-500">
                {{ item.localpatientid }}
              </p>
            </div>
            <!-- Details (large breakpoint only) -->
            <div class="hidden lg:block">
              <p class="text-sm text-gray-500">Last updated</p>
              <p class="mt-2 text-sm text-gray-500">
                {{ formatDate(item.repositoryUpdateDate) }}
              </p>
            </div>
          </div>
        </div>
        <div>
          <!-- Heroicon name: solid/chevron-right -->
          <svg
            class="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
    </NuxtLink>
  </li>
</template>

<script lang="ts">
import Vue from 'vue'

import { PatientRecordShort } from '@/interfaces/patientrecords'
import dateUtilsMixin from '@/mixins/dateutils'

export default Vue.extend({
  mixins: [dateUtilsMixin],
  props: {
    item: {
      type: Object as () => PatientRecordShort,
      required: true,
    },
  },
})
</script>
