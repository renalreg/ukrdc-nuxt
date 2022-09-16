<template>
  <GenericCardMini class="px-2 py-1">
    <div class="flex">
      <TextL2 class="flex-grow">{{ resourceName }} </TextL2>
      <TextL2 class="flex-none">{{ identifier(1) }}</TextL2>
    </div>
    <div class="flex">
      <TextL2 class="blurred flex-grow">{{ primaryIdentifier }}</TextL2>
      <TextL2 class="blurred flex-none">{{ identifier(2) }}</TextL2>
    </div>
  </GenericCardMini>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "@nuxtjs/composition-api";
import { AuditEventSchema } from "@ukkidney/ukrdc-axios-ts";

export default defineComponent({
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
