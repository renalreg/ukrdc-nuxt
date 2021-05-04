<template>
  <div>
    <div class="grid gap-5 sm:gap-6 grid-cols-2 h-8">
      <GenericSelect v-model="exportKey">
        <option value="exportPV">Export to PV</option>
        <option value="exportPVDocs">Export Docs to PV</option>
        <option value="exportPVTests">Export Tests to PV</option>
        <option value="exportRADAR">Export to RADAR</option>
      </GenericSelect>

      <GenericButton>Run Export</GenericButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { PatientRecord } from '@/interfaces/patientrecord'

export default Vue.extend({
  props: {
    record: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },

  data() {
    return {
      exportKey: 'exportPV',
    }
  },
  computed: {
    currentExportUrl(): string | undefined {
      if (this.exportKey === 'exportPV') {
        return this.record.links.exportPV
      } else if (this.exportKey === 'exportPVDocs') {
        return this.record.links.exportPVDocs
      } else if (this.exportKey === 'exportPVTests') {
        return this.record.links.exportPVTests
      } else if (this.exportKey === 'exportRADAR') {
        return this.record.links.exportRADAR
      } else {
        return undefined
      }
    },
  },
  methods: {
    actionExport() {
      if (this.currentExportUrl) {
        this.$axios
          .$post(this.currentExportUrl)
          .then(() => {
            this.$toast.show({
              type: 'success',
              title: 'Success',
              message: 'Export initiated',
              classTimeout: 'bg-green-600',
            })
          })
          .catch((error) => {
            console.log(error.response.data.detail)
            this.$toast.show({
              type: 'danger',
              title: 'Error',
              message: error.response.data.detail,
              timeout: 10,
              classTimeout: 'bg-red-600',
            })
          })
      }
    },
  },
})
</script>
