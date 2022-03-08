<template>
  <div>
    <TextH1 class="mb-4">Background Tasks</TextH1>

    <GenericTable>
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
          <GenericTableCell>{{ formatDate(task.started) }}</GenericTableCell>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";

import { formatDate } from "@/helpers/utils/dateUtils";
import fetchTasks from "~/helpers/fetch/fetchTasks";
import { TrackableTask } from "~/interfaces/tasks";

export default defineComponent({
  setup() {
    const { fetchTasksList } = fetchTasks();

    // Data refs
    const tasks = ref([] as TrackableTask[]);

    // Data fetching

    onMounted(async () => {
      tasks.value = await fetchTasksList();
    });

    return {
      formatDate,
      tasks,
    };
  },
  head: {
    title: "Background Tasks",
  },
});
</script>
