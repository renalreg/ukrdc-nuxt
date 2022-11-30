<!-- eslint-disable vue/no-v-html -->
<template>
  <BaseInfoTooltip>
    <div class="max-w-lg [&>ul]:list-inside [&>ul]:list-disc" v-html="sanitisedDescriptionHTML"></div>
  </BaseInfoTooltip>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import DOMPurify from "dompurify";
import { marked } from "marked";

import BaseInfoTooltip from "~/components/base/BaseInfoTooltip.vue";

export default defineComponent({
  components: {
    BaseInfoTooltip,
  },
  props: {
    descriptionMarkdown: {
      type: String,
      required: true,
      default: undefined,
    },
  },

  setup(props) {
    const sanitisedDescriptionHTML = computed<String>(() => {
      if (!props.descriptionMarkdown) {
        return "No description available";
      }
      return DOMPurify.sanitize(marked.parse(props.descriptionMarkdown));
    });

    return {
      sanitisedDescriptionHTML,
    };
  },
});
</script>
