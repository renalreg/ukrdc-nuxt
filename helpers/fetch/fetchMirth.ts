import { useContext } from '@nuxtjs/composition-api'
import { ChannelGroup, ChannelMessage } from '~/interfaces/mirth'

export default function () {
  const { $api } = useContext()

  async function fetchMirthGroups(): Promise<ChannelGroup[]> {
    return (await $api.$get('/v1/mirth/groups/')) as ChannelGroup[]
  }

  async function fetchMirthMessage(channelId: string, messageId: string): Promise<ChannelMessage> {
    return (await $api.$get(`/v1/mirth/channels/${channelId}/messages/${messageId}/`)) as ChannelMessage
  }

  return { fetchMirthGroups, fetchMirthMessage }
}
