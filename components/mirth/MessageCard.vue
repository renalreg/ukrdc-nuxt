<template>
  <GenericCard>
    <GenericCardContent>
      <GenericDl>
        <GenericDi>
          <TextDt>Message ID</TextDt>
          <TextDd v-if="message && !isEmptyObject(message)">
            {{ message.messageId }}
          </TextDd>
          <SkeleText v-else class="h-6 w-full" />
        </GenericDi>
        <GenericDi>
          <TextDt>Processed</TextDt>
          <TextDd v-if="message && !isEmptyObject(message)">
            {{ message.processed ? "Yes" : "No" }}
            {{ hasErrors ? "(with errors)" : "" }}
          </TextDd>
          <SkeleText v-else class="h-6 w-full" />
        </GenericDi>
        <GenericDi>
          <TextDt>Channel</TextDt>
          <TextDd v-if="message && !isEmptyObject(message)">
            {{ channelName }}
          </TextDd>
          <SkeleText v-else class="h-6 w-full" />
        </GenericDi>
      </GenericDl>
      <slot></slot>
    </GenericCardContent>
  </GenericCard>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";

import { ChannelMessage } from "@/interfaces/mirth";

import { isEmptyObject } from "@/helpers/utils/objectUtils";
import { messageHasErrors } from "~/helpers/utils/mirthUtils";

export default defineComponent({
  props: {
    message: {
      type: Object as () => ChannelMessage,
      required: false,
      default: undefined,
    },
  },
  setup(props) {
    const channelName = computed(() => {
      let name: string = "";
      for (const msg of Object.values(props.message.connectorMessages)) {
        if (!name.includes(msg.channelName)) {
          name = name + "/" + msg.channelName;
        }
      }
      return name.substring(1);
    });

    const hasErrors = computed((): boolean => {
      return messageHasErrors(props.message);
    });

    return { channelName, hasErrors, isEmptyObject };
  },
});
</script>

<style scoped></style>
