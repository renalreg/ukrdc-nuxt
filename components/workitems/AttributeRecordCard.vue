<template>
  <GenericCard class="border-2 border-green-500">
    <div class="px-4 sm:px-6 h-24 flex flex-col justify-center">
      <div class="text-gray-500" :class="highlight.includes('givenname') ? highlightClasses : []">
        {{ record.givenname ? formatAttributeValue(record.givenname) : 'Given Name not specified' }}
      </div>
      <div class="text-gray-500 mt-1" :class="highlight.includes('surname') ? highlightClasses : []">
        {{ record.surname ? formatAttributeValue(record.surname) : 'Surname not specified' }}
      </div>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <GenericCardDl>
        <GenericCardDi>
          <GenericCardDt>Local ID</GenericCardDt>
          <GenericCardDd :class="highlight.includes('localid') ? highlightClasses : []">
            {{ record.localid ? formatAttributeValue(record.localid) : 'Not specified' }}
          </GenericCardDd>
        </GenericCardDi>
        <GenericCardDi>
          <GenericCardDt>Sender</GenericCardDt>
          <GenericCardDd>
            <span :class="highlight.includes('sendingFacility') ? highlightClasses : []">{{
              record.sendingFacility ? record.sendingFacility : ''
            }}</span>
            <span :class="highlight.includes('sendingExtract') ? highlightClasses : []">{{
              record.sendingExtract ? 'via ' + record.sendingExtract : 'Not specified'
            }}</span>
          </GenericCardDd>
        </GenericCardDi>
        <GenericCardDi>
          <GenericCardDt>Date of Birth</GenericCardDt>
          <GenericCardDd :class="highlight.includes('dateOfBirth') ? highlightClasses : []">
            {{ formattedDoB }}
          </GenericCardDd>
        </GenericCardDi>
        <GenericCardDi>
          <GenericCardDt>Assigned Gender</GenericCardDt>
          <GenericCardDd :class="highlight.includes('gender') ? highlightClasses : []">
            {{ formattedGender }}
          </GenericCardDd>
        </GenericCardDi>
        <GenericCardDi>
          <GenericCardDt>Date of Death</GenericCardDt>
          <GenericCardDd :class="highlight.includes('dateOfDeath') ? highlightClasses : []">
            {{ formattedDoD }}
          </GenericCardDd>
        </GenericCardDi>
      </GenericCardDl>
    </div>
  </GenericCard>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

import { formatDate } from '@/helpers/utils/dateUtils'
import { formatGender } from '@/helpers/utils/codeUtils'
import { formatAttributeValue } from '@/helpers/utils/workItemUtils'

import { WorkItemAttributes } from '~/interfaces/workitem'

export default defineComponent({
  props: {
    record: {
      type: Object as () => WorkItemAttributes,
      required: true,
    },
    label: {
      type: String,
      required: false,
      default: null,
    },
    highlight: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  setup(props) {
    const highlightClasses = [
      'bg-red-100',
      'text-red-800',
      'font-medium',
      'rounded-md',
      'pl-2',
      '-ml-2',
      'pr-2',
      'mr-2',
    ]

    const formattedDoB = computed(() => {
      return props.record.dateOfBirth
        ? `
        ${formatDate(props.record.dateOfBirth.split(':')[0], false)} →
        ${formatDate(props.record.dateOfBirth.split(':')[1], false)}`
        : 'Not specified'
    })

    const formattedDoD = computed(() => {
      return props.record.dateOfDeath
        ? `
        ${formatDate(props.record.dateOfDeath.split(':')[0], false)} →
        ${formatDate(props.record.dateOfDeath.split(':')[1], false)}`
        : 'Not specified'
    })

    const formattedGender = computed(() => {
      return props.record.gender
        ? `
        ${formatGender(props.record.gender.split(':')[0])} →
        ${formatGender(props.record.gender.split(':')[1])}`
        : 'Not specified'
    })

    return {
      formattedDoB,
      formattedDoD,
      formattedGender,
      formatDate,
      formatGender,
      formatAttributeValue,
      highlightClasses,
    }
  },
})
</script>

<style scoped></style>
