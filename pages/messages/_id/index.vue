<template>
  <div>
    <LoadingIndicatorFull :visible="downloadSourceInProgress" />

    <!-- Header card -->
    <GenericCard class="mb-4">
      <GenericCardContent>
        <GenericDlGrid>
          <GenericDlGridItem>
            <TextDt>Status</TextDt>
            <TextDd v-if="message">
              <MessagesStatusBadge class="mr-2 flex-shrink" :message="message" />
            </TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDlGridItem>
          <GenericDlGridItem>
            <TextDt>Recieved</TextDt>
            <TextDd v-if="message"> {{ message.received ? formatDate(message.received) : "Unknown" }}</TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDlGridItem>
          <GenericDlGridItem>
            <TextDt>Facility</TextDt>
            <LinkSendingFacility v-if="message" :code="message.facility" />
            <SkeleText v-else class="h-6 w-full" />
          </GenericDlGridItem>

          <GenericDlGridItem>
            <TextDt>Channel</TextDt>
            <TextDd v-if="message" class="flex items-center gap-1">
              <span>{{ message.channel ? message.channel : message.channelId }}</span>
              <GenericInfoIcon class="inline">
                <p>This is the internal UKRDC channel responsible for processing this message.</p>
                <p>The channel may be important when debugging unexpected errors.</p>
              </GenericInfoIcon>
            </TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDlGridItem>
        </GenericDlGrid>
      </GenericCardContent>
    </GenericCard>

    <GenericCard v-if="message" class="mb-4">
      <GenericCardHeader>
        <TextH2>Files</TextH2>
      </GenericCardHeader>
      <GenericCardContent>
        <GenericCardMini class="w-2/3">
          <GenericAttachment :filename="message.filename || `${message.facility}-${message.id}.txt`">
            <NuxtLink :to="`/messages/${message.id}/source`" class="font-medium"> View </NuxtLink>
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
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";

import { Message } from "@/interfaces/messages";
import { ChannelMessage } from "~/interfaces/mirth";
import { WorkItem } from "~/interfaces/workitem";
import { MasterRecord } from "~/interfaces/masterrecord";

import { formatDate } from "@/helpers/utils/dateUtils";

import fetchMessages from "~/helpers/fetch/fetchMessages";
import usePermissions from "~/helpers/usePermissions";

export default defineComponent({
  props: {
    message: {
      type: Object as () => Message,
      required: true,
    },
  },
  setup(props) {
    const { hasPermission } = usePermissions();
    const {
      fetchMessageMasterRecords,
      fetchMessageWorkItems,
      fetchMessageMirth,
      downloadMessageSource,
      downloadSourceInProgress,
    } = fetchMessages();

    // Data refs
    const mirthMessage = ref<ChannelMessage | null | undefined>(undefined);
    const workItems = ref([] as WorkItem[]);
    const masterRecords = ref([] as MasterRecord[]);

    // Data fetching

    async function getMessageData() {
      // Get auxilalry record data
      if (hasPermission("ukrdc:records:read")) {
        masterRecords.value = await fetchMessageMasterRecords(props.message);
      }
      if (hasPermission("ukrdc:workitems:read")) {
        workItems.value = await fetchMessageWorkItems(props.message);
      }

      // Conditionally get the Mirth message data
      if (hasPermission("ukrdc:mirth:read")) {
        try {
          mirthMessage.value = await fetchMessageMirth(props.message);
        } catch (e) {
          mirthMessage.value = null;
        }
      }
    }

    onMounted(() => {
      getMessageData();
    });

    return {
      masterRecords,
      workItems,
      mirthMessage,
      formatDate,
      downloadMessageSource,
      downloadSourceInProgress,
      hasPermission,
    };
  },
});
</script>
