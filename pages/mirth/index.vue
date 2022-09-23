<template>
  <div>
    <div class="mx-auto mb-4 max-w-7xl">
      <h1>Mirth Channels</h1>
    </div>

    <BaseLoadingIndicator v-if="!mirthGroups"></BaseLoadingIndicator>
    <div v-else class="mx-auto mb-8 max-w-7xl">
      <div v-for="group in mirthGroups" :key="group.id" class="mb-6">
        <div class="mb-4">
          <h4>
            {{ group.name }}
          </h4>
          <h6>
            {{ group.description }}
          </h6>
        </div>

        <ul class="my-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          <li v-for="item in group.channels" :key="item.id" class="col-span-1">
            <BaseCard class="px-4 py-2">
              <h3 class="truncate">
                {{ item.name }}
              </h3>
              <h5>Rev. {{ item.revision }}</h5>
              <p>{{ item.statistics ? item.statistics.received : "Unknown" }} received</p>
              <span
                v-if="item.statistics && item.statistics.error === 0"
                class="mt-2 inline-block rounded-sm bg-green-100 px-2 py-0.5 text-sm font-medium text-green-800"
                >No errors</span
              >
              <span
                v-else-if="item.statistics && item.statistics.error > 0"
                class="mt-2 inline-block rounded-sm bg-red-100 px-2 py-0.5 text-sm font-medium text-red-800"
                >{{ item.statistics.error }} errors</span
              >
            </BaseCard>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { ChannelGroupModel } from "@ukkidney/ukrdc-axios-ts";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseLoadingIndicator from "~/components/base/BaseLoadingIndicator.vue";

import useApi from "~/composables/useApi";

export default defineComponent({
  components: {
    BaseCard,
    BaseLoadingIndicator,
  },
  setup() {
    const { mirthApi } = useApi();

    // Data refs
    const mirthGroups = ref<ChannelGroupModel[]>();

    // Data fetching
    onMounted(() => {
      mirthApi.getMirthGroups().then((response) => {
        mirthGroups.value = response.data;
      });
    });

    return {
      mirthGroups,
    };
  },

  head: {
    title: "Mirth Channels",
  },
});
</script>
