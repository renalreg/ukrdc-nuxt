import { LinkRecord } from "~/interfaces/linkrecords";

export default function () {
  const { $api } = useNuxtApp();

  async function postEMPIUnlink(personId: number, masterId: number, comment?: string): Promise<LinkRecord> {
    return (await $api.$post("/v1/empi/unlink/", {
      personId,
      masterId,
      comment: comment || "",
    })) as LinkRecord;
  }

  async function postEMPIMerge(supersedingId: number, supersededId: number): Promise<void> {
    return await $api.$post("/v1/empi/merge", {
      superseding: supersedingId,
      superseded: supersededId,
    });
  }

  return { postEMPIUnlink, postEMPIMerge };
}
