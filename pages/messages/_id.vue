<template>
  <div>
    <div class="mb-6 flex items-end gap-4">
      <div class="flex-grow">
        <TextH1 v-if="message">
          {{ message.msgStatus === "ERROR" ? "Error" : "Message" }} {{ message.id }} from {{ message.facility }}
        </TextH1>
        <SkeleText v-else class="mb-2 h-8 w-1/4" />
        <TextL1 v-if="message" class="line-clamp-1">
          {{ messageSummary }}
        </TextL1>
        <SkeleText v-else class="h-4 w-1/2" />
      </div>
    </div>

    <NuxtChild v-if="message" :message="message" />
  </div>
</template>

<script lang="ts">
import { MessageSchema } from "@ukkidney/ukrdc-axios-ts";
import { MessageSummary } from "@/helpers/utils/messageUtils";

import useApi from "~/helpers/useApi";

export default defineComponent({
  setup() {
    const route = useRoute();
    const { messagesApi } = useApi();

    // Head
    useHead({
      title: computed(() => `Message ${route.params.id}`),
    });

    // Data refs

    const message = ref<MessageSchema>();

    const messageSummary = computed(() => {
      if (message.value) {
        return MessageSummary(message.value);
      }
      return "";
    });

    // Data fetching

    onMounted(() => {
      messagesApi
        .getMessage({
          messageId: Number(route.params.id),
        })
        .then((response) => {
          message.value = response.data;
        });
    });

    return {
      message,
      messageSummary,
    };
  },
});
</script>
