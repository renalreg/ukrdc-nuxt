<template>
  <GenericCardMini class="px-4 py-2">
    <div class="h-16 mb-2">
      <p class="text-gray-900 font-medium hover:text-gray-600 line-clamp-2">
        {{ item.drugProductGeneric }}
      </p>
      <p v-if="item.comment" class="text-gray-500">
        {{ item.comment }}
      </p>
    </div>

    <p v-if="item.enteringOrganizationCode" class="text-gray-500">
      Entered by {{ item.enteringOrganizationCode }}
    </p>
    <p v-if="item.enteringOrganizationDescription" class="text-gray-500">
      {{ item.enteringOrganizationDescription }}
    </p>
    <p v-if="item.fromTime" class="text-gray-500">
      Since {{ formatDate(item.fromTime, (t = false)) }}
    </p>
    <span
      v-if="!item.toTime"
      class="inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-sm mt-2"
      >Active</span
    >
    <span
      v-else
      class="inline-block px-2 py-0.5 text-red-800 text-xs font-medium bg-red-100 rounded-sm mt-2"
      >Inactive since {{ formatDate(item.toTime, (t = false)) }}</span
    >
  </GenericCardMini>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

import { formatDate } from '@/utilities/dateUtils'
import { formatGender } from '@/utilities/codeUtils'

import { Medication } from '@/interfaces/medication'

export default defineComponent({
  props: {
    item: {
      type: Object as () => Medication,
      required: true,
    },
  },
  setup() {
    return { formatDate, formatGender }
  },
})
</script>
