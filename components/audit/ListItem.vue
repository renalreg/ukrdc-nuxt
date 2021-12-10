<template>
  <li>
    <div :class="isChild ? ['bg-gray-100'] : []">
      <div class="flex items-center gap-2 min-w-0 w-full min-h-20 lg:min-h-12">
        <div class="w-8 h-full">
          <div
            v-show="item.children.length > 0"
            class="flex flex-none items-center justify-center self-stretch h-full cursor-pointer"
            @click="showChildren = !showChildren"
          >
            <IconChevronDown v-show="showChildren" />
            <IconChevronRight v-show="!showChildren" />
          </div>
        </div>

        <div class="flex-grow grid grid-cols-3 lg:grid-cols-6 gap-2 items-center">
          <TextP class="col-span-1 truncate">{{ formatDate(item.accessEvent.time) }}</TextP>
          <TextP class="col-span-2"> {{ item.accessEvent.userEmail }} </TextP>
          <TextP class="col-span-1"> {{ item.operation }} </TextP>
          <AuditResourceBadge class="col-span-2 mr-2 my-2" :item="item" />
        </div>
      </div>
      <ul
        v-if="showChildren && item.children && item.children.length > 0"
        class="divide-y divide-gray-200 border-t border-gray-200"
      >
        <div v-for="child in item.children" :key="child.id" :item="child">
          <AuditListItem :item="child" :parent="item" :is-child="true" />
        </div>
      </ul>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { formatDate } from '@/helpers/utils/dateUtils'
import { AuditEvent } from '@/interfaces/audit'

export default defineComponent({
  props: {
    item: {
      type: Object as () => AuditEvent,
      required: true,
    },
    parent: {
      type: Object as () => AuditEvent,
      required: false,
      default: null,
    },
    isChild: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(_) {
    const showChildren = ref(false)
    return { showChildren, formatDate }
  },
})
</script>
