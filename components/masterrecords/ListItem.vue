<template>
  <li>
    <a href="#" class="block hover:bg-gray-50">
      <div class="flex items-center px-4 py-4 sm:px-6">
        <div class="min-w-0 flex-1 flex items-center">
          <div
            class="min-w-0 px-4 grid grid-cols-2 lg:grid-cols-3 md:gap-4 w-full"
          >
            <!-- Name, DoB, gender -->
            <div>
              <p
                class="text-sm font-medium text-indigo-600 capitalize truncate"
              >
                {{ item.givenname.toLowerCase() }}
                {{ item.surname.toLowerCase() }}
              </p>
              <p class="mt-2 flex items-center text-sm text-gray-500">
                <span class="truncate"
                  >{{ formatDate(item.dateOfBirth, (t = false)) }}
                  <b>{{ genderChar }}</b></span
                >
              </p>
            </div>
            <!-- National ID -->
            <div class="text-right sm:text-left">
              <p class="text-sm text-gray-900">
                {{ item.nationalid.trim() }}
              </p>
              <span
                class="inline-flex mt-2 items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="TagClass(item.nationalidType)"
              >
                {{ item.nationalidType.trim() }}
              </span>
            </div>
            <!-- Details (large breakpoint only) -->
            <div class="hidden lg:block">
              <p class="text-sm text-gray-500">Last updated</p>
              <p class="text-sm text-gray-500">
                {{ formatDate(item.lastUpdated) }}
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
    </a>
  </li>
</template>

<script lang="ts">
import Vue from 'vue'

import { MasterRecord } from '@/interfaces/masterrecords'
import dateUtilsMixin from '@/mixins/dateutils'

export default Vue.extend({
  mixins: [dateUtilsMixin],
  props: {
    item: {
      type: Object as () => MasterRecord,
      required: true,
    },
  },
  computed: {
    genderChar(): string {
      if (this.item.gender === '1') {
        return '♂'
      } else if (this.item.gender === '2') {
        return '♀'
      } else {
        return ''
      }
    },
  },
  methods: {
    TagClass(nationalidType: string): string[] {
      if (nationalidType.trim() === 'UKRDC') {
        return ['bg-red-100', 'text-red-800']
      } else if (nationalidType.trim() === 'NHS') {
        return ['bg-blue-100', 'text-blue-800']
      } else if (nationalidType.trim() === 'CHI') {
        return ['bg-purple-100', 'text-purple-800']
      } else if (nationalidType.trim() === 'HSC') {
        return ['bg-green-100', 'text-green-800']
      } else {
        return ['bg-gray-100', 'text-gray-800']
      }
    },
  },
})
</script>
