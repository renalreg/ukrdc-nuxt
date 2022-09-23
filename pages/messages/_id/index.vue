<template>
  <div>
    <!-- Header card -->
    <BaseCard class="mb-4">
      <BaseCardContent>
        <BaseDlGrid>
          <BaseDlGridItem>
            <dt>Status</dt>
            <dd v-if="message">
              <MessagesStatusBadge class="mr-2 flex-shrink" :message="message" />
            </dd>
            <BaseSkeleText v-else class="h-6 w-full" />
          </BaseDlGridItem>
          <BaseDlGridItem>
            <dt>Received</dt>
            <dd v-if="message">{{ message.received ? formatDate(message.received) : "Unknown" }}</dd>
            <BaseSkeleText v-else class="h-6 w-full" />
          </BaseDlGridItem>
          <BaseDlGridItem>
            <dt>Facility</dt>
            <LinkSendingFacility v-if="message" :code="message.facility" />
            <BaseSkeleText v-else class="h-6 w-full" />
          </BaseDlGridItem>

          <BaseDlGridItem>
            <dt>Channel</dt>
            <dd v-if="message" class="flex items-center gap-1">
              <span>{{ message.mirthChannel ? message.mirthChannel : message.mirthChannelId }}</span>
              <GenericInfoIcon class="inline">
                <p>This is the internal UKRDC channel responsible for processing this message.</p>
                <p>The channel may be important when debugging unexpected errors.</p>
              </GenericInfoIcon>
            </dd>
            <BaseSkeleText v-else class="h-6 w-full" />
          </BaseDlGridItem>
        </BaseDlGrid>
      </BaseCardContent>
    </BaseCard>

    <BaseCard v-if="message" class="mb-4">
      <BaseCardHeader>
        <h2>Files</h2>
      </BaseCardHeader>
      <BaseCardContent>
        <BaseCard class="w-2/3">
          <GenericAttachment :filename="message.filename || `${message.facility}-${message.id}.txt`">
            <NuxtLink :to="`/messages/${message.id}/source`" class="font-medium"> View </NuxtLink>
            <TextLink @click="downloadMessageSource"> Download </TextLink>
          </GenericAttachment>
        </BaseCard>
      </BaseCardContent>
    </BaseCard>

    <BaseCard v-if="message && message.error" class="mb-4">
      <BaseCardHeader>
        <h2>Error message</h2>
      </BaseCardHeader>
      <BaseCardContent>
        <div class="whitespace-pre-wrap font-mono">
          {{ messageText }}
        </div>
      </BaseCardContent>
    </BaseCard>

    <!-- Related Master Records card -->
    <BaseCard v-if="masterRecords.length > 0" class="mt-4">
      <BaseCardHeader>
        <h2>Related Records</h2>
      </BaseCardHeader>
      <ul class="divide-y divide-gray-200">
        <div v-for="item in masterRecords" :key="item.id" class="hover:bg-gray-50">
          <NuxtLink :to="`/masterrecords/${item.id}`">
            <MasterrecordsListItem :item="item" />
          </NuxtLink>
        </div>
      </ul>
    </BaseCard>

    <!-- Related Work Items card -->
    <BaseCard v-if="workItems.length > 0" class="mt-4">
      <BaseCardHeader>
        <h2>Related Work Items</h2>
      </BaseCardHeader>
      <ul class="divide-y divide-gray-200">
        <workitemsListItem v-for="item in workItems" :key="item.id" :item="item" />
      </ul>
    </BaseCard>

    <!-- Mirth Messages card -->
    <BaseCard v-if="hasPermission('ukrdc:mirth:read')" class="mt-4">
      <BaseCardHeader>
        <h2>Mirth Messages</h2>
      </BaseCardHeader>
      <ul class="divide-y divide-gray-200">
        <li v-if="mirthMessage" class="hover:bg-gray-50">
          <NuxtLink :to="`/mirth/messages/${mirthMessage.channelId}/${mirthMessage.messageId}`">
            <MirthMessageListItem :message="mirthMessage" />
          </NuxtLink>
        </li>
        <li v-else-if="mirthMessage === undefined">
          <BaseSkeleListItem />
        </li>
      </ul>
    </BaseCard>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { MasterRecordSchema, MessageSchema, ChannelMessageModel, WorkItemSchema } from "@ukkidney/ukrdc-axios-ts";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardContent from "~/components/base/BaseCardContent.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";
import BaseSkeleText from "~/components/base/BaseSkeleText.vue";
import BaseSkeleListItem from "~/components/base/BaseSkeleListItem.vue";
import BaseDlGrid from "~/components/base/BaseDlGrid.vue";
import BaseDlGridItem from "~/components/base/BaseDlGridItem.vue";

import { formatDate } from "~/helpers/dateUtils";
import usePermissions from "~/composables/usePermissions";
import useApi from "~/composables/useApi";
import useSensitive from "~/composables/useSensitive";
import { saveAs } from "~/helpers/fileUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseCardContent,
    BaseCardHeader,
    BaseSkeleText,
    BaseSkeleListItem,
    BaseDlGrid,
    BaseDlGridItem,
  },
  props: {
    message: {
      type: Object as () => MessageSchema,
      required: true,
    },
  },
  setup(props) {
    const { hasPermission } = usePermissions();
    const { messagesApi, mirthApi } = useApi();
    const { sensitiveNumbers } = useSensitive();

    // Data refs
    const mirthMessage = ref<ChannelMessageModel | null | undefined>(undefined);
    const workItems = ref([] as WorkItemSchema[]);
    const masterRecords = ref([] as MasterRecordSchema[]);

    const messageText = computed(() => {
      return sensitiveNumbers(props.message.error?.trim());
    });

    // Data fetching

    function getMessageData() {
      // Get auxilalry record data
      if (hasPermission("ukrdc:records:read")) {
        messagesApi
          .getMessageMasterrecords({
            messageId: props.message.id,
          })
          .then((response) => {
            masterRecords.value = response.data;
          });
      }
      if (hasPermission("ukrdc:workitems:read")) {
        messagesApi
          .getMessageWorkitems({
            messageId: props.message.id,
          })
          .then((response) => {
            workItems.value = response.data;
          });
      }

      // Conditionally get the Mirth message data
      if (hasPermission("ukrdc:mirth:read")) {
        mirthApi
          .getMirthChannelMessage({
            messageId: props.message.mirthMessageId,
            channelId: props.message.mirthChannelId,
          })
          .then((response) => {
            mirthMessage.value = response.data;
          })
          .catch(() => {
            mirthMessage.value = null;
          });
      }
    }

    function downloadMessageSource() {
      messagesApi
        .getMessageSource({
          messageId: props.message.id,
        })
        .then((response) => {
          const blob = new Blob([response.data.content ? response.data.content : ""]);
          saveAs(blob, props.message.filename || `${props.message.facility}-{message.id}.txt`);
        });
    }

    onMounted(() => {
      getMessageData();
    });

    return {
      masterRecords,
      workItems,
      mirthMessage,
      messageText,
      formatDate,
      downloadMessageSource,
      hasPermission,
    };
  },
});
</script>
