<template>
  <div class="borderless-card border-2 border-green-500">
    <div class="flex h-24 flex-col justify-center px-4 sm:px-6">
      <div class="sensitive text-gray-500" :class="highlight.includes('givenname') ? highlightClasses : []">
        {{ record.givenname ? formatAttributeValue(record.givenname) : "Given Name not specified" }}
      </div>
      <div class="sensitive mt-1 text-gray-500" :class="highlight.includes('surname') ? highlightClasses : []">
        {{ record.surname ? formatAttributeValue(record.surname) : "Surname not specified" }}
      </div>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <BaseCardDescriptionList>
        <BaseCardDescriptionItem>
          <dt>Local ID</dt>
          <dd :class="highlight.includes('localid') ? highlightClasses : []" class="sensitive">
            {{ record.localid ? formatAttributeValue(record.localid) : "Not specified" }}
          </dd>
        </BaseCardDescriptionItem>
        <BaseCardDescriptionItem>
          <dt>Sender</dt>
          <dd>
            <span :class="highlight.includes('sendingFacility') ? highlightClasses : []">{{
              record.sendingFacility ? record.sendingFacility : ""
            }}</span>
            <span :class="highlight.includes('sendingExtract') ? highlightClasses : []">{{
              record.sendingExtract ? "via " + record.sendingExtract : "Not specified"
            }}</span>
          </dd>
        </BaseCardDescriptionItem>
        <BaseCardDescriptionItem>
          <dt>Date of Birth</dt>
          <dd :class="highlight.includes('dateOfBirth') ? highlightClasses : []" class="sensitive">
            {{ formattedDoB }}
          </dd>
        </BaseCardDescriptionItem>
        <BaseCardDescriptionItem>
          <dt>Assigned Gender</dt>
          <dd :class="highlight.includes('gender') ? highlightClasses : []" class="sensitive">
            {{ formattedGender }}
          </dd>
        </BaseCardDescriptionItem>
        <BaseCardDescriptionItem>
          <dt>Date of Death</dt>
          <dd :class="highlight.includes('dateOfDeath') ? highlightClasses : []" class="sensitive">
            {{ formattedDoD }}
          </dd>
        </BaseCardDescriptionItem>
      </BaseCardDescriptionList>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import { WorkItemAttributes } from "@ukkidney/ukrdc-axios-ts";

import BaseCardDescriptionItem from "~/components/base/BaseCardDescriptionItem.vue";
import BaseCardDescriptionList from "~/components/base/BaseCardDescriptionList.vue";
import { formatGender } from "~/helpers/codeUtils";
import { formatDate } from "~/helpers/dateUtils";
import { formatAttributeValue } from "~/helpers/workItemUtils";

export default defineComponent({
  components: {
    BaseCardDescriptionList,
    BaseCardDescriptionItem,
  },
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
      "bg-red-100",
      "text-red-800",
      "font-medium",
      "rounded-md",
      "pl-2",
      "-ml-2",
      "pr-2",
      "mr-2",
    ];

    const formattedDoB = computed(() => {
      return props.record.dateOfBirth
        ? `
        ${formatDate(props.record.dateOfBirth.split(":")[0], false)} →
        ${formatDate(props.record.dateOfBirth.split(":")[1], false)}`
        : "Not specified";
    });

    const formattedDoD = computed(() => {
      return props.record.dateOfDeath
        ? `
        ${formatDate(props.record.dateOfDeath.split(":")[0], false)} →
        ${formatDate(props.record.dateOfDeath.split(":")[1], false)}`
        : "Not specified";
    });

    const formattedGender = computed(() => {
      return props.record.gender
        ? `
        ${formatGender(props.record.gender.split(":")[0])} →
        ${formatGender(props.record.gender.split(":")[1])}`
        : "Not specified";
    });

    return {
      formattedDoB,
      formattedDoD,
      formattedGender,
      formatDate,
      formatGender,
      formatAttributeValue,
      highlightClasses,
    };
  },
});
</script>

<style scoped></style>
