import { PageTrackableTaskSchema, TrackableTaskSchema } from "@ukkidney/ukrdc-axios-ts";
import useApi from "./useApi";

export default function () {
  const { backgroundTasksApi } = useApi();

  async function fetchTasksList(page: number, size: number): Promise<PageTrackableTaskSchema> {
    return (
      await backgroundTasksApi.getTasks({
        page,
        size,
      })
    ).data;
  }

  async function fetchTask(task: TrackableTaskSchema): Promise<TrackableTaskSchema> {
    return (
      await backgroundTasksApi.getTask({
        taskId: task.id,
      })
    ).data;
  }

  function pollTask(task: TrackableTaskSchema, interval: number) {
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
