<template>
  <div>
    <TextH1 class="mb-4">Support</TextH1>
    <TextH3>UK Renal Registry users</TextH3>
    <TextP>
      Please use the
      <a
        class="font-medium text-indigo-600 hover:text-indigo-500"
        href="https://renalregistry.atlassian.net/jira/software/c/projects/UI/issues"
        target="blank"
        >Jira issue tracker</a
      >
      to report issues with this application.
    </TextP>
    <TextP>Where possible, please include the configuration report shown below.</TextP>

    <TextH3 class="mt-2">External users</TextH3>
    <TextP>Support lines for external users are yet to be confirmed. </TextP>

    <TextH2 class="my-4">System Configuration</TextH2>
    <div class="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <BaseCard>
        <BaseCardHeader>
          <TextH2>Client</TextH2>
        </BaseCardHeader>
        <GenericCardDl>
          <GenericCardDi>
            <GenericCardDt>Environment</GenericCardDt>
            <GenericCardDd>{{ clientInfo.deploymentEnv }}</GenericCardDd>
          </GenericCardDi>
          <GenericCardDi>
            <GenericCardDt>Version Reference</GenericCardDt>
            <GenericCardDd>{{ clientInfo.githubRef }}</GenericCardDd>
          </GenericCardDi>
          <GenericCardDi>
            <GenericCardDt>Version Hash</GenericCardDt>
            <GenericCardDd>{{ clientInfo.githubSha }}</GenericCardDd>
          </GenericCardDi>
        </GenericCardDl>
      </BaseCard>

      <BaseCard>
        <BaseCardHeader>
          <TextH2>Server</TextH2>
        </BaseCardHeader>
        <GenericCardDl>
          <GenericCardDi>
            <GenericCardDt>Environment</GenericCardDt>
            <GenericCardDd v-if="serverInfo">{{ serverInfo.deploymentEnv }}</GenericCardDd>
            <SkeleText v-else class="mb-2 h-6 w-3/4" />
          </GenericCardDi>
          <GenericCardDi>
            <GenericCardDt>Version Reference</GenericCardDt>
            <GenericCardDd v-if="serverInfo">{{ serverInfo.githubRef }}</GenericCardDd>
            <SkeleText v-else class="mb-2 h-6 w-3/4" />
          </GenericCardDi>
          <GenericCardDi>
            <GenericCardDt>Version Hash</GenericCardDt>
            <GenericCardDd v-if="serverInfo">{{ serverInfo.githubSha }}</GenericCardDd>
            <SkeleText v-else class="mb-2 h-6 w-3/4" />
          </GenericCardDi>
        </GenericCardDl>
      </BaseCard>
    </div>
    <BaseButton @click="copyConfigReport">Copy Configuration Report</BaseButton>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useContext } from "@nuxtjs/composition-api";
import { SystemInfoSchema } from "@ukkidney/ukrdc-axios-ts";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";

import useApi from "~/composables/useApi";

export default defineComponent({
  components: {
    BaseButton,
    BaseCard,
    BaseCardHeader,
  },
  setup() {
    const { $config, $toast } = useContext();
    const { systemInfoApi } = useApi();

    // Data refs

    const serverInfo = ref<SystemInfoSchema>();
    const clientInfo = ref({
      deploymentEnv: $config.deploymentEnv,
      githubRef: process.env.githubRef,
      githubSha: process.env.githubSha,
    });

    // Data fetching

    onMounted(() => {
      systemInfoApi.getSystemInfo().then((response) => {
        serverInfo.value = response.data;
      });
    });

    // Config reports

    const configReportJSON = computed(() => {
      return JSON.stringify(
        {
          server: serverInfo.value,
          client: clientInfo.value,
        },
        null,
        4
      );
    });

    function copyConfigReport() {
      navigator.clipboard.writeText(configReportJSON.value).then(() => {
        $toast.show({
          type: "success",
          title: "Success",
          message: "Configuration Report copied to clipboard",
          timeout: 5,
          classTimeout: "bg-green-600",
        });
      });
    }

    return {
      serverInfo,
      clientInfo,
      copyConfigReport,
    };
  },
  head: {
    title: "System Configuration",
  },
});
</script>
