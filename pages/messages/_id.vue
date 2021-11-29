<template>
  <div>
    <LoadingIndicatorFull :visible="downloadSourceInProgress || fetchSourceInProgress" />

    <GenericModalMaxSlot ref="messageSourceGenericModalMaxSlot">
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
        <TextH1 v-if="message">
          {{ message.msgStatus === 'ERROR' ? 'Error' : 'Message' }} {{ message.id }} from {{ message.facility }}
        </TextH1>
        <SkeleText v-else class="h-8 w-1/4 mb-2" />
        <TextL1 v-if="message" class="line-clamp-1">
          {{ messageSummary }}
        </TextL1>
        <SkeleText v-else class="h-4 w-1/2" />
      </div>
    </div>

    <!-- Header card -->
    <GenericCard class="mb-4">
      <GenericCardContent>
        <GenericDl>
          <GenericDi>
            <TextDt>Status</TextDt>
            <TextDd v-if="message">
              <MessagesStatusBadge class="flex-shrink mr-2" :message="message" />
            </TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
          <GenericDi>
            <TextDt>Recieved</TextDt>
            <TextDd v-if="message"> {{ message.received ? formatDate(message.received) : 'Unknown' }}</TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
          <GenericDi>
            <TextDt>Facility</TextDt>
            <LinkSendingFacility v-if="message" :code="message.facility" />
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>

          <GenericDi>
            <TextDt>Channel</TextDt>
            <TextDd v-if="message" class="flex items-center gap-1">
              <span>{{ message.channel ? message.channel : message.channelId }}</span>
              <GenericInfoIcon class="inline">
                <p>This is the internal UKRDC channel responsible for processing this message.</p>
                <p>The channel may be important when debugging unexpected errors.</p>
              </GenericInfoIcon>
            </TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
        </GenericDl>
      </GenericCardContent>
    </GenericCard>

    <GenericCard v-if="message" class="mb-4">
      <GenericCardHeader>
        <TextH2>Files</TextH2>
      </GenericCardHeader>
      <GenericCardContent>
        <GenericCardMini class="w-2/3">
          <GenericAttachment :filename="message.filename || `${message.facility}-{message.id}.txt`">
            <TextLink @click="fetchAndShowSource"> View </TextLink>
            <TextLink @click="downloadMessageSource(message)"> Download </TextLink>
          </GenericAttachment>
        </GenericCardMini>
      </GenericCardContent>
    </GenericCard>

    <GenericCard v-if="message && message.error" class="mb-4">
      <GenericCardHeader>
        <TextH2>Error message</TextH2>
      </GenericCardHeader>
      <GenericCardContent>
        <div class="whitespace-pre-wrap font-mono">{{ message.error.trim() }}</div>
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
import { computed, defineComponent, onMounted, ref, useContext, useMeta, useRoute } from '@nuxtjs/composition-api'

import { ErrorSource, Message } from '@/interfaces/messages'
import { ChannelMessage } from '@/interfaces/mirth'
import { MasterRecord } from '@/interfaces/masterrecord'
import { WorkItem } from '@/interfaces/workitem'
import { modalInterface } from '~/interfaces/modal'

import { formatDate } from '@/helpers/utils/dateUtils'
import { isEmptyObject } from '@/helpers/utils/objectUtils'
import { MessageSummary } from '@/helpers/utils/messageUtils'

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
      downloadMessageSource,
      downloadSourceInProgress,
    } = fetchMessages()

    // Head

    const { title } = useMeta()
    title.value = `Error ${route.value.params.id}`

    // Data refs

    const message = ref<Message>()
    const source = ref<ErrorSource>()
    const mirthMessage = ref<ChannelMessage | null | undefined>(undefined)
    const workItems = ref([] as WorkItem[])
    const masterRecords = ref([] as MasterRecord[])

    const messageSummary = computed(() => {
      if (message.value) {
        return MessageSummary(message.value)
      }
      return ''
    })

    // Data fetching

    async function getMessageData() {
      message.value = await fetchMessage(route.value.params.id)

      // Get auxilalry record data
      if (hasPermission('ukrdc:records:read')) {
        masterRecords.value = await fetchMessageMasterRecords(message.value)
      }
      if (hasPermission('ukrdc:workitems:read')) {
        workItems.value = await fetchMessageWorkItems(message.value)
      }

      // Conditionally get the Mirth message data
      if (hasPermission('ukrdc:mirth:read')) {
        try {
          mirthMessage.value = await fetchMessageMirth(message.value)
        } catch (e) {
          mirthMessage.value = null
        }
      }
    }

    onMounted(() => {
      getMessageData()
    })

    // Modal visibility

    const messageSourceGenericModalMaxSlot = ref<modalInterface>()

    async function fetchAndShowSource() {
      if (message.value) {
        try {
          source.value = await fetchMessageSource(message.value)
          messageSourceGenericModalMaxSlot.value?.show()
        } catch (e: any) {
          if (e.response?.status === 404) {
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
      message,
      messageSummary,
      source,
      mirthMessage,
      workItems,
      masterRecords,
      isEmptyObject,
      formatDate,
      messageSourceGenericModalMaxSlot,
      fetchSourceInProgress,
      fetchAndShowSource,
      downloadMessageSource,
      downloadSourceInProgress,
      hasPermission,
    }
  },
  head: {
    title: 'Message',
  },
})
</script>
