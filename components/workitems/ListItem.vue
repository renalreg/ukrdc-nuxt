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
        <TextNameL1 v-if="item.person" :forename="item.person.givenname" :surname="item.person.surname" />
        <TextL1 v-if="item.person && item.masterRecord" class="inline">→</TextL1>
        <TextNameL1
          v-if="item.masterRecord"
          :forename="item.masterRecord.givenname"
          :surname="item.masterRecord.surname"
        />
        <TextL1 v-else class="inline truncate capitalize text-red-800"> Missing Record </TextL1>
        <TextP class="mt-2 truncate"> {{ item.type }}: {{ item.description }} </TextP>
      </div>
      <!-- National ID -->
      <div class="text-right sm:text-left">
        <TextP v-if="item.masterRecord">
          {{ item.masterRecord.nationalid.trim() }}
        </TextP>
        <TextP v-else-if="item.person">
          {{ item.person.localid.trim() }}
        </TextP>
        <masterrecordsNationalIdTypeTag
          class="mt-2"
          :nationalid-type="item.masterRecord ? item.masterRecord.nationalidType : 'Unknown Type'"
        />
      </div>
      <!-- Last updated (small and up) -->
      <div class="hidden lg:block">
        <TextP><LinkSendingFacility class="inline" :code="facility" /> via {{ extract }}</TextP>
        <TextP class="mt-2">
          {{ formatDate(item.creationDate) }}
        </TextP>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { WorkItemSchema } from "@ukkidney/ukrdc-axios-ts";
import { formatDate } from "@/helpers/utils/dateUtils";

export default defineComponent({
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
