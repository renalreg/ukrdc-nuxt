<template>
  <div>
    <BaseLoadingIndicator v-if="fetchSourceInProgress"></BaseLoadingIndicator>
    <BaseCard v-else-if="source && source.content">
      <GenericCodeReader
        :content="source.content"
        :content-type="source.contentType"
        class="sensitive box-border flex h-full flex-col overflow-x-scroll"
      />
    </BaseCard>

    <div v-else class="flex h-full w-full">
      <div class="mb-auto mt-auto w-full text-center">Missing or empty source file</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { MessageSchema, MessageSourceSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseLoadingIndicator from "~/components/base/BaseLoadingIndicator.vue";
import useApi from "~/composables/useApi";

export default defineComponent({
  components: {
    BaseCard,
    BaseLoadingIndicator,
  },
  props: {
    message: {
      type: Object as () => MessageSchema,
      required: true,
    },
  },
  setup(props) {
    const { messagesApi } = useApi();

    const source = ref<MessageSourceSchema>();
    const error = ref<string>();

    const fetchSourceInProgress = ref(false);

    onMounted(() => {
      fetchSourceInProgress.value = true;
      messagesApi
        .getMessageSource({ messageId: props.message.id })
        .then((response) => {
          source.value = response.data;
        })
        .catch((error) => {
          error.value = error.response.data.detail;
        })
        .finally(() => {
          fetchSourceInProgress.value = false;
        });
    });

    return {
      fetchSourceInProgress,
      source,
      error,
    };
  },
});
</script>
