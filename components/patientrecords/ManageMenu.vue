<template>
  <div>
    <PatientrecordsDeleteModal ref="deleteModal" :item="item" @deleted="$emit('deleted')" />
    <div v-click-away="closeMenu" class="relative justify-self-end flex items-center">
      <GenericButtonRaw label="Manage record" class="z-0" @click="showMenu = !showMenu">
        <IconMiniDotsVertical class="text-gray-400 hover:text-gray-800" />
      </GenericButtonRaw>

      <GenericMenu class="top-0 right-0 z-10 mx-2 my-2" :show="showMenu">
        <GenericMenuItem @click="copyPID"> Copy PID </GenericMenuItem>
        <div v-if="hasPermission('ukrdc:records:export')">
          <GenericMenuDivider />
          <GenericMenuItem v-if="showPvSync" @click="actionExport('pv')"> Sync Record to PatientView </GenericMenuItem>
          <GenericMenuItem v-if="showPvSync" @click="actionExport('docs')"> Sync Docs to PatientView </GenericMenuItem>
          <GenericMenuItem v-if="showPvSync" @click="actionExport('tests')">
            Sync Tests to PatientView
          </GenericMenuItem>
          <GenericMenuItem v-if="showRadarSync" @click="actionExport('RADAR')"> Sync Record to RADAR </GenericMenuItem>
        </div>
        <div v-if="hasPermission('ukrdc:records:delete')">
          <GenericMenuDivider />
          <GenericMenuItem @click="showDeleteModal"> Delete Record </GenericMenuItem>
        </div>
      </GenericMenu>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import { PatientRecordSummary } from '@/interfaces/patientrecord'
import { modalInterface } from '~/interfaces/modal'
import usePermissions from '~/helpers/usePermissions'
import fetchPatientRecords from '~/helpers/fetch/fetchPatientRecords'

export default defineComponent({
  props: {
    item: {
      type: Object as () => PatientRecordSummary,
      required: true,
    },
    showPvSync: {
      type: Boolean,
      required: false,
      default: false,
    },
    showRadarSync: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const { $toast } = useContext()
    const { hasPermission } = usePermissions()
    const { postPatientRecordExport } = fetchPatientRecords()

    const deleteModal = ref<modalInterface>()

    const showMenu = ref(false)

    function closeMenu() {
      showMenu.value = false
    }

    function copyPID() {
      navigator.clipboard
        .writeText(props.item.pid)
        .then(() => {
          $toast.show({
            type: 'success',
            title: 'Success',
            message: 'PID copied to clipboard',
            timeout: 5,
            classTimeout: 'bg-green-600',
          })
        })
        .finally(() => {
          closeMenu()
        })
    }

    function actionExport(scope: string) {
      postPatientRecordExport(props.item, scope)
        .then(() => {
          $toast.show({
            type: 'success',
            title: 'Success',
            message: 'Export initiated',
            classTimeout: 'bg-green-600',
          })
        })
        .finally(() => {
          closeMenu()
        })
    }

    function showDeleteModal() {
      closeMenu()
      deleteModal.value?.show()
    }

    return { deleteModal, showMenu, closeMenu, copyPID, actionExport, showDeleteModal, hasPermission }
  },
})
</script>
