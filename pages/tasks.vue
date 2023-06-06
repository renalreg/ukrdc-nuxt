<template>
  <div>
    <h1 class="mb-4">Background Tasks</h1>

    <BaseTable class="mb-4">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left">Name</th>
          <th scope="col" class="px-6 py-3 text-left">Visibility</th>
          <th scope="col" class="px-6 py-3 text-left">Started By</th>
          <th scope="col" class="px-6 py-3 text-left">Started</th>
          <th scope="col" class="px-6 py-3 text-left">Finished</th>
          <th scope="col" class="px-6 py-3 text-left">Status</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-300 bg-white">
        <tr v-for="task in tasks" :key="task.id">
          <BaseTableCell class="font-medium text-gray-900">{{ task.name }}</BaseTableCell>
          <BaseTableCell><BadgePublicPrivate :visibility="task.visibility" /></BaseTableCell>
          <BaseTableCell>{{ task.owner }}</BaseTableCell>
          <BaseTableCell>{{ task.started ? formatDate(task.started) : "Unknown start time" }}</BaseTableCell>
          <BaseTableCell>{{ task.finished ? formatDate(task.finished) : "" }}</BaseTableCell>
          <BaseTableCell>
            <div class="flex gap-1">
              <BadgeTaskStatus :status="task.status" />
              <BaseInfoTooltip v-if="task.error" class="inline">
                <p><b>Task failed with error: </b>{{ task.error }}</p>
              </BaseInfoTooltip>
            </div>
          </BaseTableCell>
        </tr>
      </tbody>
    </BaseTable>

    <div v-if="tasks && tasks.length > 0" class="mb-4">
      <BaseCard>
        <BasePaginator :page="page" :size="size" :total="total" @next="page++" @prev="page--" @jump="page = $event" />
      </BaseCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { TrackableTaskSchema } from "@ukkidney/ukrdc-axios-ts";

import BadgePublicPrivate from "~/components/BadgePublicPrivate.vue";
import BadgeTaskStatus from "~/components/BadgeTaskStatus.vue";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseInfoTooltip from "~/components/base/BaseInfoTooltip.vue";
import BasePaginator from "~/components/base/BasePaginator.vue";
import BaseTable from "~/components/base/BaseTable.vue";
import BaseTableCell from "~/components/base/BaseTableCell.vue";
import usePagination from "~/composables/query/usePagination";
import useTasks from "~/composables/useTasks";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseTable,
    BaseTableCell,
    BasePaginator,
    BaseInfoTooltip,
    BadgePublicPrivate,
    BadgeTaskStatus,
  },
  setup() {
    const { page, total, size } = usePagination();
    const { fetchTasksList } = useTasks();

    // Data refs
    const tasks = ref([] as TrackableTaskSchema[]);

    // Data fetching

    async function getTasks() {
      const tasksPage = await fetchTasksList(page.value || 1, size.value);
      tasks.value = tasksPage.items;
      total.value = tasksPage.total;
      page.value = tasksPage.page ?? 0;
      size.value = tasksPage.size ?? 0;
    }

    onMounted(async () => {
      await getTasks();
    });

    return {
      formatDate,
      page,
      total,
      size,
      tasks,
    };
  },
  head: {
    title: "Background Tasks",
  },
});
</script>
