<template>
  <div>
    <div class="mb-4">
      <TextL1 class="capitalize truncate inline"> {{ code.codingStandard }} / </TextL1>
      <TextL1c class="capitalize truncate inline">
        {{ code.code }}
      </TextL1c>
      <TextP class="mt-2 truncate">
        {{ code.description || 'No description found' }}
      </TextP>
    </div>
    <div class="mb-4">
      <div>
        <TextL1 class="inline">Type: </TextL1><TextP class="inline">{{ code.objectType || 'None' }} </TextP>
      </div>
      <div class="mt-2">
        <TextL1 class="inline">Units: </TextL1><TextP class="inline">{{ code.units || 'None' }} </TextP>
      </div>
    </div>
    <div class="mb-4">
      <div>
        <TextL1 class="inline">Created: </TextL1><TextP class="inline">{{ formatDate(code.creationDate) }} </TextP>
      </div>
      <div class="mt-2">
        <TextL1 class="inline">Created: </TextL1
        ><TextP class="inline">{{ code.updateDate ? formatDate(code.updateDate) : 'Never updated' }} </TextP>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { formatDate } from '@/utilities/dateUtils'
import { Code, CodeMap } from '@/interfaces/codes'

export default defineComponent({
  props: {
    code: {
      type: Object as () => Code,
      required: true,
    },
  },
  setup() {
    const mapsTo = ref<CodeMap[]>()
    const mappedBy = ref<CodeMap[]>()

    return { formatDate, mapsTo, mappedBy }
  },
})
</script>
