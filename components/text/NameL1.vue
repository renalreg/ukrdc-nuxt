<template>
  <span class="truncate">
    <h5 class="sensitive inline capitalize">{{ forename.toLowerCase() }}</h5>
    <h5 class="sensitive inline capitalize italic">{{ surname.toLowerCase() }}</h5>
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
