<template>
  <div>
    <GenericModalMaxSlot ref="errorSourceGenericModalMaxSlot">
      <GenericCodeReader
        v-if="source && source.content"
        :content="source.content"
        :content-type="source.contentType"
        class="h-full box-border flex flex-col overflow-x-scroll"
      />
      <div v-else class="w-full h-full flex">
        <div class="w-full text-center mb-auto mt-auto">Missing or empty source file</div>
      </div>
    </GenericModalMaxSlot>

    <div class="mb-6 flex items-end gap-4">
      <div class="flex-grow">
        <TextH1 v-if="error">
          {{ error.msgStatus === 'ERROR' ? 'Error' : 'Message' }} {{ error.id }} from {{ error.facility }}
        </TextH1>
        <SkeleText v-else class="h-8 w-1/4 mb-2" />
        <TextL1 v-if="error" class="line-clamp-1">
          {{ error.error }}
        </TextL1>
        <SkeleText v-else class="h-4 w-1/2" />
      </div>
      <div>
        <GenericButton class="w-48" @click="fetchAndShowSource">{{ sourceButtonLabel }}</GenericButton>
      </div>
    </div>

    <!-- Header card -->
    <GenericCard class="mb-4">
      <GenericCardContent>
        <GenericDl>
          <GenericDi>
            <TextDt>Channel</TextDt>
            <TextDd v-if="error">
              {{ error.channel ? error.channel : error.channelId }}
            </TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
          <GenericDi>
            <TextDt>Recieved</TextDt>
            <TextDd v-if="error"> {{ error.received ? formatDate(error.received) : 'Unknown' }}</TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
          <GenericDi>
            <TextDt>Filename</TextDt>
            <TextDd v-if="error">
              {{ error.filename }}
            </TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
          <GenericDi>
            <TextDt>Facility</TextDt>
            <TextDd v-if="error">
              {{ error.facility }}
            </TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
          <GenericDi>
            <TextDt>Status</TextDt>
            <TextDd v-if="error">
              {{ error.msgStatus }}
            </TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
          <GenericDi v-if="error && error.error" class="sm:col-span-2">
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
    <GenericCard v-if="masterRecords.length > 0" class="mt-4">
      <GenericCardHeader>
        <TextH2> Related Records </TextH2>
      </GenericCardHeader>
      <ul class="divide-y divide-gray-200">
        <div v-for="item in masterRecords" :key="item.id" class="hover:bg-gray-50">
          <NuxtLink :to="`/masterrecords/${item.id}`">
            <MasterrecordsListItem :item="item" />
          </NuxtLink>
        </div>
      </ul>
    </GenericCard>

    <!-- Related Work Items card -->
    <GenericCard v-if="workItems.length > 0" class="mt-4">
      <GenericCardHeader>
        <TextH2> Related Work Items </TextH2>
      </GenericCardHeader>
      <ul class="divide-y divide-gray-200">
        <workitemsListItem v-for="item in workItems" :key="item.id" :item="item" />
      </ul>
    </GenericCard>

    <!-- Mirth Messages card -->
    <GenericCard v-if="mirthMessage" class="mt-4">
      <GenericCardHeader>
        <TextH2> Mirth Messages </TextH2>
      </GenericCardHeader>
      <ul class="divide-y divide-gray-200">
        <div class="hover:bg-gray-50">
          <NuxtLink :to="`/mirth/messages/${mirthMessage.channelId}/${mirthMessage.messageId}`">
            <MirthMessageListItem :message="mirthMessage" />
          </NuxtLink>
        </div>
      </ul>
    </GenericCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useRoute, useFetch, useContext, useMeta } from '@nuxtjs/composition-api'

import { Message, ErrorSource } from '@/interfaces/errors'
import { ChannelMessage } from '@/interfaces/mirth'
import { MasterRecord } from '@/interfaces/masterrecord'
import { WorkItemShort } from '@/interfaces/workitem'

import { formatDate } from '@/utilities/dateUtils'
import { isEmptyObject } from '@/utilities/objectUtils'
import { modalInterface } from '~/interfaces/modal'

import usePermissions from '~/mixins/usePermissions'

export default defineComponent({
  setup() {
    const route = useRoute()
    const { $axios, $config } = useContext()
    const { hasPermission } = usePermissions()

    // Head
    const { title } = useMeta()
    title.value = `Error ${route.value.params.id}`

    const error = ref<Message>()
    const source = ref<ErrorSource>()
    const mirthMessage = ref<ChannelMessage>()
    const workItems = ref([] as WorkItemShort[])
    const masterRecords = ref([] as MasterRecord[])

    // Modal visibility
    const errorSourceGenericModalMaxSlot = ref<modalInterface>()
    const sourceButtonLabel = ref('Show Source')

    useFetch(async () => {
      // Get the main record data
      const path = `${$config.apiBase}/v1/errors/messages/${route.value.params.id}/`
      const res: Message = await $axios.$get(path)
      error.value = res

      // Get auxilalry record data
      if (hasPermission('ukrdc:records:read')) {
        masterRecords.value = await $axios.$get(error.value.links.masterrecords)
      }
      if (hasPermission('ukrdc:workitems:read')) {
        workItems.value = await $axios.$get(error.value.links.workitems)
      }

      // Conditionally get the Mirth message data
      if (hasPermission('ukrdc:mirth:read')) {
        const mirthPath = error.value.links.mirth
        const mirthRes: ChannelMessage = await $axios.$get(mirthPath)
        mirthMessage.value = mirthRes
      }
    })

    async function fetchSource() {
      if (!source.value) {
        sourceButtonLabel.value = 'Loading...'
        const sourcePath = error.value?.links.source
        if (sourcePath) {
          const sourceRes: ErrorSource = await $axios.$get(sourcePath)
          source.value = sourceRes
        }
        sourceButtonLabel.value = 'Show Source'
      }
    }

    // Get and show source
    async function fetchAndShowSource() {
      await fetchSource()
      errorSourceGenericModalMaxSlot.value?.show()
    }

    return {
      error,
      source,
      mirthMessage,
      workItems,
      masterRecords,
      isEmptyObject,
      formatDate,
      errorSourceGenericModalMaxSlot,
      sourceButtonLabel,
      fetchAndShowSource,
    }
  },
  head: {
    title: 'Error',
  },
})
</script>
