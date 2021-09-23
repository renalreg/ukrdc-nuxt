<template>
  <li>
    <div class="min-w-0 flex-1 flex items-center">
      <div class="px-4 py-4 sm:px-6 min-w-0 grid grid-cols-4 md:gap-4 w-full">
        <!-- Name, DoB, gender -->
        <div>
          <TextL1c class="capitalize truncate">
            {{ item.sendingfacility }}
          </TextL1c>
          <TextP class="mt-2"> via {{ item.sendingextract }} </TextP>
        </div>
        <!-- National ID -->
        <div>
          <TextL1>Local ID</TextL1>
          <TextP class="mt-2">
            {{ item.localpatientid }}
          </TextP>
        </div>
        <!-- UKRDC ID -->
        <div>
          <TextL1>UKRDC ID</TextL1>
          <TextP class="mt-2">
            {{ item.ukrdcid }}
          </TextP>
        </div>
        <!-- Record links -->
        <div class="justify-self-end flex items-center gap-2">
          <GenericButtonMini class="h-8" @click="showDetail = !showDetail">
            {{ showDetail ? 'Hide Record' : 'Peek Record' }}
          </GenericButtonMini>
          <GenericButtonMini :to="`/patientrecords/${item.pid}`" class="h-8">Open Record</GenericButtonMini>
          <PatientrecordsManageMenu :item="item" @deleted="$emit('deleted')" />
        </div>
      </div>
    </div>
    <!-- Collapsible details -->
    <div v-show="showDetail" class="px-4 sm:px-6 mb-4">
      <PatientrecordsDetailCards :record="item" />
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { formatDate } from '@/helpers/utils/dateUtils'
import { PatientRecordSummary } from '@/interfaces/patientrecord'

export default defineComponent({
  props: {
    item: {
      type: Object as () => PatientRecordSummary,
      required: true,
    },
  },
  setup() {
    const showDetail = ref(false)
    return { showDetail, formatDate }
  },
})
</script>
