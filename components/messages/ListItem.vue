<template>
  <li>
    <div class="group grid w-full min-w-0 grid-cols-2 gap-2 px-4 py-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-5">
      <!-- Heading -->
      <div class="col-span-5 lg:col-span-3">
        <div class="truncate">
          <TextL1 class="sensitive truncate md:inline">
            {{ item.filename || "No filename found" }}
          </TextL1>
          <TextL1 class="truncate md:inline">
            {{ item.mirthChannel ? `on ${item.mirthChannel}` : "" }}
          </TextL1>
        </div>
        <div class="mt-2 flex">
          <MessagesStatusBadge class="mr-2 flex-shrink" :message="item" />
          <TextP class="flex-grow line-clamp-1">
            {{ itemDescription }}
          </TextP>
        </div>
      </div>
      <!-- Recieved  -->
      <div class="col-span-2 lg:col-span-1">
        <TextP>From <LinkSendingFacility class="inline" :code="item.facility" /></TextP>
        <TextP class="mt-2">
          {{ item.received ? formatDate(item.received) : "Unknown time" }}
        </TextP>
      </div>
      <!-- Identifiers  -->
      <div class="col-span-3 flex items-center gap-4 lg:col-span-1">
        <GenericButton
          v-if="showPatientFilter"
          :class="!item.ni ? 'invisible' : ''"
          class="opacity-0 group-hover:opacity-100"
          :round="true"
          :tight="true"
          :to="{ path: '/messages', query: { nationalid: item.ni } }"
          tooltip="Filter errors by this patient"
          :label="`Filter errors by patient ${item.ni}`"
          ><IconMiniFilter
        /></GenericButton>
        <div class="flex-grow">
          <TextL1>Patient Number</TextL1>
          <TextP class="sensitive mt-2">
            {{ item.ni || "None Found" }}
          </TextP>
        </div>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import { MessageSchema } from "@ukkidney/ukrdc-axios-ts";
import { formatDate } from "@/helpers/dateUtils";
import { makeMessageSummary } from "@/helpers/messageUtils";
import useSensitive from "@/composables/useSensitive";

export default defineComponent({
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
