<template>
  <GenericCard>
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900 capitalize">
        {{ record.givenname.toLowerCase() }}
        {{ record.surname.toLowerCase() }}
      </h3>
      <p v-if="label" class="mt-1 max-w-2xl text-sm text-gray-500">
        {{ label }}
      </p>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <dl class="sm:divide-y sm:divide-gray-200">
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Local ID</dt>
          <dd
            class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 align-middle"
          >
            <div :class="highlight.includes('localid') ? highlightClasses : []">
              {{ realLocalID.localid }}
            </div>
            <div>
              <span
                :class="
                  highlight.includes('sendingFacility') ? highlightClasses : []
                "
                >{{
                  `${
                    realLocalID.sendingFacility
                      ? realLocalID.sendingFacility
                      : record.localidType
                  }`
                }}</span
              >
              <span
                :class="
                  highlight.includes('sendingExtract') ? highlightClasses : []
                "
                >{{
                  `${
                    realLocalID.sendingExtract
                      ? 'via ' + realLocalID.sendingExtract
                      : ''
                  }`
                }}</span
              >
            </div>
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Date of Birth</dt>
          <dd
            class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"
            :class="highlight.includes('dateOfBirth') ? highlightClasses : []"
          >
            {{ formatDate(record.dateOfBirth, (t = false)) }}
          </dd>
        </div>
        <div
          v-if="record.dateOfDeath || full"
          class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
        >
          <dt class="text-sm font-medium text-gray-500">Date of Death</dt>
          <dd
            class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"
            :class="highlight.includes('dateOfDeath') ? highlightClasses : []"
          >
            {{
              record.dateOfDeath
                ? formatDate(record.dateOfDeath, (t = false))
                : 'N/A'
            }}
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Assigned Gender</dt>
          <dd
            class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"
            :class="highlight.includes('gender') ? highlightClasses : []"
          >
            {{ formatGender(record.gender) }}
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">N/A</dd>
        </div>
      </dl>
    </div>
  </GenericCard>
</template>

<script lang="ts">
import Vue from 'vue'

import { Person } from '@/interfaces/persons'

import dateUtilsMixin from '@/mixins/dateutils'
import codeUtilsMixin from '@/mixins/coddeutils'

interface realLocalId {
  localid: string
  sendingExtract?: string
  sendingFacility?: string
}

export default Vue.extend({
  mixins: [dateUtilsMixin, codeUtilsMixin],

  props: {
    record: {
      type: Object as () => Person,
      required: true,
    },
    label: {
      type: String,
      required: false,
      default: null,
    },
    full: {
      type: Boolean,
      required: false,
      default: false,
    },
    highlight: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data() {
    return {
      highlightClasses: [
        'bg-red-100',
        'text-red-800',
        'font-medium',
        'rounded-md',
        'pl-2',
        '-ml-2',
        'pr-2',
        'mr-2',
      ],
    }
  },

  computed: {
    realLocalID(): realLocalId {
      if (this.record.localidType !== 'CLPID') {
        return {
          localid: this.record.localid,
        }
      }
      for (const xref of this.record.xrefEntries) {
        if (xref.pid === this.record.localid) {
          return {
            localid: xref.localid,
            sendingExtract: xref.sendingExtract,
            sendingFacility: xref.sendingFacility,
          }
        }
      }
      return {
        localid: this.record.localid,
      }
    },
  },
})
</script>
