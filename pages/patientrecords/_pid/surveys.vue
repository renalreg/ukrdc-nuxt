<template>
  <div>
    <patientrecordsSurveyViewer ref="surveyViewerModal" class="md:w-large w-full" />

    <LoadingIndicator v-if="!surveys"></LoadingIndicator>
    <TextP v-if="surveys && surveys.length <= 0" class="text-center">No surveys on record</TextP>

    <div v-if="surveys" class="mt-3 grid grid-cols-1 justify-center gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
      <genericCardMini
        v-for="item in surveys"
        :key="item.id"
        class="col-span-1 flex items-center justify-between truncate"
      >
        <div class="flex-1 truncate px-4 py-2">
          <p class="mb-2 font-medium text-gray-900 hover:text-gray-600">
            {{ formatDate(item.surveytime, (t = false)) }}
          </p>
          <p class="text-gray-500">Type: {{ item.surveytypecode }}</p>
          <p class="text-gray-500">
            Entered at
            {{ item.enteredatcode ? item.enteredatcode : 'unknown location' }}
            by {{ item.enteredbycode ? item.enteredbycode : 'unknown person' }}
          </p>

          <div class="mt-2">
            <span
              class="inline-block flex-shrink-0 rounded-sm bg-indigo-100 px-2 py-0.5 text-sm font-medium text-indigo-800"
              >{{ item.questions.length }} questions</span
            >
            <genericButtonMini class="float-right" @click="$refs.surveyViewerModal.show(item)">
              View survey
            </genericButtonMini>
          </div>
        </div>
      </genericCardMini>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@nuxtjs/composition-api'

import { formatDate } from '@/helpers/utils/dateUtils'

import { Survey } from '@/interfaces/survey'
import { PatientRecord } from '@/interfaces/patientrecord'
import fetchPatientRecords from '~/helpers/fetch/fetchPatientRecords'

export default defineComponent({
  props: {
    record: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },

  setup(props) {
    const { fetchPatientRecordSurveys } = fetchPatientRecords()

    // Data refs
    const surveys = ref<Survey[]>()

    // Data fetching
    onMounted(async () => {
      surveys.value = await fetchPatientRecordSurveys(props.record)
    })

    return {
      surveys,
      formatDate,
    }
  },
})
</script>
