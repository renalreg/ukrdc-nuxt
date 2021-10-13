<template>
  <!-- Related errors card -->
  <GenericCard v-if="relatedErrors && relatedErrors.length > 0">
    <GenericCardHeader>
      <TextH2> Related Errors </TextH2>
    </GenericCardHeader>
    <ul class="divide-y divide-gray-200">
      <div v-for="item in relatedErrors" :key="item.id" :item="item" class="hover:bg-gray-50">
        <NuxtLink :to="`/messages/${item.id}`">
          <MessagesListItem :item="item" />
        </NuxtLink>
      </div>
    </ul>
    <GenericPaginator
      class="bg-white border-t border-gray-200"
      :page="relatedErrorsPage"
      :size="relatedErrorsSize"
      :total="relatedErrorsTotal"
      @next="relatedErrorsPage++"
      @prev="relatedErrorsPage--"
    />
  </GenericCard>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from '@nuxtjs/composition-api'
import { Message } from '@/interfaces/messages'
import { WorkItem } from '~/interfaces/workitem'
import fetchWorkItems from '~/helpers/fetch/fetchWorkItems'

export default defineComponent({
  props: {
    workitem: {
      type: Object as () => WorkItem,
      required: true,
    },
    size: {
      type: Number,
      required: false,
      default: 10,
    },
  },
  setup(props) {
    // Dependencies
    const { fetchWorkItemMessagesPage } = fetchWorkItems()

    // Related errors data
    const relatedErrors = ref([] as Message[])
    const relatedErrorsPage = ref(1)
    const relatedErrorsSize = ref(props.size)
    const relatedErrorsTotal = ref(0)

    async function updateRelatedErrors(): Promise<void> {
      const errorsPage = await fetchWorkItemMessagesPage(
        props.workitem,
        relatedErrorsPage.value,
        relatedErrorsSize.value,
        null,
        ['ERROR'],
        null,
        null
      )
      // Set related errors
      relatedErrors.value = errorsPage.items
      relatedErrorsPage.value = errorsPage.page
      relatedErrorsSize.value = errorsPage.size
      relatedErrorsTotal.value = errorsPage.total
    }

    onMounted(updateRelatedErrors)

    watch(relatedErrorsPage, () => {
      updateRelatedErrors()
    })

    return {
      relatedErrors,
      relatedErrorsPage,
      relatedErrorsSize,
      relatedErrorsTotal,
    }
  },
})
</script>

<style scoped></style>
