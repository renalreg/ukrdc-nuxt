<template>
  <GenericCard class="border-2 border-indigo-500">
    <div class="flex h-24 flex-col justify-center px-4 sm:px-6">
      <TextNameH2
        :class="highlight.includes('name') ? highlightClasses : []"
        :forename="record.givenname"
        :surname="record.surname"
        :highlight="highlight"
      />
      <p class="mt-1 max-w-2xl text-gray-500">
        {{ label ? label : `Master Record ${record.id}` }}
      </p>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <GenericCardDl>
        <GenericCardDi>
          <GenericCardDt>National ID</GenericCardDt>
          <GenericCardDd class="sensitive">
            {{ record.nationalid }}
          </GenericCardDd>
        </GenericCardDi>
        <GenericCardDi>
          <GenericCardDt>ID Type</GenericCardDt>
          <GenericCardDd class="align-middle">
            {{ record.nationalidType }}
          </GenericCardDd>
        </GenericCardDi>
        <GenericCardDi>
          <GenericCardDt>Date of Birth</GenericCardDt>
          <GenericCardDd :class="highlight.includes('dateOfBirth') ? highlightClasses : []" class="sensitive">
            {{ formatDate(record.dateOfBirth, false) }}
          </GenericCardDd>
        </GenericCardDi>
        <GenericCardDi>
          <GenericCardDt>Assigned Gender</GenericCardDt>
          <GenericCardDd :class="highlight.includes('gender') ? highlightClasses : []" class="sensitive">
            {{ record.gender ? formatGender(record.gender) : "Unknown gender" }}
          </GenericCardDd>
        </GenericCardDi>
        <GenericCardDi>
          <GenericCardDt>Last Updated</GenericCardDt>
          <GenericCardDd>
            {{ formatDate(record.lastUpdated) }}
          </GenericCardDd>
        </GenericCardDi>
      </GenericCardDl>
    </div>
  </GenericCard>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { MasterRecordSchema } from "@ukkidney/ukrdc-axios-ts";
import { formatDate } from "@/helpers/dateUtils";
import { formatGender } from "@/helpers/codeUtils";

export default defineComponent({
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
