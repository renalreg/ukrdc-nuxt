import { useContext } from '@nuxtjs/composition-api'
import { ChannelGroup, ChannelMessage } from '~/interfaces/mirth'

export default function () {
  const { $axios, $config } = useContext()

  async function fetchMirthGroups(): Promise<ChannelGroup[]> {
    return (await $axios.$get(`${$config.apiBase}/v1/mirth/groups/`)) as ChannelGroup[]
  }

  async function fetchMirthMessage(channelId: string, messageId: string): Promise<ChannelMessage> {
    return (await $axios.$get(
      `${$config.apiBase}/v1/mirth/channels/${channelId}/messages/${messageId}/`
    )) as ChannelMessage
  }

  return { fetchMirthGroups, fetchMirthMessage }
}
