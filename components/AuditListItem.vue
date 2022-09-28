<template>
  <li>
    <div :class="isChild ? ['bg-gray-100'] : []">
      <div class="min-h-20 lg:min-h-12 flex w-full min-w-0 items-center gap-2">
        <div class="h-full w-8">
          <div
            v-show="item.children && item.children.length > 0"
            class="flex h-full flex-none cursor-pointer items-center justify-center self-stretch"
            @click="showChildren = !showChildren"
          >
            <IconChevronDown v-show="showChildren" class="h-5 w-5 text-gray-400" />
            <IconChevronRight v-show="!showChildren" class="h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div class="grid flex-grow grid-cols-6 items-center gap-2 py-2 pr-2 lg:grid-cols-12">
          <p class="col-span-2 truncate lg:col-span-3">{{ formatDate(item.accessEvent.time, true, true) }}</p>
          <p class="sensitive col-span-4 lg:col-span-4">{{ item.accessEvent.userEmail }}</p>
          <p class="col-span-2 lg:col-span-1"><BadgeCRUD :operation="item.operation" /></p>
          <AuditResourceCard class="col-span-4 lg:col-span-4" :item="item" />
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

import AuditResourceCard from "~/components/AuditResourceCard.vue";
import BadgeCRUD from "~/components/BadgeCRUD.vue";
import IconChevronDown from "~/components/icons/hero/24/solid/IconChevronDown.vue";
import IconChevronRight from "~/components/icons/hero/24/solid/IconChevronRight.vue";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  name: "AuditListItem",
  components: {
    IconChevronRight,
    IconChevronDown,
    BadgeCRUD,
    AuditResourceCard,
  },
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
