<template>
  <li>
    <!-- Content container -->
    <div class="grid w-full min-w-0 grid-cols-3 px-4 py-4 sm:px-6 md:gap-4 lg:grid-cols-4">
      <!-- Name, DoB, gender -->
      <div>
        <span class="truncate">
          <h5 class="sensitive inline capitalize">{{ item.givenname?.toLowerCase() }}</h5>
          <h5 class="sensitive inline capitalize italic">{{ item.surname?.toLowerCase() }}</h5>
        </span>
        <p class="sensitive mt-2 flex items-center">
          {{ formatDate(item.dateOfBirth, false) }}
          <b class="ml-1"> {{ item.gender ? formatGenderCharacter(item.gender) : "Unknown gender" }}</b>
        </p>
      </div>
      <!-- Record ID (large breakpoint only if a detail column is given) -->
      <div :class="detailsValue ? 'hidden lg:block' : ''">
        <h5>Record ID</h5>
        <p class="mt-2">
          {{ item.id }}
        </p>
      </div>
      <!-- National ID -->
      <div>
        <p class="sensitive">
          {{ item.nationalid.trim() }}
        </p>
        <BadgeNationalID class="mt-2" :nationalid-type="item.nationalidType" />
      </div>
      <!-- Details, defaults to record updated time, but can be overridden by props  -->
      <div v-if="detailsValue">
        <h5>{{ detailsLabel }}</h5>
        <p class="mt-2">
          {{ detailsValue }}
        </p>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { MasterRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BadgeNationalID from "~/components/BadgeNationalID.vue";
import { formatGenderCharacter } from "~/helpers/codeUtils";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: { BadgeNationalID },
  props: {
    item: {
      type: Object as () => MasterRecordSchema,
      required: true,
    },

    // Override details data label
    // E.g. in lists of records where we want a different timestamp shown,
    // such as the multiple UKRDC ID viewer, where we show the last checked time.
    detailsLabel: {
      type: String,
      required: false,
      default: "Details",
    },
    // Override details data value, see above
    detailsValue: {
      type: String,
      required: false,
      default: null,
    },
  },

  setup() {
    function TagClass(nationalidType: string): string[] {
      if (nationalidType.trim() === "UKRDC") {
        return ["bg-red-100", "text-red-800"];
      } else if (nationalidType.trim() === "NHS") {
        return ["bg-blue-100", "text-blue-800"];
      } else if (nationalidType.trim() === "CHI") {
        return ["bg-purple-100", "text-purple-800"];
      } else if (nationalidType.trim() === "HSC") {
        return ["bg-green-100", "text-green-800"];
      } else {
        return ["bg-gray-100", "text-gray-800"];
      }
    }

    return { TagClass, formatDate, formatGenderCharacter };
  },
});
</script>
