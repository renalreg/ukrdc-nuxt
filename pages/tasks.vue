<template>
  <div>
    <h1 class="mb-4">Background Tasks</h1>

    <BaseTable class="mb-4">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Visibility</th>
          <th scope="col">Started By</th>
          <th scope="col">Started</th>
          <th scope="col">Finished</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-300 bg-white">
        <tr v-for="task in tasks" :key="task.id">
          <td class="truncate font-medium">{{ task.name }}</td>
          <td><BadgePublicPrivate :visibility="task.visibility" /></td>
          <td>{{ task.owner }}</td>
          <td>{{ task.started ? formatDate(task.started) : "Unknown start time" }}</td>
          <td>{{ task.finished ? formatDate(task.finished) : "" }}</td>
          <td>
            <div class="flex gap-1">
              <BadgeTaskStatus :status="task.status" />
              <BaseInfoTooltip v-if="task.error" class="inline">
                <p><b>Task failed with error: </b>{{ task.error }}</p>
              </BaseInfoTooltip>
            </div>
          </td>
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
import usePagination from "~/composables/query/usePagination";
import useTasks from "~/composables/useTasks";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseTable,
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

<style scoped lang="postcss">
th {
  @apply px-6 py-3;
}
td {
  @apply whitespace-nowrap px-6 py-3;
}
</style>
