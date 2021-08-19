<template>
  <GenericCard>
    <GenericCardHeader><TextH2>Advice</TextH2></GenericCardHeader>
    <GenericCardContent>
      <ul v-if="item">
        <li v-for="(adviceIndex, index) in workItemAdvices" :key="`advice${index}`" class="mb-2">
          {{ advicesMap[adviceIndex] }}
        </li>
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
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { WorkItemExtended } from '@/interfaces/workitem'
import { workItemIsMergable } from '@/utilities/workItemUtils'

export default defineComponent({
  props: {
    item: {
      type: Object as () => WorkItemExtended,
      required: false,
      default: undefined,
    },
    related: {
      type: Array as () => WorkItemExtended[],
      required: false,
      default: () => [],
    },
  },
  setup(props) {
    const advicesMap = {
      0: 'No advice available.',
      1: 'This Work Item is already closed.',
      2: 'Related Work Items labelled UKRDC should be resolved first. See below.',
      3: 'No new incoming Master Records. This Work Item can probably be closed.',
      4: 'You may need to use DemoGraphicGenerator.exe to issue a demographic update before closing this Work Item.',
      5: 'Check incoming and destination records, then merge the two records if the link is valid.',
    }

    const workItemAdvices = computed(() => {
      const advices: number[] = []
      // If we have a Work Item record
      if (props.item) {
        // If the Work Item is already closed
        if (props.item.status === 3) {
          // Advise that the Work Item is already closed
          advices.push(1)
        }
        // If the Work Item is part of a collection
        if (props.related.length > 0) {
          // For each related Work Item in the collection
          for (const relatedItem of props.related) {
            // If the related Work Item is a mergable UKRDC Work Item
            if (relatedItem.masterRecord.nationalidType === 'UKRDC' && relatedItem.status !== 3) {
              // Advise that the UKRDC item should be resolved first
              advices.push(2)
              break
            }
          }
        }
        // For type 6 or 7 work items
        if (props.item.type === 6 || props.item.type === 7) {
          // If there are no incoming Master Records
          if (props.item.incoming.masterRecords.length === 0) {
            if (props.item.status !== 3) {
              // Advise that the workitem is probably ready to be closed
              advices.push(3)
            }
          } else {
            // Advise that a demographic update may be required
            advices.push(4)
          }
        }
        // For type 3 or 4 work items
        else if (props.item.type === 3 || props.item.type === 4) {
          // If there are no incoming Master Records
          if (props.item.incoming.masterRecords.length === 0) {
            if (props.item.status !== 3) {
              // Advise that the workitem is probably ready to be closed
              advices.push(3)
            }
            // If records are mergable (i.e. both are UKRDC records)
          } else if (workItemIsMergable(props.item)) {
            // Advise that records could be merged
            advices.push(5)
          }
        }
      }

      // Advise if there is no advice available...
      if (advices.length === 0) {
        advices.push(0)
      }

      return advices
    })
    return { workItemAdvices, advicesMap }
  },
})
</script>
