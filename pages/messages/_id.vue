<template>
  <div>
    <div class="mb-6 flex items-end gap-4">
      <div class="flex-grow">
        <h1 v-if="message">
          {{ message.msgStatus === "ERROR" ? "Error" : "Message" }} {{ message.id }} from {{ message.facility }}
        </h1>
        <BaseSkeleText v-else class="mb-2 h-8 w-1/4" />
        <h5 v-if="message" class="line-clamp-1">
          {{ messageSummary }}
        </h5>
        <BaseSkeleText v-else class="h-4 w-1/2" />
      </div>
    </div>

    <NuxtChild v-if="message" :message="message" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useMeta, useRoute } from "@nuxtjs/composition-api";
import { MessageSchema } from "@ukkidney/ukrdc-axios-ts";
import BaseSkeleText from "~/components/base/BaseSkeleText.vue";

import { makeMessageSummary } from "~/helpers/messageUtils";

import useApi from "~/composables/useApi";
import useSensitive from "~/composables/useSensitive";

export default defineComponent({
  components: {
    BaseSkeleText,
  },
  setup() {
    const route = useRoute();
    const { messagesApi } = useApi();
    const { sensitiveNumbers } = useSensitive();

    // Head

    const { title } = useMeta();
    title.value = `Message ${route.value.params.id}`;

    // Data refs

    const message = ref<MessageSchema>();

    const messageSummary = computed(() => {
      if (message.value) {
        return sensitiveNumbers(makeMessageSummary(message.value));
      }
      return "";
    });

    // Data fetching

    onMounted(() => {
      messagesApi
        .getMessage({
          messageId: Number(route.value.params.id),
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
  head: {
    title: "Message",
  },
});
</script>
