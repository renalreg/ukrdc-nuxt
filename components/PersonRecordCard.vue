<template>
  <div class="borderless-card border-2 border-red-500">
    <div class="flex h-24 flex-col justify-center px-4 sm:px-6">
      <span>
        <span>
          <h2 class="sensitive inline capitalize" :class="highlight.includes('givenname') ? highlightClasses : []">
            {{ record.givenname?.toLowerCase() }}
          </h2>
          <h2 class="sensitive inline capitalize italic" :class="highlight.includes('surname') ? highlightClasses : []">
            {{ record.surname?.toLowerCase() }}
          </h2>
        </span>
      </span>

      <p class="mt-1 max-w-2xl text-gray-500">
        {{ label ? label : `Person Record ${record.id}` }}
      </p>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <BaseCardDescriptionList>
        <BaseCardDescriptionItem>
          <dt>Local ID</dt>
          <dd :class="highlight.includes('localid') ? highlightClasses : []" class="sensitive">
            {{ realLocalID.localid }}
          </dd>
        </BaseCardDescriptionItem>
        <BaseCardDescriptionItem>
          <dt>Sender</dt>
          <dd>
            <span :class="highlight.includes('sendingFacility') ? highlightClasses : []">{{
              `${realLocalID.sendingFacility ? realLocalID.sendingFacility : record.localidType}`
            }}</span>
            <span :class="highlight.includes('sendingExtract') ? highlightClasses : []">{{
              `${realLocalID.sendingExtract ? "via " + realLocalID.sendingExtract : ""}`
            }}</span>
          </dd>
        </BaseCardDescriptionItem>
        <BaseCardDescriptionItem>
          <dt>Date of Birth</dt>
          <dd
            class="sensitive mt-1 text-gray-900 sm:col-span-2 sm:mt-0"
            :class="highlight.includes('dateOfBirth') ? highlightClasses : []"
          >
            {{ formatDate(record.dateOfBirth, false) }}
          </dd>
        </BaseCardDescriptionItem>
        <BaseCardDescriptionItem>
          <dt>Assigned Gender</dt>
          <dd
            class="sensitive mt-1 text-gray-900 sm:col-span-2 sm:mt-0"
            :class="highlight.includes('gender') ? highlightClasses : []"
          >
            {{ formatGender(record.gender) }}
          </dd>
        </BaseCardDescriptionItem>
        <BaseCardDescriptionItem>
          <dt>Date of Death</dt>
          <dd
            class="sensitive mt-1 text-gray-900 sm:col-span-2 sm:mt-0"
            :class="highlight.includes('dateOfDeath') ? highlightClasses : []"
          >
            {{ record.dateOfDeath ? formatDate(record.dateOfDeath, false) : "N/A" }}
          </dd>
        </BaseCardDescriptionItem>
      </BaseCardDescriptionList>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import { PersonSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardDescriptionItem from "~/components/base/BaseCardDescriptionItem.vue";
import BaseCardDescriptionList from "~/components/base/BaseCardDescriptionList.vue";
import { formatGender } from "~/helpers/codeUtils";
import { formatDate } from "~/helpers/dateUtils";

interface realLocalId {
  localid: string;
  sendingExtract?: string;
  sendingFacility?: string;
}

export default defineComponent({
  components: {
    BaseCard,
    BaseCardDescriptionList,
    BaseCardDescriptionItem,
  },
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
