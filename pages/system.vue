<template>
  <div>
    <TextH1 class="mb-4">System Configuration</TextH1>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      <GenericCard>
        <GenericCardHeader>
          <TextH2>Client</TextH2>
        </GenericCardHeader>
        <GenericCardDl>
          <GenericCardDi>
            <GenericCardDt>Environment</GenericCardDt>
            <GenericCardDd>{{ $config.deploymentEnv }}</GenericCardDd>
          </GenericCardDi>
          <GenericCardDi>
            <GenericCardDt>Version Reference</GenericCardDt>
            <GenericCardDd>{{ $config.githubRef }}</GenericCardDd>
          </GenericCardDi>
          <GenericCardDi>
            <GenericCardDt>Version Hash</GenericCardDt>
            <GenericCardDd>{{ $config.githubSha }}</GenericCardDd>
          </GenericCardDi>
        </GenericCardDl>
      </GenericCard>

      <GenericCard>
        <GenericCardHeader>
          <TextH2>Server</TextH2>
        </GenericCardHeader>
        <GenericCardDl>
          <GenericCardDi>
            <GenericCardDt>Environment</GenericCardDt>
            <GenericCardDd v-if="serverInfo">{{ serverInfo.deploymentEnv }}</GenericCardDd>
            <SkeleText v-else class="h-6 mb-2 w-3/4" />
          </GenericCardDi>
          <GenericCardDi>
            <GenericCardDt>Version Reference</GenericCardDt>
            <GenericCardDd v-if="serverInfo">{{ serverInfo.githubRef }}</GenericCardDd>
            <SkeleText v-else class="h-6 mb-2 w-3/4" />
          </GenericCardDi>
          <GenericCardDi>
            <GenericCardDt>Version Hash</GenericCardDt>
            <GenericCardDd v-if="serverInfo">{{ serverInfo.githubSha }}</GenericCardDd>
            <SkeleText v-else class="h-6 mb-2 w-3/4" />
          </GenericCardDi>
        </GenericCardDl>
      </GenericCard>
    </div>
    <GenericButton @click="copyConfigReport">Copy Configuration Report</GenericButton>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useContext } from '@nuxtjs/composition-api'

import fetchSystem from '~/helpers/fetch/fetchSystem'

interface serverSystemInfo {
  githubRef: string
  githubSha: string
  deploymentEnv: string
}

export default defineComponent({
  setup() {
    const { $config, $toast } = useContext()
    const { fetchServerInfo } = fetchSystem()

    // Data refs

    const serverInfo = ref<serverSystemInfo>()

    // Data fetching

    onMounted(async () => {
      serverInfo.value = await fetchServerInfo()
    })

    // Config reports

    const configReportJSON = computed(() => {
      return JSON.stringify(
        {
          server: serverInfo.value,
          client: {
            deploymentEnv: $config.deploymentEnv,
            githubRef: $config.githubRef,
            githubSha: $config.githubSha,
          },
        },
        null,
        4
      )
    })

    function copyConfigReport() {
      navigator.clipboard.writeText(configReportJSON.value).then(() => {
        $toast.show({
          type: 'success',
          title: 'Success',
          message: 'Configuration Report copied to clipboard',
          timeout: 5,
          classTimeout: 'bg-green-600',
        })
      })
    }

    return {
      serverInfo,
      copyConfigReport,
    }
  },
  head: {
    title: 'System Configuration',
  },
})
</script>
