<template>
  <span>
    <TextH1 class="sensitive inline capitalize">{{ forename.toLowerCase() }}</TextH1>
    <TextH1 class="sensitive inline capitalize italic">{{ surname.toLowerCase() }}</TextH1>
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
