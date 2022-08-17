<template>
  <div>
    <!-- Chain grid -->
    <div>
      <div v-for="(messages, index) in chain" :key="index">
        <div class="mt-3 grid grid-cols-1 justify-center gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
          <MirthConnectorMessageCard
            v-for="item in messages"
            :key="item.channelName + item.connectorName"
            :message="item"
          />
        </div>

        <div v-if="index < Object.keys(chain).length - 1" class="align-center">
          <IconArrowDown />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";

import { ChainMap, ChannelMessage, ConnectorMessage } from "@/interfaces/mirth";

import { isEmptyObject } from "@/helpers/utils/objectUtils";

export default defineComponent({
  props: {
    message: {
      type: Object as () => ChannelMessage,
      required: true,
    },
  },
  setup(props) {
    const chain = computed(() => {
      const currentChain = {} as ChainMap;
      if (props.message.connectorMessages) {
        for (const msg of Object.values(props.message.connectorMessages)) {
          if (!(msg.chainId in currentChain)) {
            currentChain[msg.chainId] = [];
          }
          currentChain[msg.chainId].push(msg);
        }
        for (const index in currentChain) {
          currentChain[index].sort((a: ConnectorMessage, b: ConnectorMessage) => (a.orderId > b.orderId ? 1 : -1));
        }
      }
      return currentChain;
    });

    return {
      chain,
      isEmptyObject,
    };
  },
});
</script>
