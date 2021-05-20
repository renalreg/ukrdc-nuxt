<template>
  <!-- Related errors card -->
  <GenericCard v-if="relatedErrors && relatedErrors.length > 0">
    <GenericCardHeader>
      <TextH2> {{ title }} </TextH2>
    </GenericCardHeader>
    <ul class="divide-y divide-gray-200">
      <errorsListItem
        v-for="item in relatedErrors"
        :key="item.id"
        :item="item"
      />
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
import {
  defineComponent,
  onMounted,
  ref,
  useContext,
  watch,
} from '@nuxtjs/composition-api'
import { Message } from '~/interfaces/errors'

export default defineComponent({
  props: {
    errorsUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
      default: 'Related Errors',
    },
    size: {
      type: Number,
      required: false,
      default: 10,
    },
  },
  setup(props) {
    // Dependencies
    const { $axios } = useContext()

    // Related errors data
    const relatedErrors = ref([] as Message[])
    const relatedErrorsPage = ref(0)
    const relatedErrorsSize = ref(props.size)
    const relatedErrorsTotal = ref(0)

    async function updateRelatedErrors(): Promise<void> {
      const res = await $axios.$get(
        props.errorsUrl +
          `?page=${relatedErrorsPage.value}&size=${relatedErrorsSize.value}`
      )
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
