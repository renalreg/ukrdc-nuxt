<template>
  <li>
    <div class="grid w-full min-w-0 grid-cols-3 gap-2 px-4 py-4 sm:px-6 lg:grid-cols-4">
      <!-- File -->
      <div class="col-span-1 lg:col-span-2">
        <div class="truncate">
          <h5 class="truncate md:inline">
            {{ item.documentname || item.id }}
          </h5>
        </div>
        <div class="mt-2 flex">
          <span class="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
            {{ item.filetype || "text" }}
          </span>
          <p class="ml-2 flex-grow line-clamp-1">
            {{ item.filename || `${item.documentname}.txt` }}
          </p>
        </div>
      </div>
      <!-- Source  -->
      <div class="col-span-1">
        <h5>Entered By</h5>
        <p class="mt-2">
          {{ item.enteredbydesc || "Unknown author" }}
        </p>
      </div>
      <!-- Origin  -->
      <div class="col-span-1">
        <p>From {{ item.enteredatcode ? item.enteredatcode : "Unknown source" }}</p>
        <p class="mt-2">
          {{ item.documenttime ? formatDate(item.documenttime) : "Unknown date" }}
        </p>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { DocumentSummarySchema } from "@ukkidney/ukrdc-axios-ts";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  props: {
    item: {
      type: Object as () => DocumentSummarySchema,
      required: true,
    },
  },
  setup() {
    return { formatDate };
  },
});
</script>
