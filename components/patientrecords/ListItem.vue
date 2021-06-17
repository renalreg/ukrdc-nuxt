<template>
  <li>
    <div class="flex items-center py-4">
      <div class="min-w-0 flex-1 flex items-center">
        <div class="flex-none justify-center w-16 cursor-pointer" @click="showDetail = !showDetail">
          <IconChevronDown v-show="showDetail" class="mx-auto" />
          <IconChevronRight v-show="!showDetail" class="mx-auto" />
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
          <!-- Record link -->
          <GenericButtonMini class="w-24 h-8 justify-self-end"
            ><NuxtLink :to="`/patientrecords/${item.pid}`" class="block hover:bg-gray-50"
              >View Record</NuxtLink
            ></GenericButtonMini
          >
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
import { formatDate } from '@/utilities/dateUtils'
import { PatientRecordShort } from '@/interfaces/patientrecord'

export default defineComponent({
  props: {
    item: {
      type: Object as () => PatientRecordShort,
      required: true,
    },
  },
  setup() {
    const showDetail = ref(false)
    return { showDetail, formatDate }
  },
})
</script>
