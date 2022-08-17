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
import fetchMirth from "~/helpers/fetch/fetchMirth";

import { ChannelMessage } from "@/interfaces/mirth";

export default defineComponent({
  setup() {
    const route = useRoute();
    const { fetchMirthMessage } = fetchMirth();

    // Head

    const { title } = useMeta();
    title.value = `Mirth message ${route.value.params.id}`;

    // Data refs
    const message = ref<ChannelMessage>();

    // Data fetching
    onMounted(async () => {
      message.value = await fetchMirthMessage(route.value.params.channel, route.value.params.id);
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
