<template>
  <li>
    <div :class="isChild ? ['bg-gray-100'] : []">
      <div class="min-h-20 lg:min-h-12 flex w-full min-w-0 items-center gap-2">
        <div class="h-full w-8">
          <div
            v-show="item.children.length > 0"
            class="flex h-full flex-none cursor-pointer items-center justify-center self-stretch"
            @click="showChildren = !showChildren"
          >
            <IconChevronDown v-show="showChildren" />
            <IconChevronRight v-show="!showChildren" />
          </div>
        </div>

        <div class="grid flex-grow grid-cols-6 items-center gap-2 py-2 pr-2 lg:grid-cols-12">
          <TextP class="col-span-2 truncate lg:col-span-3">{{ formatDate(item.accessEvent.time, true, true) }}</TextP>
          <TextP class="sensitive col-span-4 lg:col-span-4"> {{ item.accessEvent.userEmail }} </TextP>
          <TextP class="col-span-2 lg:col-span-1"> <BadgeCrud :operation="item.operation" /> </TextP>
          <AuditResourceBadge class="col-span-4 lg:col-span-4" :item="item" />
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
import { defineComponent, ref } from "@nuxtjs/composition-api";
import { AuditEventSchema } from "@ukkidney/ukrdc-axios-ts";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  props: {
    item: {
      type: Object as () => AuditEventSchema,
      required: true,
    },
    parent: {
      type: Object as () => AuditEventSchema,
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
    const showChildren = ref(false);
    return { showChildren, formatDate };
  },
});
</script>
