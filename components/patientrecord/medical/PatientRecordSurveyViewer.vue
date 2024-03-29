<template>
  <BaseModal ref="surveyViewerModal">
    <div v-if="availableToOpen">
      <div class="sm:rounded-lg">
        <div class="mb-4">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Survey Information</h3>
          <p class="mt-1 max-w-2xl text-gray-500">
            {{ survey.id }}
          </p>
        </div>

        <div class="mb-6 border-t border-gray-200">
          <BaseCardDescriptionList>
            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt>Entered On</dt>
              <dd class="sm:col-span-2">
                {{ formatDate(survey.surveytime, false) }}
              </dd>
            </div>
            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt>Facility Code</dt>
              <dd class="sm:col-span-2">
                {{ survey.enteredatcode }}
              </dd>
            </div>
            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt>Entered By</dt>
              <dd class="sm:col-span-2">
                {{ survey.enteredbycode }}
              </dd>
            </div>
            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt>Survey Type Code</dt>
              <dd class="sm:col-span-2">
                {{ survey.surveytypecode }}
              </dd>
            </div>
          </BaseCardDescriptionList>
        </div>
      </div>

      <div v-for="(questions, group) in groupedQuestions" :key="group">
        <div class="mb-6 sm:rounded-lg">
          <h3 class="mb-4 text-lg font-medium leading-6 text-gray-900">
            {{ group !== "null" ? group : "Ungrouped" }}
          </h3>
          <div class="border-t border-gray-200">
            <BaseCardDescriptionList>
              <div v-for="question in questions" :key="question.id" class="flex items-center py-4">
                <div class="mr-4 font-medium text-gray-900">
                  {{ question.questiontypecode }}
                </div>
                <div>
                  <dt class="mb-1 font-medium text-gray-500">
                    {{ question.questionType ? question.questionType : `Question Code ${question.questiontypecode}` }}
                  </dt>
                  <dd class="mt-1 text-gray-900 sm:col-span-2 sm:mt-0">
                    {{ question.responseText ? question.responseText : `Response Code ${question.response}` }}
                  </dd>
                </div>
              </div>
            </BaseCardDescriptionList>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "@nuxtjs/composition-api";
import { SurveyQuestionSchema, SurveySchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCardDescriptionList from "~/components/base/BaseCardDescriptionList.vue";
import BaseModal from "~/components/base/BaseModal.vue";
import { formatDate } from "~/helpers/dateUtils";
import { ModalInterface } from "~/interfaces/modal";

interface GroupedQuestions {
  [key: string]: SurveyQuestionSchema[];
}

export default defineComponent({
  components: {
    BaseCardDescriptionList,
    BaseModal,
  },
  setup() {
    const survey = ref({} as SurveySchema);
    const availableToOpen = computed(() => {
      return !(Object.keys(survey.value).length === 0);
    });
    const groupedQuestions = computed(() => {
      if (!survey.value.questions) {
        return {};
      }
      const groups = {} as GroupedQuestions;
      for (const question of survey.value.questions) {
        if (question.questionGroup && !(question.questionGroup in groups)) {
          groups[question.questionGroup] = [];
        }
        groups[question.questionGroup || "Ungrouped"].push(question);
      }
      return groups;
    });

    const surveyViewerModal = ref<ModalInterface>();
    function hide(): void {
      surveyViewerModal.value?.hide();
    }
    function toggle(): void {
      surveyViewerModal.value?.toggle();
    }
    function show(surveyToShow: SurveySchema): void {
      survey.value = surveyToShow;
      surveyViewerModal.value?.show();
    }

    return {
      survey,
      availableToOpen,
      groupedQuestions,
      surveyViewerModal,
      hide,
      toggle,
      show,
      formatDate,
    };
  },
});
</script>

<style scoped>
pre {
  counter-reset: line;
}
code {
  counter-increment: line;
  display: block;
}
code:before {
  content: counter(line);
  user-select: none;
  -webkit-user-select: none;
  display: inline-block;
  width: 6ex;
  border-width: 0 1px 0 0;
  margin-right: 4px;
}
</style>
