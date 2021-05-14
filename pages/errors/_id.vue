<template>
  <div>
    <div class="mb-6">
      <TextH1 v-if="error">
        Error {{ error.id }} from {{ error.facility }}
      </TextH1>
      <SkeleText v-else class="h-8 w-1/4 mb-2" />
      <TextL1 v-if="error">
        {{ error.error }}
      </TextL1>
      <SkeleText v-else class="h-4 w-1/2" />
    </div>

    <!-- Header card -->
    <GenericCard class="mb-4">
      <GenericCardContent>
        <GenericDl>
          <GenericDi>
            <TextDt>Facility</TextDt>
            <TextDd v-if="error">
              {{ error.facility }}
            </TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
          <GenericDi>
            <TextDt>Recieved</TextDt>
            <TextDd v-if="error">
              {{
                error.received ? formatDate(error.received) : 'Unknown'
              }}</TextDd
            >
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
          <GenericDi>
            <TextDt>Filename</TextDt>
            <TextDd v-if="error">
              {{ error.filename }}
            </TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
          <GenericDi class="sm:col-span-2">
            <TextDt>Error Message</TextDt>
            <TextDd v-if="error">
              {{ error.error }}
            </TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
        </GenericDl>
      </GenericCardContent>
    </GenericCard>

    <!-- Related Master Records card -->
    <GenericCard v-if="error && error.masterRecords.length > 0" class="mt-4">
      <GenericCardHeader>
        <TextH2> Related Records </TextH2>
      </GenericCardHeader>
      <ul class="divide-y divide-gray-200">
        <masterrecordsListItem
          v-for="item in error.masterRecords"
          :key="item.id"
          :item="item"
        />
      </ul>
    </GenericCard>

    <!-- Related Work Items card -->
    <GenericCard v-if="error && error.workItems.length > 0" class="mt-4">
      <GenericCardHeader>
        <TextH2> Related Work Items </TextH2>
      </GenericCardHeader>
      <ul class="divide-y divide-gray-200">
        <workitemsListItem
          v-for="item in error.workItems"
          :key="item.id"
          :item="item"
        />
      </ul>
    </GenericCard>

    <!-- Mirth Messages card -->
    <GenericCard v-if="mirthMessage" class="mt-4">
      <GenericCardHeader>
        <TextH2> Mirth Messages </TextH2>
      </GenericCardHeader>
      <ul class="divide-y divide-gray-200">
        <MirthMessageListItem :message="mirthMessage" />
      </ul>
    </GenericCard>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useRoute,
  useFetch,
  useContext,
} from '@nuxtjs/composition-api'

import { ExtendedError } from '@/interfaces/errors'
import { ChannelMessage } from '@/interfaces/mirth'

import { formatDate } from '@/utilities/dateUtils'
import { isEmptyObject } from '@/utilities/objectUtils'

export default defineComponent({
  setup() {
    const route = useRoute()
    const { $axios, $config, $hasPermission } = useContext()

    const error = ref<ExtendedError>()
    const mirthMessage = ref<ChannelMessage>()

    useFetch(async () => {
      // Get the main record data
      const path = `${$config.apiBase}/errors/messages/${route.value.params.id}/`
      const res: ExtendedError = await $axios.$get(path)
      error.value = res

      // Conditionally get the Mirth message data
      if ($hasPermission('ukrdc:mirth:read')) {
        const path = error.value.links.source
        const res: ChannelMessage = await $axios.$get(path)
        mirthMessage.value = res
      }
    })

    return {
      error,
      mirthMessage,
      isEmptyObject,
      formatDate,
    }
  },
})
</script>
