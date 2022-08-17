<template>
  <genericCardMini class="col-span-1 flex items-center justify-between truncate">
    <div class="flex-1 truncate px-4 py-2">
      <TextH3>
        {{ message.connectorName }}
      </TextH3>
      <TextP>{{ message.sendAttempts }} send attempts</TextP>

      <div class="mt-2">
        <span
          v-if="errorMessage"
          class="inline-block flex-shrink-0 rounded-sm bg-red-100 px-2 py-0.5 text-sm font-medium text-red-800"
          >Error</span
        >
        <span
          v-else
          class="inline-block flex-shrink-0 rounded-sm bg-green-100 px-2 py-0.5 text-sm font-medium text-green-800"
          >Success</span
        >
        <genericButtonMini
          class="float-right"
          :to="`/mirth/messages/${message.channelId}/${message.messageId}/${message.orderId}`"
        >
          View message
        </genericButtonMini>
      </div>
    </div>
  </genericCardMini>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import { ConnectorMessageModel } from "@ukkidney/ukrdc-axios-ts";
import { connectorMessageError } from "~/helpers/utils/mirthUtils";

export default defineComponent({
  props: {
    message: {
      type: Object as () => ConnectorMessageModel,
      required: true,
    },
  },

  setup(props) {
    const errorMessage = computed(() => {
      return connectorMessageError(props.message);
    });

    return { errorMessage };
  },
});
</script>
