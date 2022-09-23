<template>
  <div class="sensitive">
    <patientrecordsSurveyViewer ref="surveyViewerModal" class="md:w-large w-full" />

    <BaseLoadingContainer :loading="!surveys">
      <p v-if="surveys && surveys.length <= 0" class="text-center">No surveys on record</p>
      <div class="mt-3 grid grid-cols-1 justify-center gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
        <genericCardMini
          v-for="item in surveys"
          :key="item.id"
          class="col-span-1 flex items-center justify-between truncate"
        >
          <div class="flex-1 truncate px-4 py-2">
            <p class="mb-2 font-medium text-gray-900 hover:text-gray-600">
              {{ formatDate(item.surveytime, false) }}
            </p>
            <p class="text-gray-500">Type: {{ item.surveytypecode }}</p>
            <p class="text-gray-500">
              Entered at
              {{ item.enteredatcode ? item.enteredatcode : "unknown location" }}
              by {{ item.enteredbycode ? item.enteredbycode : "unknown person" }}
            </p>

            <div class="mt-2">
              <span
                class="inline-block flex-shrink-0 rounded-sm bg-indigo-100 px-2 py-0.5 text-sm font-medium text-indigo-800"
                >{{ item.questions.length }} questions</span
              >
              <genericButtonMini class="float-right" @click="surveyViewerModal?.show(item)">
                View survey
              </genericButtonMini>
            </div>
          </div>
        </genericCardMini>
      </div>
    </BaseLoadingContainer>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { PatientRecordSchema, SurveySchema } from "@ukkidney/ukrdc-axios-ts";
import BaseLoadingContainer from "~/components/base/BaseLoadingContainer.vue";

import { formatDate } from "~/helpers/dateUtils";

import useApi from "~/composables/useApi";
import { surveyViewerModalInterface } from "~/interfaces/modal";

export default defineComponent({
  components: {
    BaseLoadingContainer,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },

  setup(props) {
    const { patientRecordsApi } = useApi();

    // Element refs
    const surveyViewerModal = ref<surveyViewerModalInterface>();

    // Data refs
    const surveys = ref<SurveySchema[]>();

    // Data fetching
    onMounted(() => {
      patientRecordsApi
        .getPatientSurveys({
          pid: props.record.pid,
        })
        .then((response) => {
          surveys.value = response.data;
        });
    });

    return {
      surveys,
      formatDate,
      surveyViewerModal,
    };
  },
});
</script>
