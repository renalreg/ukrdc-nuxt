<template>
  <BaseCard>
    <BaseCardContent>
      <BaseDescriptionListGrid>
        <BaseDescriptionListGridItem>
          <dt>Message ID</dt>
          <dd v-if="message && !isEmptyObject(message)">
            {{ message.messageId }}
          </dd>
          <BaseSkeleText v-else class="h-6 w-full" />
        </BaseDescriptionListGridItem>
        <BaseDescriptionListGridItem>
          <dt>Processed</dt>
          <dd v-if="message && !isEmptyObject(message)">
            {{ message.processed ? "Yes" : "No" }}
            {{ hasErrors ? "(with errors)" : "" }}
          </dd>
          <BaseSkeleText v-else class="h-6 w-full" />
        </BaseDescriptionListGridItem>
        <BaseDescriptionListGridItem>
          <dt>Channel</dt>
          <dd v-if="message && !isEmptyObject(message)">
            {{ channelName }}
          </dd>
          <BaseSkeleText v-else class="h-6 w-full" />
        </BaseDescriptionListGridItem>
      </BaseDescriptionListGrid>
      <slot></slot>
    </BaseCardContent>
  </BaseCard>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import { ChannelMessageModel } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardContent from "~/components/base/BaseCardContent.vue";
import BaseDescriptionListGrid from "~/components/base/BaseDescriptionListGrid.vue";
import BaseDescriptionListGridItem from "~/components/base/BaseDescriptionListGridItem.vue";
import BaseSkeleText from "~/components/base/BaseSkeleText.vue";
import { messageHasErrors } from "~/helpers/mirthUtils";
import { isEmptyObject } from "~/helpers/objectUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseCardContent,
    BaseSkeleText,
    BaseDescriptionListGrid,
    BaseDescriptionListGridItem,
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
