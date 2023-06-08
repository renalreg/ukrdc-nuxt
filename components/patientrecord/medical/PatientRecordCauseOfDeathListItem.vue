<template>
  <li>
    <div class="grid grid-cols-2 gap-4 px-4 py-4 sm:px-6" :class="[{ 'lg:grid-cols-4': !small }]">
      <!-- Code and description-->
      <div class="col-span-2" :class="[{ 'lg:col-span-4': !small }]">
        <CodeTitle
          v-if="item.diagnosisCodeStd && item.diagnosisCode"
          :coding-standard="item.diagnosisCodeStd"
          :code="item.diagnosisCode"
        />
        <h5 v-else>Diagnosis Description</h5>
        <p class="sensitive mt-2" :class="[{ 'lg:truncate': !small }]">
          {{ item.description || item.diagnosisDesc || "Unknown" }}
        </p>
      </div>
      <!-- Entered On-->
      <div>
        <h5 class="truncate">Entered On</h5>
        <p class="sensitive mt-2 truncate">
          {{ item.enteredon ? formatDate(item.enteredon, false) : "Unknown" }}
        </p>
      </div>
      <!-- Onset Time-->
      <div>
        <h5 class="truncate">Diagnosis Type</h5>
        <p class="sensitive mt-2 truncate capitalize">
          {{ item.diagnosistype || "Unknown" }}
        </p>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { ExtendedCauseOfDeathSchema } from "@ukkidney/ukrdc-axios-ts";

import CodeTitle from "~/components/CodeTitle.vue";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    CodeTitle,
  },
  props: {
    item: {
      type: Object as () => ExtendedCauseOfDeathSchema,
      required: true,
    },
    small: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup() {
    return { formatDate };
  },
});
</script>
