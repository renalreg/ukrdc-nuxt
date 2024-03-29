<template>
  <div>
    <!-- Header card -->
    <BaseCard class="mb-4">
      <BaseCardContent>
        <BaseDescriptionListGrid>
          <BaseDescriptionListGridItem>
            <dt>Status</dt>
            <dd v-if="message">
              <BadgeMessageStatus class="mr-2 flex-shrink" :message="message" />
            </dd>
            <BaseSkeleText v-else class="h-6 w-full" />
          </BaseDescriptionListGridItem>
          <BaseDescriptionListGridItem>
            <dt>Received</dt>
            <dd v-if="message">{{ message.received ? formatDate(message.received) : "Unknown" }}</dd>
            <BaseSkeleText v-else class="h-6 w-full" />
          </BaseDescriptionListGridItem>
          <BaseDescriptionListGridItem>
            <dt>Facility</dt>
            <SendingFacilityLink v-if="message" :code="message.facility" />
            <BaseSkeleText v-else class="h-6 w-full" />
          </BaseDescriptionListGridItem>

          <BaseDescriptionListGridItem>
            <dt>Channel</dt>
            <dd v-if="message" class="flex items-center gap-1">
              <span>{{ message.mirthChannel ? message.mirthChannel : message.mirthChannelId }}</span>
              <BaseInfoTooltip class="inline">
                <p>This is the internal UKRDC channel responsible for processing this message.</p>
                <p>The channel may be important when debugging unexpected errors.</p>
              </BaseInfoTooltip>
            </dd>
            <BaseSkeleText v-else class="h-6 w-full" />
          </BaseDescriptionListGridItem>
        </BaseDescriptionListGrid>
      </BaseCardContent>
    </BaseCard>

    <BaseCard v-if="message" class="mb-4">
      <BaseCardHeader>
        <h2>Files</h2>
      </BaseCardHeader>
      <BaseCardContent>
        <BaseCard class="w-2/3">
          <BaseAttachment :filename="message.filename || `${message.facility}-${message.id}.txt`">
            <NuxtLink :to="`/messages/${message.id}/source`" class="font-medium"> View </NuxtLink>
            <BaseButtonLink class="font-medium" @click="downloadMessageSource"> Download </BaseButtonLink>
          </BaseAttachment>
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

    <!-- Related Patient Records card -->
    <BaseCard v-if="patientRecords.length > 0" class="mt-4">
      <BaseCardHeader>
        <h2>Related Records</h2>
      </BaseCardHeader>
      <ul class="divide-y divide-gray-300">
        <li v-for="item in patientRecords" :key="item.pid">
          <PatientRecordsListItem :item="item" :show-manage-menu="false" />
        </li>
      </ul>
    </BaseCard>

    <!-- Related Work Items card -->
    <BaseCard v-if="workItems.length > 0" class="mt-4">
      <BaseCardHeader>
        <h2>Related Work Items</h2>
      </BaseCardHeader>
      <ul class="divide-y divide-gray-300">
        <li v-for="item in workItems" :key="item.id" :item="item" class="hover:bg-gray-50">
          <NuxtLink :to="`/workitems/${item.id}`">
            <WorkItemsListItem :item="item" />
          </NuxtLink>
        </li>
      </ul>
    </BaseCard>

    <!-- Mirth Messages card -->
    <BaseCard v-if="hasPermission('ukrdc:mirth:read')" class="mt-4">
      <BaseCardHeader>
        <h2>Mirth Messages</h2>
      </BaseCardHeader>
      <ul class="divide-y divide-gray-300">
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
import {
  ChannelMessageModel,
  MessageSchema,
  PatientRecordSummarySchema,
  WorkItemSchema,
} from "@ukkidney/ukrdc-axios-ts";

import BadgeMessageStatus from "~/components/BadgeMessageStatus.vue";
import BaseAttachment from "~/components/base/BaseAttachment.vue";
import BaseButtonLink from "~/components/base/BaseButtonLink.vue";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardContent from "~/components/base/BaseCardContent.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";
import BaseDescriptionListGrid from "~/components/base/BaseDescriptionListGrid.vue";
import BaseDescriptionListGridItem from "~/components/base/BaseDescriptionListGridItem.vue";
import BaseInfoTooltip from "~/components/base/BaseInfoTooltip.vue";
import BaseSkeleListItem from "~/components/base/BaseSkeleListItem.vue";
import BaseSkeleText from "~/components/base/BaseSkeleText.vue";
import MirthMessageListItem from "~/components/MirthMessageListItem.vue";
import PatientRecordsListItem from "~/components/patientrecord/PatientRecordsListItem.vue";
import SendingFacilityLink from "~/components/SendingFacilityLink.vue";
import WorkItemsListItem from "~/components/workitem/WorkItemsListItem.vue";
import useApi from "~/composables/useApi";
import usePermissions from "~/composables/usePermissions";
import useSensitive from "~/composables/useSensitive";
import { formatDate } from "~/helpers/dateUtils";
import { saveAs } from "~/helpers/fileUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseCardContent,
    BaseCardHeader,
    BaseSkeleText,
    BaseSkeleListItem,
    BaseDescriptionListGrid,
    BaseDescriptionListGridItem,
    BaseButtonLink,
    BaseAttachment,
    BaseInfoTooltip,
    SendingFacilityLink,
    PatientRecordsListItem,
    BadgeMessageStatus,
    MirthMessageListItem,
    WorkItemsListItem,
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
    const patientRecords = ref([] as PatientRecordSummarySchema[]);

    const messageText = computed(() => {
      return sensitiveNumbers(props.message.error?.trim());
    });

    // Data fetching

    function getMessageData() {
      // Get auxilalry record data
      if (hasPermission("ukrdc:records:read")) {
        messagesApi
          .getMessagePatientrecords({
            messageId: props.message.id,
          })
          .then((response) => {
            patientRecords.value = response.data;
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
      patientRecords,
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
