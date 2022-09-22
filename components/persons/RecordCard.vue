<template>
  <GenericCard class="border-2 border-red-500">
    <div class="flex h-24 flex-col justify-center px-4 sm:px-6">
      <span>
        <TextNameH2 :forename="record.givenname" :surname="record.surname" :highlight="highlight" />
      </span>

      <p class="mt-1 max-w-2xl text-gray-500">
        {{ label ? label : `Person Record ${record.id}` }}
      </p>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <GenericCardDl>
        <GenericCardDi>
          <GenericCardDt>Local ID</GenericCardDt>
          <GenericCardDd :class="highlight.includes('localid') ? highlightClasses : []" class="sensitive">
            {{ realLocalID.localid }}
          </GenericCardDd>
        </GenericCardDi>
        <GenericCardDi>
          <GenericCardDt>Sender</GenericCardDt>
          <GenericCardDd>
            <span :class="highlight.includes('sendingFacility') ? highlightClasses : []">{{
              `${realLocalID.sendingFacility ? realLocalID.sendingFacility : record.localidType}`
            }}</span>
            <span :class="highlight.includes('sendingExtract') ? highlightClasses : []">{{
              `${realLocalID.sendingExtract ? "via " + realLocalID.sendingExtract : ""}`
            }}</span>
          </GenericCardDd>
        </GenericCardDi>
        <GenericCardDi>
          <GenericCardDt>Date of Birth</GenericCardDt>
          <dd
            class="sensitive mt-1 text-gray-900 sm:col-span-2 sm:mt-0"
            :class="highlight.includes('dateOfBirth') ? highlightClasses : []"
          >
            {{ formatDate(record.dateOfBirth, false) }}
          </dd>
        </GenericCardDi>
        <GenericCardDi>
          <GenericCardDt>Assigned Gender</GenericCardDt>
          <dd
            class="sensitive mt-1 text-gray-900 sm:col-span-2 sm:mt-0"
            :class="highlight.includes('gender') ? highlightClasses : []"
          >
            {{ formatGender(record.gender) }}
          </dd>
        </GenericCardDi>
        <GenericCardDi>
          <GenericCardDt>Date of Death</GenericCardDt>
          <dd
            class="sensitive mt-1 text-gray-900 sm:col-span-2 sm:mt-0"
            :class="highlight.includes('dateOfDeath') ? highlightClasses : []"
          >
            {{ record.dateOfDeath ? formatDate(record.dateOfDeath, false) : "N/A" }}
          </dd>
        </GenericCardDi>
      </GenericCardDl>
    </div>
  </GenericCard>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import { PersonSchema } from "@ukkidney/ukrdc-axios-ts";
import { formatDate } from "@/helpers/utils/dateUtils";
import { formatGender } from "@/helpers/utils/codeUtils";

interface realLocalId {
  localid: string;
  sendingExtract?: string;
  sendingFacility?: string;
}

export default defineComponent({
  props: {
    record: {
      type: Object as () => PersonSchema,
      required: true,
    },
    label: {
      type: String,
      required: false,
      default: null,
    },
    highlight: {
      type: Array as () => string[],
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

    const realLocalID = computed<realLocalId>(() => {
      if (props.record.localidType !== "CLPID") {
        return {
          localid: props.record.localid,
        };
      }
      for (const xref of props.record.xrefEntries) {
        if (xref.pid === props.record.localid) {
          return {
            localid: xref.localid,
            sendingExtract: xref.sendingExtract,
            sendingFacility: xref.sendingFacility,
          };
        }
      }
      return {
        localid: props.record.localid,
      };
    });

    return { formatDate, formatGender, highlightClasses, realLocalID };
  },
});
</script>
