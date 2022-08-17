<!-- Given a sending facility code, creates and formats a link to the facility overview page -->

<template>
  <p class="truncate capitalize">
    <NuxtLink v-if="code" class="hover:underline" :to="`/facilities/${code}`">{{ code }}</NuxtLink>
    <span v-else>Unknown Facility</span>
  </p>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    code: {
      type: String,
      required: false,
      default: null,
    },
  },
});
</script>
