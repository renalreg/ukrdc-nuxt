<template>
  <div>
    <div class="mx-auto mb-4 max-w-7xl">
      <TextH1>Mirth Channels</TextH1>
    </div>

    <LoadingIndicator v-if="!mirthGroups"></LoadingIndicator>
    <div v-else class="mx-auto mb-8 max-w-7xl">
      <div v-for="group in mirthGroups" :key="group.id" class="mb-6">
        <div class="mb-4">
          <TextH4>
            {{ group.name }}
          </TextH4>
          <TextL2>
            {{ group.description }}
          </TextL2>
        </div>

        <ul class="my-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          <li v-for="item in group.channels" :key="item.channelId" class="col-span-1">
            <GenericCard class="px-4 py-2">
              <TextH3 class="truncate">
                {{ item.name }}
              </TextH3>
              <TextL1> Rev. {{ item.revision }} </TextL1>
              <TextP> {{ item.statistics ? item.statistics.received : "Unknown" }} received </TextP>
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
            </GenericCard>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ChannelGroupModel } from "@ukkidney/ukrdc-axios-ts";
import useApi from "~/helpers/useApi";

export default defineComponent({
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
