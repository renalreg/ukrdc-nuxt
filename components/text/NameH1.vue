<template>
  <span>
    <h1 class="sensitive inline capitalize">{{ forename.toLowerCase() }}</h1>
    <h1 class="sensitive inline capitalize italic">{{ surname.toLowerCase() }}</h1>
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
