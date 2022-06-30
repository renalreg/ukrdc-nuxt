<template>
  <span class="truncate">
    <TextL1 class="blurred inline capitalize">{{ forename.toLowerCase() }}</TextL1>
    <TextL1 class="blurred inline capitalize italic">{{ surname.toLowerCase() }}</TextL1>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    forename: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
  },
});
</script>
