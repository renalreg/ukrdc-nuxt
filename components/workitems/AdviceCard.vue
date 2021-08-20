<template>
  <GenericCard>
    <GenericCardHeader><TextH2>Advice</TextH2></GenericCardHeader>
    <GenericCardContent>
      <ul v-if="item">
        <li v-if="workItemAdvices.includes(2)">
          <TextP>Related Work Items labelled UKRDC should be resolved first. See below.</TextP>
        </li>
        <li v-if="workItemAdvices.includes(4)">
          <TextP>
            You may need to use PatientView, RaDaR, or DemoGraphicGenerator.exe to issue a demographic update before
            closing this Work Item.
          </TextP>
        </li>
        <li v-if="workItemAdvices.includes(5)">
          <TextP class="mb-1">
            Check the <span class="text-indigo-600 font-bold">Proposed Merge</span> below, then click
            <span class="text-yellow-600 font-bold">Merge Master Records</span> if the link is valid.
          </TextP>
          <TextP>
            You may need to use PatientView, RaDaR, or DemoGraphicGenerator.exe to issue a demographic update before
            merging records.
          </TextP>
        </li>
        <li v-if="workItemAdvices.includes(6)">
          <TextP>This Work Item was recently merged, and can now be closed.</TextP>
        </li>
        <li v-if="workItemAdvices.includes(7)">
          <TextP>
            A previous merge may have been completed but Person record data was not correctly updated to match.
          </TextP>
        </li>
        <li v-if="workItemAdvices.includes(9)">
          <TextP>
            See
            <a
              href="https://confluence.ukrdc.org/display/TNG/Person+matched+by+facility%2C+extract+and+national+id+-+not+matched+by+demographics"
              target="_blank"
            >
              documentation on Confluence
            </a>
            for advice on resolving this work item.
          </TextP>
        </li>
        <li v-if="workItemAdvices.includes(10)">
          <TextP>This Work Item is already closed. No further action to be taken.</TextP>
        </li>
        <li v-if="workItemAdvices.includes(11)"><TextP>Related Work Items are still unresolved. See below.</TextP></li>
      </ul>
      <div v-else>
        <SkeleText class="h-6 mb-2 w-full" />
        <SkeleText class="h-6 mb-2 w-1/2" />
        <SkeleText class="h-6 mb-2 w-3/4" />
      </div>
    </GenericCardContent>
  </GenericCard>
</template>

<script lang="ts">
import { computed, defineComponent, useRoute } from '@nuxtjs/composition-api'
import { WorkItem, WorkItemExtended } from '@/interfaces/workitem'
import {
  collectionIsUnresolved,
  workItemIsMergable,
  workItemIsOpen,
  workItemIsSecondary,
  workItemIsUKRDC,
} from '@/utilities/workItemUtils'

export default defineComponent({
  props: {
    item: {
      type: Object as () => WorkItemExtended,
      required: false,
      default: undefined,
    },
    related: {
      type: Array as () => WorkItem[],
      required: false,
      default: () => [],
    },
  },
  setup(props) {
    const workItemAdvices = computed(() => {
      const route = useRoute()

      const advices: number[] = []

      // If we have no Work Item record, return early
      if (!props.item) {
        return []
      }

      // If workitem is closed
      if (!workItemIsOpen(props.item)) {
        // If items in the collection are still open
        if (collectionIsUnresolved(props.related)) {
          // Advise to close related items
          advices.push(11)
        } else {
          // Advise no further action
          advices.push(10)
        }
        // If item is an open type 9
      } else if (props.item.type === 9) {
        // Advise link to type 9 documentation
        advices.push(9)
        // If item is an open type 3 or 6
      } else if (workItemIsUKRDC(props.item)) {
        // If the workitem has records to merge
        if (workItemIsMergable(props.item)) {
          // Advise to check/update demographics, then merge and close
          advices.push(5)
          // If the workitem has no records to merge, but was just merged
        } else if (route.value.query.justMerged === 'true') {
          // Advise to close the workitem
          advices.push(6)
          // If the workitem has no records to merge, but was NOT just merged
        } else {
          // Advise that merge may have been completed with incorrect data
          advices.push(7)
        }
        // If item is an open type 4 or 7, and is secondary to others in the collection
      } else if (workItemIsSecondary(props.item, props.related)) {
        // Advise to close related UKRDC items first
        advices.push(2)
      } else {
        advices.push(4)
      }

      return advices
    })
    return { workItemAdvices }
  },
})
</script>

<style lang="postcss">
a {
  @apply text-indigo-600;
}
</style>
