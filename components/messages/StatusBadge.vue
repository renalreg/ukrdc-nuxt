<template>
  <span class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium" :class="classes">
    {{ message.msgStatus }}
  </span>
</template>

<script lang="ts">
import { MessageSchema } from "@ukkidney/ukrdc-axios-ts";

export default defineComponent({
  props: {
    message: {
      type: Object as () => MessageSchema,
      required: true,
    },
  },
  setup(props) {
    const classes = computed(() => {
      if (props.message.msgStatus === "ERROR") {
        return ["bg-red-100", "text-red-800"];
      } else if (props.message.msgStatus === "RECEIVED") {
        return ["bg-yellow-100", "text-yellow-800"];
      }
      return ["bg-green-100", "text-green-800"];
    });
    return { classes };
  },
});
</script>
