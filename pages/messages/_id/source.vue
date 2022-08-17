<template>
  <div>
    <LoadingIndicator v-if="fetchSourceInProgress"></LoadingIndicator>
    <GenericCard v-else-if="source && source.content">
      <GenericCodeReader
        :content="source.content"
        :content-type="source.contentType"
        class="box-border flex h-full flex-col overflow-x-scroll"
      />
    </GenericCard>

    <div v-else class="flex h-full w-full">
      <div class="mb-auto mt-auto w-full text-center">Missing or empty source file</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { MessageSchema, MessageSourceSchema } from "@ukkidney/ukrdc-axios-ts";
import useApi from "~/helpers/useApi";

export default defineComponent({
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
