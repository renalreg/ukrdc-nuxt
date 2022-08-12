import { useContext } from "@nuxtjs/composition-api";
import { TrackableTask } from "~/interfaces/tasks";

export interface TasksPage {
  items: TrackableTask[];
  total: number;
  page: number;
  size: number;
}

export default function () {
  const { $api } = useContext();

  async function fetchTasksList(page: number, size: number): Promise<TasksPage> {
    return (await $api.$get(`/v1/tasks/?page=${page}&size=${size}`)) as TasksPage;
  }

  async function fetchTask(task: TrackableTask): Promise<TrackableTask> {
    return (await $api.$get(task.links.self)) as TrackableTask;
  }

  function pollTask(task: TrackableTask, interval: number) {
    interval = interval * 1000 || 500;

    const checkCondition = (resolve: any, reject: any) => {
      // If the condition is met, we're done!
      fetchTask(task).then((response) => {
        const status = response.status;
        // If the task ends with success
        if (status === "finished") {
          resolve(response);
        }
        // If task ends with an error
        else if (status === "failed") {
          reject(new Error(response.error));
        } else {
          // Check again after timeout
          setTimeout(checkCondition, interval, resolve, reject);
        }
      });
    };

    return new Promise(checkCondition);
  }

  return { fetchTasksList, fetchTask, pollTask };
}
