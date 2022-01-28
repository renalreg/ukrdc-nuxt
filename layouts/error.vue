<template>
  <div class="flex h-full flex-col items-center justify-center">
    <div class="block items-center justify-center sm:flex">
      <TextHcxl class="sm:mr-8">{{ error.statusCode || "Error" }}</TextHcxl>
      <div class="sm:border-l sm:pl-8">
        <TextH1 class="whitespace-pre">{{ errorTitle }}</TextH1>
        <NuxtLink to="/">Home page</NuxtLink>
      </div>
    </div>
    <div v-if="errorDetail">
      <TextP>{{ errorDetail }}</TextP>
    </div>
  </div>
</template>

<script lang="ts">
import { NuxtError } from "@nuxt/types";
import { computed, defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  layout: "error",
  props: {
    error: {
      type: Object as () => NuxtError,
      required: true,
    },
  },
  setup(props) {
    const errorTitle = computed(() => {
      return props.error.message?.split("\n")[0] || "Unknown error";
    });

    const errorDetail = computed(() => {
      return props.error.message?.split("\n").slice(1).join("\n") || "";
    });

    return { errorTitle, errorDetail };
  },
});
</script>
