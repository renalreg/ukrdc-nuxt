<template>
  <BaseCard>
    <BaseCardHeader><h2>Advice</h2></BaseCardHeader>
    <BaseCardContent>
      <ul v-if="item">
        <li v-if="workItemAdvices.includes(2)">
          <p>Related Work Items labelled UKRDC should be resolved first. See below.</p>
        </li>
        <li v-if="workItemAdvices.includes(4)">
          <p>
            You may need to use PatientView, RaDaR, or DemoGraphicGenerator.exe to issue a demographic update before
            closing this Work Item.
          </p>
        </li>
        <li v-if="workItemAdvices.includes(5)">
          <p class="mb-1">
            Check the <span class="font-bold text-indigo-600">Proposed Merge</span> below, then click
            <span class="font-bold text-yellow-600">Merge Master Records</span> if the link is valid.
          </p>
          <p>
            You may need to use PatientView, RaDaR, or DemoGraphicGenerator.exe to issue a demographic update before
            merging records.
          </p>
        </li>
        <li v-if="workItemAdvices.includes(6)">
          <p>
            This Work Item was recently merged, and can now be
            <span class="font-bold text-green-600">closed</span>.
          </p>
        </li>
        <li v-if="workItemAdvices.includes(7)">
          <p>A previous merge may have been completed but Person record data was not correctly updated to match.</p>
        </li>
        <li v-if="workItemAdvices.includes(9)">
          <p>
            See
            <a
              href="https://confluence.ukrdc.org/display/TNG/Person+matched+by+facility%2C+extract+and+national+id+-+not+matched+by+demographics"
              target="_blank"
            >
              documentation on Confluence
            </a>
            for advice on resolving this work item.
          </p>
        </li>
        <li v-if="workItemAdvices.includes(10)">
          <p>This Work Item is already closed. No further action to be taken.</p>
        </li>
        <li v-if="workItemAdvices.includes(11)"><p>Related Work Items are still unresolved. See below.</p></li>
        <li v-if="workItemAdvices.includes(12)">
          <p>The records associated with this Work Item may have already been merged.</p>
          <p>
            The destination record is missing, meaning it has either been deleted, or merged into another record
            already.
          </p>
          <p>
            This Work item can likely be <span class="font-bold text-green-600">closed</span> without further action.
          </p>
        </li>
      </ul>
      <div v-else>
        <BaseSkeleText class="mb-2 h-6 w-full" />
        <BaseSkeleText class="mb-2 h-6 w-1/2" />
        <BaseSkeleText class="mb-2 h-6 w-3/4" />
      </div>
    </BaseCardContent>
  </BaseCard>
</template>

<script lang="ts">
import { computed, defineComponent, useRoute } from "@nuxtjs/composition-api";
import { WorkItemExtendedSchema, WorkItemSchema } from "@ukkidney/ukrdc-axios-ts";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";
import BaseCardContent from "~/components/base/BaseCardContent.vue";
import BaseSkeleText from "~/components/base/BaseSkeleText.vue";
import {
  collectionIsUnresolved,
  workItemIsMergable,
  workItemIsOpen,
  workItemIsSecondary,
  workItemIsUKRDC,
} from "~/helpers/workItemUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseCardContent,
    BaseCardHeader,
    BaseSkeleText,
  },
  props: {
    item: {
      type: Object as () => WorkItemExtendedSchema,
      required: false,
      default: undefined,
    },
    related: {
      type: Array as () => WorkItemSchema[],
      required: false,
      default: () => [],
    },
  },
  setup(props) {
    const workItemAdvices = computed(() => {
      const route = useRoute();

      const advices: number[] = [];

      // If we have no Work Item record, return early
      if (!props.item) {
        return [];
      }

      // If workitem is closed
      if (!workItemIsOpen(props.item)) {
        // If items in the collection are still open
        if (collectionIsUnresolved(props.related)) {
          // Advise to close related items
          advices.push(11);
        } else {
          // Advise no further action
          advices.push(10);
        }
        // If item is an open type 9
      } else if (props.item.type === 9) {
        // Advise link to type 9 documentation
        advices.push(9);
        // If item is an open type 3 or 6
      } else if (workItemIsUKRDC(props.item)) {
        // If the workitem has records to merge
        if (workItemIsMergable(props.item)) {
          // Advise to check/update demographics, then merge and close
          advices.push(5);
          // If the workitem has no records to merge, but was just merged
        } else if (route.value.query.justMerged === "true") {
          // Advise to close the workitem
          advices.push(6);
          // If the workitem has no destination record, but was not just merged
        } else if (!props.item.masterRecord) {
          // Advise that the records may have been previously deleted or merged
          advices.push(12);
          // If the workitem has no records to merge, but was NOT just merged
        } else {
          // Advise that merge may have been completed with incorrect data
          advices.push(7);
        }
        // If item is an open type 4 or 7, and is secondary to others in the collection
      } else if (workItemIsSecondary(props.item, props.related)) {
        // Advise to close related UKRDC items first
        advices.push(2);
      } else {
        advices.push(4);
      }

      return advices;
    });
    return { workItemAdvices };
  },
});
</script>

<style lang="postcss">
a {
  @apply text-indigo-600;
}
</style>
