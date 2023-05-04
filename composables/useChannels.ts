import { computed, onMounted, ref } from "@nuxtjs/composition-api";
import { ChannelMapModel } from "@ukkidney/ukrdc-axios-ts";

import useQuery from "~/composables/query/useQuery";
import useApi from "~/composables/useApi";

export default function () {
  const { stringQuery } = useQuery();
  const { mirthApi } = useApi();

  const channels = ref([] as ChannelMapModel[]);

  const channelIds = computed(() => {
    return channels.value.map(({ id }) => id);
  });
  const channelLabels = computed(() => {
    return channels.value.map(({ name }) => name);
  });
  const selectedChannel = stringQuery("channel", null, true);

  function setChannels() {
    // If we don't already have a list of available facilties, fetch one
    if (channels.value.length === 0) {
      mirthApi.getMirthChannelMap().then((response) => {
        channels.value = response.data;
      });
    }
  }

  onMounted(() => {
    setChannels();
  });

  return {
    channels,
    channelIds,
    channelLabels,
    selectedChannel,
  };
}
