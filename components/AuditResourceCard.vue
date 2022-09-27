<template>
  <BaseCard class="px-2 py-1">
    <div class="flex">
      <h6 class="flex-grow">{{ resourceName }}</h6>
      <h6 class="flex-none">{{ identifier(1) }}</h6>
    </div>
    <div class="flex">
      <h6 class="sensitive flex-grow">{{ primaryIdentifier }}</h6>
      <h6 class="sensitive flex-none">{{ identifier(2) }}</h6>
    </div>
  </BaseCard>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "@nuxtjs/composition-api";
import { AuditEventSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";

export default defineComponent({
  components: {
    BaseCard,
  },
  props: {
    item: {
      type: Object as () => AuditEventSchema,
      required: true,
    },
  },
  setup(props) {
    const clickUrl = ref<string | null>(null);

    const resourceName = computed(() => {
      return props.item?.resource?.replace("_", " ").trim();
    });

    const primaryIdentifier = computed(() => {
      if (props?.item?.identifiers?.length && props.item.identifiers.length > 0) {
        return props.item.identifiers[0];
      } else {
        return props.item.resourceId;
      }
    });

    function identifier(index: number) {
      if (props?.item?.identifiers?.length && props.item.identifiers.length > index) {
        return props.item.identifiers[index];
      } else {
        return "";
      }
    }

    return { resourceName, primaryIdentifier, identifier, clickUrl };
  },
});
</script>
