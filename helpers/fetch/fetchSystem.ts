import { useContext } from "@nuxtjs/composition-api";

interface serverSystemInfo {
  githubRef: string;
  githubSha: string;
  deploymentEnv: string;
}

export default function () {
  const { $api } = useContext();

  async function fetchServerInfo(): Promise<serverSystemInfo> {
    return (await $api.$get("/v1/system/info/")) as serverSystemInfo;
  }

  return { fetchServerInfo };
}
