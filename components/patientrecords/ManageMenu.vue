<template>
  <div>
    <PatientrecordsDeleteModal ref="deleteModal" :item="item" @deleted="$emit('deleted')" />
    <div v-click-away="closeMenu" class="justify-self-end flex items-center">
      <GenericButtonMini
        aria-haspopup="true"
        :aria-expanded="showMenu"
        :aria-controls="`${item.pid}manageMenu`"
        label="Manage record"
        tooltip="Manage Record"
        class="h-8 ml-1"
        @click="showMenu = !showMenu"
        @keydown.native.enter.prevent="showMenu = !showMenu"
        @keydown.native.esc="showMenu = false"
      >
        <IconChevronDown />
      </GenericButtonMini>
      <GenericAutoMenu :id="`${item.pid}manageMenu`" class="mt-8" :show="showMenu" :items="manageMenuItems" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import { PatientRecord } from '@/interfaces/patientrecord'
import { modalInterface } from '~/interfaces/modal'
import usePermissions from '~/mixins/usePermissions'

export default defineComponent({
  props: {
    item: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },
  setup(props) {
    const { $toast } = useContext()
    const { hasPermission } = usePermissions()

    const manageMenuItems = computed(() => {
      return [
        {
          label: 'Copy PID',
          callback: copyPID,
        },
        {
          label: 'Delete Record',
          callback: showDeleteModal,
        },
        {
          label: 'Unlink Record',
          callback: () => {},
          disabled: true,
        },
      ]
    })

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

    return {
      deleteModal,
      manageMenuItems,
      showMenu,
      closeMenu,
      copyPID,
      showDeleteModal,
      hasPermission,
    }
  },
})
</script>
