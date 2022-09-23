<template>
  <div>
    <TextH1 class="mb-4">Background Tasks</TextH1>

    <GenericTable class="mb-4">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left">
            <TextTh>Name</TextTh>
          </th>
          <th scope="col" class="px-6 py-3 text-left">
            <TextTh>Visibility</TextTh>
          </th>
          <th scope="col" class="px-6 py-3 text-left">
            <TextTh>Started By</TextTh>
          </th>
          <th scope="col" class="px-6 py-3 text-left">
            <TextTh>Started</TextTh>
          </th>
          <th scope="col" class="px-6 py-3 text-left">
            <TextTh>Finished</TextTh>
          </th>
          <th scope="col" class="px-6 py-3 text-left">
            <TextTh>Status</TextTh>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr v-for="task in tasks" :key="task.id">
          <GenericTableCell class="font-medium text-gray-900">{{ task.name }}</GenericTableCell>
          <GenericTableCell><BadgePublicPrivate :visibility="task.visibility" /></GenericTableCell>
          <GenericTableCell>{{ task.owner }}</GenericTableCell>
          <GenericTableCell>{{ task.started ? formatDate(task.started) : "Unknown start time" }}</GenericTableCell>
          <GenericTableCell>{{ task.finished ? formatDate(task.finished) : "" }}</GenericTableCell>
          <GenericTableCell>
            <div class="flex gap-1">
              <BadgeTaskStatus :status="task.status" />
              <GenericInfoIcon v-if="task.error" class="inline">
                <p><b>Task failed with error: </b>{{ task.error }}</p>
              </GenericInfoIcon>
            </div>
          </GenericTableCell>
        </tr>
      </tbody>
    </GenericTable>

    <div v-if="tasks && tasks.length > 0" class="mb-4">
      <GenericCard>
        <GenericPaginator
          :page="page"
          :size="size"
          :total="total"
          @next="page++"
          @prev="page--"
          @jump="page = $event"
        />
      </GenericCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";

import { TrackableTaskSchema } from "@ukkidney/ukrdc-axios-ts";
import { formatDate } from "~/helpers/dateUtils";
import useTasks from "~/composables/useTasks";
import usePagination from "~/composables/query/usePagination";

export default defineComponent({
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
      page.value = tasksPage.page;
      size.value = tasksPage.size;
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
