<!-- Given a postcode, creates and formats a link to open the postcode in Google Maps -->

<template>
  <TextP>
    <a :href="'http://google.com/maps?' + urlQuery" target="_blank">
      {{ code }}
    </a>
  </TextP>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    code: {
      type: String,
      required: false,
      default: null,
    },
  },
  setup(props) {
    const urlQuery = computed(() => {
      const { code } = props;
      if (code) {
        return `q=${encodeURIComponent(code)}`;
      }
      return "";
    });

    return { urlQuery };
  },
});
</script>
