import { useContext } from '@nuxtjs/composition-api'
import { LinkRecord } from '~/interfaces/linkrecords'

export default function () {
  const { $axios, $config } = useContext()

  async function PostEMPIUnlink(personId: number, masterId: number, comment?: string): Promise<LinkRecord> {
    return (await $axios.$post(`${$config.apiBase}/v1/empi/unlink/`, {
      personId,
      masterId,
      comment: comment || '',
    })) as LinkRecord
  }

  async function PostEMPIMerge(supersedingId: number, supersededId: number): Promise<void> {
    return await $axios.$post(`${$config.apiBase}/v1/empi/merge`, {
      superseding: supersedingId,
      superseded: supersededId,
    })
  }

  return { PostEMPIUnlink, PostEMPIMerge }
}
