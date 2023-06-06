<template>
  <div v-if="badgeStatus !== 0">
    <BaseBadge v-if="badgeStatus === 1" class="w-14 bg-green-100 text-center text-green-800">Active</BaseBadge>
    <BaseBadge v-if="badgeStatus === 2" class="w-14 bg-red-100 text-center text-red-800">Closed</BaseBadge>
    <BaseBadge v-if="badgeStatus === 3" class="w-14 bg-yellow-100 text-center text-yellow-800">Mixed</BaseBadge>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import { PatientRecordSummarySchema } from "@ukkidney/ukrdc-axios-ts";

import BaseBadge from "~/components/base/BaseBadge.vue";

enum MembershipStatusEnum {
  Open = 1,
  Closed = 2,
  Mixed = 3,
  Unknown = 0,
}
export default defineComponent({
  components: {
    BaseBadge,
  },
  props: {
    item: {
      type: Object as () => PatientRecordSummarySchema,
      required: true,
    },
  },
  setup(props) {
    const badgeStatus = computed(() => {
      if (props.item.programMemberships) {
        const open = props.item.programMemberships.filter((pm) => !pm.toTime).length;
        const closed = props.item.programMemberships.filter((pm) => pm.toTime).length;
        if (open > 0 && closed > 0) {
          return MembershipStatusEnum.Mixed;
        } else if (open > 0) {
          return MembershipStatusEnum.Open;
        } else if (closed > 0) {
          return MembershipStatusEnum.Closed;
        } else {
          return MembershipStatusEnum.Unknown;
        }
      } else {
        return MembershipStatusEnum.Unknown;
      }
    });

    return { badgeStatus };
  },
});
</script>
