<template>
  <div>
    <div v-if="isLoading">
      <AlertFilePlaceholder class="mb-4" />
    </div>
    <div v-else-if="message">
      <BaseAlertError
        v-if="message.msgStatus === 'ERROR' && latestMessageInfo"
        class="mb-4"
        :message="latestMessageInfo"
      />
      <BaseAlertInfo v-else class="mb-4" :message="latestMessageInfo || 'No message information available'" />
    </div>
    <div v-else>
      <BaseAlertWarning class="mb-4" message="No new patient data received in the last year" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import { MinimalMessageSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseAlertError from "~/components/base/BaseAlertError.vue";
import BaseAlertInfo from "~/components/base/BaseAlertInfo.vue";
import BaseAlertWarning from "~/components/base/BaseAlertWarning.vue";
import AlertFilePlaceholder from "~/components/messages/AlertFilePlaceholder.vue";
import useSensitive from "~/composables/useSensitive";
import { formatDate } from "~/helpers/dateUtils";

const sentinel = Object();

export default defineComponent({
  components: {
    AlertFilePlaceholder,
    BaseAlertInfo,
    BaseAlertError,
    BaseAlertWarning,
  },
  props: {
    message: {
      type: Object as () => MinimalMessageSchema,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const { sensitive } = useSensitive();

    const latestMessageInfo = computed(() => {
      if (!props.message) {
        return null;
      }
      if (props.message.msgStatus === "ERROR") {
        if (props.message.received) {
          return `Latest file ${sensitive(props.message.filename)} failed from ${
            props.message.facility
          } on ${formatDate(props.message.received, false)}`;
        } else {
          return `Latest file ${sensitive(props.message.filename)} failed from ${props.message.facility}`;
        }
      }
      if (props.message.received) {
        return `Latest file ${sensitive(props.message.filename)} recieved from ${
          props.message.facility
        } on ${formatDate(props.message.received, false)}`;
      } else {
        return `Latest file ${sensitive(props.message.filename)} recieved from ${props.message.facility}`;
      }
    });

    return { latestMessageInfo, sentinel };
  },
});
</script>
