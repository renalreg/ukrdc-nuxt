import { useContext } from "@nuxtjs/composition-api";
import { TrackableTask } from "~/interfaces/tasks";

export default function () {
  const { $api } = useContext();

  async function fetchTasksList(): Promise<TrackableTask[]> {
    return (await $api.$get("/v1/tasks/")) as TrackableTask[];
  }

  return { fetchTasksList };
}
