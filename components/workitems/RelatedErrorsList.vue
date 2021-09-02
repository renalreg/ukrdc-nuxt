<template>
  <!-- Related errors card -->
  <GenericCard v-if="relatedErrors && relatedErrors.length > 0">
    <GenericCardHeader>
      <TextH2> Related Errors </TextH2>
    </GenericCardHeader>
    <ul class="divide-y divide-gray-200">
      <div v-for="item in relatedErrors" :key="item.id" :item="item" class="hover:bg-gray-50">
        <NuxtLink :to="`/messages/${item.id}`">
          <ErrorsListItem :item="item" />
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
import { defineComponent, onMounted, ref, useContext, watch } from '@nuxtjs/composition-api'
import { Message } from '@/interfaces/messages'
import { WorkItem } from '~/interfaces/workitem'

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
    status: {
      type: String,
      required: false,
      default: 'ERROR',
    },
  },
  setup(props) {
    // Dependencies
    const { $axios } = useContext()

    // Related errors data
    const relatedErrors = ref([] as Message[])
    const relatedErrorsPage = ref(1)
    const relatedErrorsSize = ref(props.size)
    const relatedErrorsTotal = ref(0)

    async function updateRelatedErrors(): Promise<void> {
      let path = props.workitem.links.messages + `?page=${relatedErrorsPage.value}&size=${relatedErrorsSize.value}`
      if (props.status) {
        path = path + `&status=${props.status}`
      }
      const res = await $axios.$get(path)
      // Set related errors
      relatedErrors.value = res.items
      relatedErrorsPage.value = res.page
      relatedErrorsSize.value = res.size
      relatedErrorsTotal.value = res.total
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
