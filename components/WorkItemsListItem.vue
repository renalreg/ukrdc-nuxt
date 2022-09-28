<template>
  <li>
    <div class="grid w-full min-w-0 grid-cols-3 px-4 py-4 sm:px-6 md:gap-4 lg:grid-cols-4">
      <!-- IDs and description -->
      <div class="col-span-2">
        <span
          v-if="item.status == 3"
          class="inline-flex h-5 items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800"
        >
          Closed
        </span>
        <span v-if="item.person">
          <h5 class="sensitive inline capitalize">{{ item.person.givenname?.toLowerCase() }}</h5>
          <h5 class="sensitive inline capitalize italic">{{ item.person.surname?.toLowerCase() }}</h5>
        </span>
        <h5 v-if="item.person && item.masterRecord" class="inline">→</h5>
        <span v-if="item.masterRecord">
          <h5 class="sensitive inline capitalize">{{ item.masterRecord.givenname?.toLowerCase() }}</h5>
          <h5 class="sensitive inline capitalize italic">{{ item.masterRecord.surname?.toLowerCase() }}</h5>
        </span>
        <h5 v-else class="inline truncate capitalize text-red-800">Missing Record</h5>
        <p class="mt-2 truncate">{{ item.type }}: {{ item.description }}</p>
      </div>
      <!-- National ID -->
      <div class="text-right sm:text-left">
        <p v-if="item.masterRecord" class="sensitive">
          {{ item.masterRecord.nationalid.trim() }}
        </p>
        <p v-else-if="item.person" class="sensitive">
          {{ item.person.localid.trim() }}
        </p>
        <BadgeNationalID
          class="mt-2"
          :nationalid-type="item.masterRecord ? item.masterRecord.nationalidType : 'Unknown Type'"
        />
      </div>
      <!-- Last updated (small and up) -->
      <div class="hidden lg:block">
        <p><SendingFacilityLink class="inline" :code="facility" /> via {{ extract }}</p>
        <p class="mt-2">
          {{ formatDate(item.creationDate) }}
        </p>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import { WorkItemSchema } from "@ukkidney/ukrdc-axios-ts";

import BadgeNationalID from "~/components/BadgeNationalID.vue";
import SendingFacilityLink from "~/components/SendingFacilityLink.vue";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: { SendingFacilityLink, BadgeNationalID },
  props: {
    item: {
      type: Object as () => WorkItemSchema,
      required: true,
    },
  },
  setup(props) {
    const facility = computed(() => {
      if (props.item.person?.xrefEntries[0]?.sendingFacility) {
        return props.item.person?.xrefEntries[0]?.sendingFacility;
      } else {
        return "Unknown Facility";
      }
    });
    const extract = computed(() => {
      if (props.item.person?.xrefEntries[0]?.sendingExtract) {
        return props.item.person?.xrefEntries[0]?.sendingExtract;
      } else {
        return "Unknown Extract";
      }
    });
    return { formatDate, facility, extract };
  },
});
</script>
