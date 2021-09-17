<template>
  <li>
    <div class="flex items-center py-4">
      <div class="min-w-0 flex-1 flex items-center">
        <div
          v-tooltip="{ content: 'Show details', delay: { show: 500, hide: 0 } }"
          aria-label="Show details"
          role="button"
          tabindex="0"
          class="flex flex-none items-center justify-center w-16 self-stretch cursor-pointer"
          @click="showDetail = !showDetail"
          @keydown.enter.prevent="showDetail = !showDetail"
        >
          <IconChevronDown v-show="showDetail" />
          <IconChevronRight v-show="!showDetail" />
        </div>
        <div class="min-w-0 grid grid-cols-4 items-center md:gap-4 w-full pr-4">
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
          <div class="justify-self-end flex items-center">
            <GenericButtonMini :to="`/patientrecords/${item.pid}`" class="h-8">View Record</GenericButtonMini>
            <PatientrecordsManageMenu :item="item" @deleted="$emit('deleted')" />
          </div>
        </div>
      </div>
    </div>
    <!-- Collapsible details -->
    <div v-show="showDetail" class="pl-16 pr-4 mb-4">
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
