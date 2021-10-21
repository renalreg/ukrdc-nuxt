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
        <GenericButton :disabled="fetchSourceInProgress" class="w-48" @click="fetchAndShowSource">{{
          fetchSourceInProgress ? 'Loading...' : 'Show Source'
        }}</GenericButton>
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
            <LinkSendingFacility v-if="error" :code="error.facility" />
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
    <GenericCard v-if="hasPermission('ukrdc:mirth:read')" class="mt-4">
      <GenericCardHeader>
        <TextH2> Mirth Messages </TextH2>
      </GenericCardHeader>
      <ul class="divide-y divide-gray-200">
        <li v-if="mirthMessage" class="hover:bg-gray-50">
          <NuxtLink :to="`/mirth/messages/${mirthMessage.channelId}/${mirthMessage.messageId}`">
            <MirthMessageListItem :message="mirthMessage" />
          </NuxtLink>
        </li>
        <li v-else-if="mirthMessage === undefined">
          <SkeleListItem />
        </li>
      </ul>
    </GenericCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, useContext, useMeta, useRoute } from '@nuxtjs/composition-api'

import { ErrorSource, Message } from '@/interfaces/messages'
import { ChannelMessage } from '@/interfaces/mirth'
import { MasterRecord } from '@/interfaces/masterrecord'
import { WorkItem } from '@/interfaces/workitem'

import { formatDate } from '@/helpers/utils/dateUtils'
import { isEmptyObject } from '@/helpers/utils/objectUtils'
import { modalInterface } from '~/interfaces/modal'

import usePermissions from '~/helpers/usePermissions'
import fetchMessages from '~/helpers/fetch/fetchMessages'

export default defineComponent({
  setup() {
    const route = useRoute()
    const { $toast } = useContext()
    const { hasPermission } = usePermissions()
    const {
      fetchMessage,
      fetchMessageMasterRecords,
      fetchMessageWorkItems,
      fetchMessageMirth,
      fetchMessageSource,
      fetchSourceInProgress,
    } = fetchMessages()

    // Head

    const { title } = useMeta()
    title.value = `Error ${route.value.params.id}`

    // Data refs

    const error = ref<Message>()
    const source = ref<ErrorSource>()
    const mirthMessage = ref<ChannelMessage | null | undefined>(undefined)
    const workItems = ref([] as WorkItem[])
    const masterRecords = ref([] as MasterRecord[])

    // Data fetching

    async function getMessageData() {
      error.value = await fetchMessage(route.value.params.id)

      // Get auxilalry record data
      if (hasPermission('ukrdc:records:read')) {
        masterRecords.value = await fetchMessageMasterRecords(error.value)
      }
      if (hasPermission('ukrdc:workitems:read')) {
        workItems.value = await fetchMessageWorkItems(error.value)
      }

      // Conditionally get the Mirth message data
      if (hasPermission('ukrdc:mirth:read')) {
        try {
          mirthMessage.value = await fetchMessageMirth(error.value)
        } catch (e) {
          mirthMessage.value = null
        }
      }
    }

    onMounted(() => {
      getMessageData()
    })

    // Modal visibility

    const errorSourceGenericModalMaxSlot = ref<modalInterface>()

    async function fetchAndShowSource() {
      if (error.value) {
        try {
          source.value = await fetchMessageSource(error.value)
          errorSourceGenericModalMaxSlot.value?.show()
        } catch (e) {
          if (e.response.status === 404) {
            $toast.show({
              type: 'danger',
              title: 'Error',
              message: e.response.data.detail,
              timeout: 10,
              classTimeout: 'bg-red-600',
            })
          }
        }
      }
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
      fetchSourceInProgress,
      fetchAndShowSource,
      hasPermission,
    }
  },
  head: {
    title: 'Message',
  },
})
</script>
