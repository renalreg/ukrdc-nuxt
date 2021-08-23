<template>
  <div>
    <TextH1 class="mb-4">System Configuration</TextH1>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
            <GenericCardDd>{{ $config.githubSHA }}</GenericCardDd>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, useFetch } from '@nuxtjs/composition-api'

interface serverSystemInfo {
  githubRef: string
  githubSha: string
  deploymentEnv: string
}

export default defineComponent({
  setup() {
    const { $axios, $config } = useContext()

    const serverInfo = ref<serverSystemInfo>()

    useFetch(async () => {
      serverInfo.value = await $axios.$get(`${$config.apiBase}/v1/system/info/`)

      console.log(await $axios.$get(`${$config.apiBase}/v1/system/user/`))
    })

    return {
      serverInfo,
    }
  },
  head: {
    title: 'System Configuration',
  },
})
</script>
