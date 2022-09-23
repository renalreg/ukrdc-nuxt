<template>
  <BaseCard>
    <BaseCardContent>
      <GenericDlGrid>
        <GenericDlGridItem>
          <TextDt>Message ID</TextDt>
          <TextDd v-if="message && !isEmptyObject(message)">
            {{ message.messageId }}
          </TextDd>
          <SkeleText v-else class="h-6 w-full" />
        </GenericDlGridItem>
        <GenericDlGridItem>
          <TextDt>Processed</TextDt>
          <TextDd v-if="message && !isEmptyObject(message)">
            {{ message.processed ? "Yes" : "No" }}
            {{ hasErrors ? "(with errors)" : "" }}
          </TextDd>
          <SkeleText v-else class="h-6 w-full" />
        </GenericDlGridItem>
        <GenericDlGridItem>
          <TextDt>Channel</TextDt>
          <TextDd v-if="message && !isEmptyObject(message)">
            {{ channelName }}
          </TextDd>
          <SkeleText v-else class="h-6 w-full" />
        </GenericDlGridItem>
      </GenericDlGrid>
      <slot></slot>
    </BaseCardContent>
  </BaseCard>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import { ChannelMessageModel } from "@ukkidney/ukrdc-axios-ts";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardContent from "~/components/base/BaseCardContent.vue";

import { isEmptyObject } from "~/helpers/objectUtils";
import { messageHasErrors } from "~/helpers/mirthUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseCardContent,
  },
  props: {
    message: {
      type: Object as () => ChannelMessageModel,
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
