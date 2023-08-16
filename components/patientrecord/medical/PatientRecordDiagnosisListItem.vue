<template>
  <li>
    <div class="grid grid-cols-3 gap-4 px-4 py-4 sm:px-6" :class="[{ 'lg:grid-cols-5': !small }]">
      <!-- Code and description-->
      <div class="col-span-3" :class="[{ 'lg:col-span-2': !small }]">
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
      <!-- Identification Time-->
      <div>
        <h5 class="truncate">Identified On</h5>
        <p class="sensitive mt-2 truncate">
          {{ item.identificationTime ? formatDate(item.identificationTime, false) : "Unknown" }}
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
        <h5 class="truncate">Onset Time</h5>
        <p class="sensitive mt-2 truncate">
          {{ item.onsetTime ? formatDate(item.onsetTime, false) : "Unknown" }}
        </p>
      </div>
      <!-- Comments-->
      <div v-if="item.comments" class="col-span-3" :class="[{ 'lg:col-span-5': !small }]">
        <h5>Comments</h5>
        <p class="sensitive mt-2" :class="[{ 'lg:truncate': !small }]">
          {{ item.comments || "None" }}
        </p>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { ExtendedDiagnosisSchema, ExtendedRenalDiagnosisSchema } from "@ukkidney/ukrdc-axios-ts";

import CodeTitle from "~/components/CodeTitle.vue";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    CodeTitle,
  },
  props: {
    item: {
      type: Object as () => ExtendedDiagnosisSchema | ExtendedRenalDiagnosisSchema,
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
