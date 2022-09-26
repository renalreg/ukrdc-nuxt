<template>
  <BaseCard class="border-2 border-indigo-500">
    <div class="flex h-24 flex-col justify-center px-4 sm:px-6">
      <span :class="highlight.includes('name') ? highlightClasses : []">
        <h2 class="sensitive inline capitalize" :class="highlight.includes('givenname') ? highlightClasses : []">
          {{ record.givenname?.toLowerCase() }}
        </h2>
        <h2 class="sensitive inline capitalize italic" :class="highlight.includes('surname') ? highlightClasses : []">
          {{ record.surname?.toLowerCase() }}
        </h2>
      </span>
      <p class="mt-1 max-w-2xl text-gray-500">
        {{ label ? label : `Master Record ${record.id}` }}
      </p>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <BaseCardDescriptionList>
        <BaseCardDescriptionItem>
          <dt>National ID</dt>
          <dd class="sensitive">
            {{ record.nationalid }}
          </dd>
        </BaseCardDescriptionItem>
        <BaseCardDescriptionItem>
          <dt>ID Type</dt>
          <dd class="align-middle">
            {{ record.nationalidType }}
          </dd>
        </BaseCardDescriptionItem>
        <BaseCardDescriptionItem>
          <dt>Date of Birth</dt>
          <dd :class="highlight.includes('dateOfBirth') ? highlightClasses : []" class="sensitive">
            {{ formatDate(record.dateOfBirth, false) }}
          </dd>
        </BaseCardDescriptionItem>
        <BaseCardDescriptionItem>
          <dt>Assigned Gender</dt>
          <dd :class="highlight.includes('gender') ? highlightClasses : []" class="sensitive">
            {{ record.gender ? formatGender(record.gender) : "Unknown gender" }}
          </dd>
        </BaseCardDescriptionItem>
        <BaseCardDescriptionItem>
          <dt>Last Updated</dt>
          <dd>
            {{ formatDate(record.lastUpdated) }}
          </dd>
        </BaseCardDescriptionItem>
      </BaseCardDescriptionList>
    </div>
  </BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { MasterRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardDescriptionItem from "~/components/base/BaseCardDescriptionItem.vue";
import BaseCardDescriptionList from "~/components/base/BaseCardDescriptionList.vue";
import { formatGender } from "~/helpers/codeUtils";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseCardDescriptionList,
    BaseCardDescriptionItem,
  },
  props: {
    record: {
      type: Object as () => MasterRecordSchema,
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
  setup() {
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
    return { highlightClasses, formatDate, formatGender };
  },
});
</script>
