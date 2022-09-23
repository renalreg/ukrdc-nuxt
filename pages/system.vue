<template>
  <div>
    <h1 class="mb-4">Support</h1>
    <h3>UK Renal Registry users</h3>
    <p>
      Please use the
      <a
        class="font-medium text-indigo-600 hover:text-indigo-500"
        href="https://renalregistry.atlassian.net/jira/software/c/projects/UI/issues"
        target="blank"
        >Jira issue tracker</a
      >
      to report issues with this application.
    </p>
    <p>Where possible, please include the configuration report shown below.</p>

    <h3 class="mt-2">External users</h3>
    <p>Support lines for external users are yet to be confirmed.</p>

    <h2 class="my-4">System Configuration</h2>
    <div class="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <BaseCard>
        <BaseCardHeader>
          <h2>Client</h2>
        </BaseCardHeader>
        <BaseCardDescriptionList>
          <BaseCardDescriptionItem>
            <dt>Environment</dt>
            <dd>{{ clientInfo.deploymentEnv }}</dd>
          </BaseCardDescriptionItem>
          <BaseCardDescriptionItem>
            <dt>Version Reference</dt>
            <dd>{{ clientInfo.githubRef }}</dd>
          </BaseCardDescriptionItem>
          <BaseCardDescriptionItem>
            <dt>Version Hash</dt>
            <dd>{{ clientInfo.githubSha }}</dd>
          </BaseCardDescriptionItem>
        </BaseCardDescriptionList>
      </BaseCard>

      <BaseCard>
        <BaseCardHeader>
          <h2>Server</h2>
        </BaseCardHeader>
        <BaseCardDescriptionList>
          <BaseCardDescriptionItem>
            <dt>Environment</dt>
            <dd v-if="serverInfo">{{ serverInfo.deploymentEnv }}</dd>
            <BaseSkeleText v-else class="mb-2 h-6 w-3/4" />
          </BaseCardDescriptionItem>
          <BaseCardDescriptionItem>
            <dt>Version Reference</dt>
            <dd v-if="serverInfo">{{ serverInfo.githubRef }}</dd>
            <BaseSkeleText v-else class="mb-2 h-6 w-3/4" />
          </BaseCardDescriptionItem>
          <BaseCardDescriptionItem>
            <dt>Version Hash</dt>
            <dd v-if="serverInfo">{{ serverInfo.githubSha }}</dd>
            <BaseSkeleText v-else class="mb-2 h-6 w-3/4" />
          </BaseCardDescriptionItem>
        </BaseCardDescriptionList>
      </BaseCard>
    </div>
    <BaseButton @click="copyConfigReport">Copy Configuration Report</BaseButton>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useContext } from "@nuxtjs/composition-api";
import { SystemInfoSchema } from "@ukkidney/ukrdc-axios-ts";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseButton from "~/components/base/BaseButton.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";
import BaseSkeleText from "~/components/base/BaseSkeleText.vue";
import BaseCardDescriptionList from "~/components/base/BaseCardDescriptionList.vue";
import BaseCardDescriptionItem from "~/components/base/BaseCardDescriptionItem.vue";

import useApi from "~/composables/useApi";

export default defineComponent({
  components: {
    BaseButton,
    BaseCard,
    BaseCardHeader,
    BaseSkeleText,
    BaseCardDescriptionList,
    BaseCardDescriptionItem,
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
