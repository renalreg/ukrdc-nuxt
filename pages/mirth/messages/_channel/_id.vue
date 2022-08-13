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
import { defineComponent, onMounted, ref, useMeta, useRoute } from "@nuxtjs/composition-api";
import { MirthChannelMessageModel } from "@ukkidney/ukrdc-axios-ts";

import useApi from "~/helpers/useApi";

export default defineComponent({
  setup() {
    const route = useRoute();
    const { mirthApi } = useApi();

    // Head

    const { title } = useMeta();
    title.value = `Mirth message ${route.value.params.id}`;

    // Data refs
    const message = ref<MirthChannelMessageModel>();

    // Data fetching
    onMounted(() => {
      mirthApi
        .getMirthChannelMessage({
          channelId: route.value.params.channel,
          messageId: route.value.params.id,
        })
        .then((response) => {
          message.value = response.data;
        });
    });

    return {
      message,
    };
  },
  head: {
    title: "Mirth Message",
  },
});
</script>
