import { useContext } from "@nuxtjs/composition-api";
import { TrackableTask } from "~/interfaces/tasks";

export default function () {
  const { $api } = useContext();

  async function submitTestTask(t: number): Promise<TrackableTask> {
    return (await $api.$post("/v1/debug/create_task/", { time: t })) as TrackableTask;
  }

  async function fetchTasksList(): Promise<TrackableTask[]> {
    return (await $api.$get("/v1/tasks/")) as TrackableTask[];
  }

  async function fetchTask(task: TrackableTask, progress: boolean = true): Promise<TrackableTask> {
    return (await $api.$get(task.links.self, { progress })) as TrackableTask;
  }

  function pollTask(task: TrackableTask, interval: number) {
    interval = interval * 1000 || 500;

    const checkCondition = (resolve: any, reject: any) => {
      // If the condition is met, we're done!
      fetchTask(task, false).then((response) => {
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

  return { submitTestTask, fetchTasksList, fetchTask, pollTask };
}
