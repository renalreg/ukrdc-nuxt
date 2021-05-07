<template>
  <li>
    <NuxtLink
      :to="`/patientrecords/${item.pid}`"
      class="block hover:bg-gray-50"
    >
      <div class="flex items-center px-4 py-4 sm:px-6">
        <div class="min-w-0 flex-1 flex items-center">
          <div class="min-w-0 grid grid-cols-2 lg:grid-cols-3 md:gap-4 w-full">
            <!-- Name, DoB, gender -->
            <div>
              <TextL1c class="capitalize truncate">
                {{ item.sendingfacility }}
              </TextL1c>
              <TextP class="mt-2"> via {{ item.sendingextract }} </TextP>
            </div>
            <!-- National ID -->
            <div class="text-right sm:text-left">
              <TextL1>Local ID</TextL1>
              <TextP class="mt-2">
                {{ item.localpatientid }}
              </TextP>
            </div>
            <!-- Details (large breakpoint only) -->
            <div class="hidden lg:block">
              <TextL1>Last updated</TextL1>
              <TextP class="mt-2">
                {{ formatDate(item.repositoryUpdateDate) }}
              </TextP>
            </div>
          </div>
        </div>
        <div>
          <IconChevronRight />
        </div>
      </div>
    </NuxtLink>
  </li>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
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
    return { formatDate }
  },
})
</script>
