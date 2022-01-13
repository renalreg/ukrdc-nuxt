import { useContext } from '@nuxtjs/composition-api'
import { LinkRecord } from '~/interfaces/linkrecords'

export default function () {
  const { $api } = useContext()

  async function PostEMPIUnlink(personId: number, masterId: number, comment?: string): Promise<LinkRecord> {
    return (await $api.$post('/v1/empi/unlink/', {
      personId,
      masterId,
      comment: comment || '',
    })) as LinkRecord
  }

  async function PostEMPIMerge(supersedingId: number, supersededId: number): Promise<void> {
    return await $api.$post('/v1/empi/merge', {
      superseding: supersedingId,
      superseded: supersededId,
    })
  }

  return { PostEMPIUnlink, PostEMPIMerge }
}
