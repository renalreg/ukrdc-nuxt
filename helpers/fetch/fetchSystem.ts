import { useContext } from '@nuxtjs/composition-api'

interface serverSystemInfo {
  githubRef: string
  githubSha: string
  deploymentEnv: string
}

export default function () {
  const { $axios, $config } = useContext()

  async function fetchServerInfo(): Promise<serverSystemInfo> {
    return (await $axios.$get(`${$config.apiBase}/v1/system/info/`)) as serverSystemInfo
  }

  return { fetchServerInfo }
}
