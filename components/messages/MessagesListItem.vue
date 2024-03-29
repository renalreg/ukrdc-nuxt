<template>
  <li>
    <div class="group grid w-full min-w-0 grid-cols-2 gap-2 px-4 py-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-5">
      <!-- Heading -->
      <div class="col-span-5 lg:col-span-3">
        <div class="flex gap-2">
          <div class="truncate">
            <h5 class="sensitive truncate md:inline">
              {{ item.filename || "Internal file" }}
            </h5>
            <h5 class="truncate md:inline">
              {{ item.mirthChannel ? `on ${item.mirthChannel}` : "" }}
            </h5>
          </div>
          <BaseInfoTooltip v-if="!item.filename" class="inline">
            <p>This usually corresponds to a file internally sent to update RADAR membership details.</p>
          </BaseInfoTooltip>
        </div>

        <div class="mt-2 flex">
          <BadgeMessageStatus class="mr-2 flex-shrink" :message="item" />
          <p class="line-clamp-1 flex-grow">
            {{ itemDescription }}
          </p>
        </div>
      </div>
      <!-- Recieved  -->
      <div class="col-span-2 lg:col-span-1">
        <p>From <SendingFacilityLink class="inline" :code="item.facility" /></p>
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
          ><IconFunnel class="h-5 w-5" />
        </BaseButton>
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

import BadgeMessageStatus from "~/components/BadgeMessageStatus.vue";
import BaseButton from "~/components/base/BaseButton.vue";
import BaseInfoTooltip from "~/components/base/BaseInfoTooltip.vue";
import IconFunnel from "~/components/icons/hero/20/solid/IconFunnel.vue";
import SendingFacilityLink from "~/components/SendingFacilityLink.vue";
import useSensitive from "~/composables/useSensitive";
import { formatDate } from "~/helpers/dateUtils";
import { makeMessageSummary } from "~/helpers/messageUtils";

export default defineComponent({
  components: {
    BaseInfoTooltip,
    BaseButton,
    SendingFacilityLink,
    IconFunnel,
    BadgeMessageStatus,
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
