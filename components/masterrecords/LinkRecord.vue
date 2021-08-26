<template>
  <div>
    <GenericModalSlot ref="unlinkModal">
      <div class="text-left">
        <div class="mb-4">Unlink comment</div>
        <FormTextArea v-model="unlinkComment" rows="3"></FormTextArea>
      </div>

      <div class="flex justify-end">
        <genericButton @click="unlinkModal.hide()">Cancel</genericButton>
        <GenericButton class="ml-2" type="submit" @click="doUnlink()"> Unlink </GenericButton>
      </div>
    </GenericModalSlot>

    <TextL1 class="mb-2 w-full text-center">Link Record {{ record.id }}</TextL1>
    <GenericButton @click="unlinkModal.show()">Unlink</GenericButton>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PersonsRecordCard class="border-2 border-red-500" :record="record.person" />
      <NuxtLink :to="`/masterrecords/${record.masterRecord.id}`">
        <masterrecordsRecordCard class="border-2 border-indigo-500" :record="record.masterRecord" />
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'

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
    const { $axios, $config, $toast } = useContext()

    const unlinkModal = ref<modalInterface>()
    const unlinkComment = ref('')

    async function doUnlink() {
      try {
        await $axios.$post(`${$config.apiBase}/v1/empi/unlink`, {
          personId: props.record.person.id,
          masterId: props.record.masterRecord.id,
          comment: unlinkComment.value || '',
        })
        $toast.show({
          type: 'success',
          title: 'Success',
          message: 'Record unlink request sent successfully',
          timeout: 10,
          classTimeout: 'bg-green-600',
        })
      } catch (error) {
        console.log(error.response.data.detail)
        $toast.show({
          type: 'danger',
          title: 'Error',
          message: 'Error processing merge request',
          timeout: 10,
          classTimeout: 'bg-red-600',
        })
        throw error
      }
      unlinkModal.value?.hide()
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
