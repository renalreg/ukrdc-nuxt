<template>
  <li>
    <div class="group grid w-full min-w-0 grid-cols-2 gap-2 px-4 py-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-5">
      <!-- Heading -->
      <div class="col-span-5 lg:col-span-3">
        <div class="truncate">
          <h5 class="sensitive truncate md:inline">
            {{ item.filename || "No filename found" }}
          </h5>
          <h5 class="truncate md:inline">
            {{ item.mirthChannel ? `on ${item.mirthChannel}` : "" }}
          </h5>
        </div>
        <div class="mt-2 flex">
          <MessagesStatusBadge class="mr-2 flex-shrink" :message="item" />
          <p class="flex-grow line-clamp-1">
            {{ itemDescription }}
          </p>
        </div>
      </div>
      <!-- Recieved  -->
      <div class="col-span-2 lg:col-span-1">
        <p>From <LinkSendingFacility class="inline" :code="item.facility" /></p>
        <p class="mt-2">
          {{ item.received ? formatDate(item.received) : "Unknown time" }}
        </p>
      </div>
      <!-- Identifiers  -->
      <div class="col-span-3 flex items-center gap-4 lg:col-span-1">
        <BaseButton
          v-if="showPatientFilter"
          :class="!item.ni ? 'invisible' : ''"
          class="opacity-0 group-hover:opacity-100"
          :round="true"
          :tight="true"
          :to="{ path: '/messages', query: { nationalid: item.ni } }"
          tooltip="Filter errors by this patient"
          :label="`Filter errors by patient ${item.ni}`"
          ><IconMiniFilter
        /></BaseButton>
        <div class="flex-grow">
          <h5>Patient Number</h5>
          <p class="sensitive mt-2">
            {{ item.ni || "None Found" }}
          </p>
        </div>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import { MessageSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseButton from "~/components/base/BaseButton.vue";
import useSensitive from "~/composables/useSensitive";
import { formatDate } from "~/helpers/dateUtils";
import { makeMessageSummary } from "~/helpers/messageUtils";

export default defineComponent({
  components: {
    BaseButton,
  },
  props: {
    item: {
      type: Object as () => MessageSchema,
      required: true,
    },
    showPatientFilter: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  setup(props) {
    const { sensitiveNumbers } = useSensitive();

    const itemDescription = computed(() => {
      return sensitiveNumbers(makeMessageSummary(props.item));
    });
    return { itemDescription, formatDate };
  },
});
</script>
