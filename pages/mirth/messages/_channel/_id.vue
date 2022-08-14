<template>
  <div>
    <div class="mb-6">
      <TextH1 v-if="message"> Message {{ message.messageId }} </TextH1>
      <SkeleText v-else class="mb-2 h-8 w-1/4" />
    </div>

    <!-- Header card -->
    <MirthMessageCard class="mb-6" :message="message" />

    <NuxtChild v-if="message" :message="message" />
  </div>
</template>

<script lang="ts">
import { ChannelMessageModel } from "@ukkidney/ukrdc-axios-ts";

import useApi from "~/helpers/useApi";

export default defineComponent({
  setup() {
    const route = useRoute();
    const { mirthApi } = useApi();

    // Head
    useHead({
      title: computed(() => `Mirth message ${route.params.id}`),
    });

    // Data refs
    const message = ref<ChannelMessageModel>();

    // Data fetching
    onMounted(() => {
      mirthApi
        .getMirthChannelMessage({
          channelId: route.params.channel,
          messageId: route.params.id,
        })
        .then((response) => {
          message.value = response.data;
        });
    });

    return {
      message,
    };
  },
});
</script>
