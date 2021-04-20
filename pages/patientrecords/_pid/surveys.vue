<template>
  <div class="mt-4">
    <patientrecordsSurveyViewer
      ref="surveyViewerModal"
      class="w-full md:w-large"
    />

    <patientrecordsRecordCard :record="record" :header-only="true" />

    <div
      class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-2 justify-center"
    >
      <genericCardMini
        v-for="item in surveys"
        :key="item.id"
        class="col-span-1 flex items-center justify-between truncate"
      >
        <div class="flex-1 px-4 py-2 text-sm truncate">
          <p class="text-gray-900 font-medium hover:text-gray-600 mb-2">
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
              class="flex-shrink-0 inline-block px-2 py-0.5 text-indigo-800 text-xs font-medium bg-indigo-100 rounded-sm"
              >{{ item.questions.length }} questions</span
            >
            <genericButtonMini
              class="float-right"
              @click="
                openSurvey = item
                $refs.surveyViewerModal.show(item)
              "
            >
              View survey
            </genericButtonMini>
          </div>
        </div>
      </genericCardMini>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import dateUtilsMixin from '@/mixins/dateutils'
import codeUtilsMixin from '@/mixins/coddeutils'

import { Survey } from '@/interfaces/survey'
import { PatientRecord } from '@/interfaces/patientrecord'

export default Vue.extend({
  mixins: [dateUtilsMixin, codeUtilsMixin],

  props: {
    record: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },

  data() {
    return {
      surveys: [] as Survey[],
      openSurvey: {} as Survey,
    }
  },
  async fetch() {
    const res: Survey[] = await this.$axios.$get(this.apiPath)
    this.surveys = res
  },
  computed: {
    apiPath(): string {
      return this.record.links.surveys
    },
  },
})
</script>
