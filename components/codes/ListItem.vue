<!--
Single item of the codes list used in the Codes page.
-->

<template>
  <li>
    <div class="grid w-full min-w-0 grid-cols-2 px-4 py-4 sm:px-6 md:gap-4 lg:grid-cols-3">
      <!-- Heading -->
      <div class="col-span-2">
        <CodesTitle :code="code.code" :coding-standard="code.codingStandard" />
        <TextP class="mt-2 truncate">
          {{ code.description || "No description found" }}
        </TextP>
      </div>
      <!-- Extra fields  -->
      <div class="col-span-1 hidden lg:block">
        <div>
          <TextL1 class="inline">Type: </TextL1><TextP class="inline">{{ code.objectType || "None" }} </TextP>
        </div>
        <div class="mt-2">
          <TextL1 class="inline">Units: </TextL1><TextP class="inline">{{ code.units || "None" }} </TextP>
        </div>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { Code } from "@/interfaces/codes";

export default defineComponent({
  props: {
    code: {
      type: Object as () => Code,
      required: true,
    },
  },
});
</script>
