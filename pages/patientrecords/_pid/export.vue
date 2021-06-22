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
import { defineComponent, ref, useContext, computed } from '@nuxtjs/composition-api'

import { PatientRecord } from '@/interfaces/patientrecord'

export default defineComponent({
  props: {
    record: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },

  setup(props) {
    const { $axios, $toast } = useContext()

    const exportKey = ref('exportPV')
    const currentExportUrl = computed(() => {
      if (exportKey.value === 'exportPV') {
        return props.record.links.exportPV
      } else if (exportKey.value === 'exportPVDocs') {
        return props.record.links.exportPVDocs
      } else if (exportKey.value === 'exportPVTests') {
        return props.record.links.exportPVTests
      } else if (exportKey.value === 'exportRADAR') {
        return props.record.links.exportRADAR
      } else {
        return undefined
      }
    })

    function actionExport() {
      if (currentExportUrl.value) {
        $axios
          .$post(currentExportUrl.value)
          .then(() => {
            $toast.show({
              type: 'success',
              title: 'Success',
              message: 'Export initiated',
              classTimeout: 'bg-green-600',
            })
          })
          .catch((error) => {
            console.log(error.response.data.detail)
            $toast.show({
              type: 'danger',
              title: 'Error',
              message: error.response.data.detail,
              timeout: 10,
              classTimeout: 'bg-red-600',
            })
          })
      }
    }

    return {
      exportKey,
      actionExport,
    }
  },
})
</script>
