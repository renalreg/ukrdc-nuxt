<template>
  <BaseCard>
    <BaseCardContent>
      <BaseDlGrid>
        <BaseDlGridItem>
          <dt>Message ID</dt>
          <dd v-if="message && !isEmptyObject(message)">
            {{ message.messageId }}
          </dd>
          <BaseSkeleText v-else class="h-6 w-full" />
        </BaseDlGridItem>
        <BaseDlGridItem>
          <dt>Processed</dt>
          <dd v-if="message && !isEmptyObject(message)">
            {{ message.processed ? "Yes" : "No" }}
            {{ hasErrors ? "(with errors)" : "" }}
          </dd>
          <BaseSkeleText v-else class="h-6 w-full" />
        </BaseDlGridItem>
        <BaseDlGridItem>
          <dt>Channel</dt>
          <dd v-if="message && !isEmptyObject(message)">
            {{ channelName }}
          </dd>
          <BaseSkeleText v-else class="h-6 w-full" />
        </BaseDlGridItem>
      </BaseDlGrid>
      <slot></slot>
    </BaseCardContent>
  </BaseCard>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import { ChannelMessageModel } from "@ukkidney/ukrdc-axios-ts";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardContent from "~/components/base/BaseCardContent.vue";
import BaseSkeleText from "~/components/base/BaseSkeleText.vue";
import BaseDlGrid from "~/components/base/BaseDlGrid.vue";
import BaseDlGridItem from "~/components/base/BaseDlGridItem.vue";

import { isEmptyObject } from "~/helpers/objectUtils";
import { messageHasErrors } from "~/helpers/mirthUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseCardContent,
    BaseSkeleText,
    BaseDlGrid,
    BaseDlGridItem,
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
