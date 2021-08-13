<template>
  <div>
    <PatientrecordsDeleteModal ref="deleteModal" :item="item" @deleted="$emit('deleted')" />
    <div v-click-away="closeMenu" class="justify-self-end flex items-center">
      <GenericButtonMini label="Manage record" tooltip="Manage Record" class="h-8 ml-1" @click="showMenu = !showMenu">
        <IconChevronDown />
      </GenericButtonMini>
      <GenericMenu class="mt-8" :show="showMenu">
        <GenericMenuItem @click.native="copyPID"> Copy PID </GenericMenuItem>
        <GenericMenuItem @click.native="showDeleteModal"> Delete Record </GenericMenuItem>
      </GenericMenu>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import { PatientRecord } from '@/interfaces/patientrecord'
import { modalInterface } from '~/interfaces/modal'

export default defineComponent({
  props: {
    item: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },
  setup(props) {
    const { $toast } = useContext()

    const deleteModal = ref<modalInterface>()

    const showMenu = ref(false)

    function closeMenu() {
      showMenu.value = false
    }

    function copyPID() {
      navigator.clipboard.writeText(props.item.pid).then(() => {
        closeMenu()
        $toast.show({
          type: 'success',
          title: 'Success',
          message: 'PID copied to clipboard',
          timeout: 5,
          classTimeout: 'bg-green-600',
        })
      })
    }

    function showDeleteModal() {
      closeMenu()
      deleteModal.value?.show()
    }

    return { deleteModal, showMenu, closeMenu, copyPID, showDeleteModal }
  },
})
</script>
