<template>
  <div>
    <div class="grid gap-5 sm:gap-6 grid-cols-2 h-8">
      <GenericSelect v-model="exportKey">
        <option value="exportPV">Export to PV</option>
        <option value="exportPVDocs">Export Docs to PV</option>
        <option value="exportPVTests">Export Tests to PV</option>
        <option value="exportRADAR">Export to RADAR</option>
      </GenericSelect>

      <GenericButton @click="actionExport">Run Export</GenericButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'

import { PatientRecord } from '@/interfaces/patientrecord'
import fetchPatientRecords from '~/helpers/fetch/fetchPatientRecords'

export default defineComponent({
  props: {
    record: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },

  setup(props) {
    const { $toast } = useContext()
    const { postPatientRecordExport } = fetchPatientRecords()

    const exportKey = ref('exportPV')

    function actionExport() {
      let scope: string | null
      switch (exportKey.value) {
        case 'exportPVDocs': {
          scope = 'docs'
          break
        }
        case 'exportPVTests': {
          scope = 'tests'
          break
        }
        case 'exportRADAR': {
          scope = 'radar'
          break
        }
        default: {
          scope = null
          break
        }
      }
      postPatientRecordExport(props.record, scope).then(() => {
        $toast.show({
          type: 'success',
          title: 'Success',
          message: 'Export initiated',
          classTimeout: 'bg-green-600',
        })
      })
    }

    return {
      exportKey,
      actionExport,
    }
  },
})
</script>
