<template>
  <div>
    <GenericModalSlot ref="unlinkModal">
      <div class="text-left">
        <div class="mb-4">Unlink comment</div>
        <FormTextArea v-model="unlinkComment" :max-length="100" rows="3"></FormTextArea>
      </div>

      <div class="flex justify-end">
        <GenericButton @click="unlinkModal.hide()">Cancel</GenericButton>
        <GenericButton colour="red" class="ml-2" type="submit" @click="doUnlink()"> Unlink </GenericButton>
      </div>
    </GenericModalSlot>

    <GenericCard class="flex items-center p-2 mb-2">
      <div class="flex-grow pl-2">
        <TextL1>Link Record {{ record.id }}</TextL1>
      </div>
      <div class="flex-shrink">
        <GenericButtonMini @click="unlinkModal.show()">Unlink</GenericButtonMini>
      </div>
    </GenericCard>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PersonsRecordCard :record="record.person" />
      <NuxtLink :to="`/masterrecords/${record.masterRecord.id}`">
        <masterrecordsRecordCard :record="record.masterRecord" />
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, useRouter } from '@nuxtjs/composition-api'

import { formatDate } from '@/utilities/dateUtils'
import { formatGender } from '@/utilities/codeUtils'

import { LinkRecord } from '@/interfaces/linkrecords'
import { modalInterface } from '~/interfaces/modal'

export default defineComponent({
  props: {
    record: {
      type: Object as () => LinkRecord,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter()
    const { $axios, $config, $toast } = useContext()

    const unlinkModal = ref<modalInterface>()
    const unlinkComment = ref('')

    function doUnlink() {
      $axios
        .$post(`${$config.apiBase}/v1/empi/unlink/`, {
          personId: props.record.person.id,
          masterId: props.record.masterRecord.id,
          comment: unlinkComment.value || '',
        })
        .then((response: LinkRecord) => {
          console.log(response)
          $toast.show({
            type: 'success',
            title: 'Success',
            message: 'Record unlink request sent successfully',
            timeout: 10,
            classTimeout: 'bg-green-600',
          })
          router.push({ path: `/masterrecords/${response.masterRecord.id}` })
        })
        .finally(() => {
          unlinkModal.value?.hide()
        })
    }

    return {
      unlinkModal,
      unlinkComment,
      doUnlink,
      formatGender,
      formatDate,
    }
  },
})
</script>

<style></style>
