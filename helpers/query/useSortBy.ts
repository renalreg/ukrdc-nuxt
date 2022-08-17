import { computed } from "@nuxtjs/composition-api";
import useQuery from "~/helpers/query/useQuery";

export default function () {
  const { stringQuery } = useQuery();

  const orderBy = stringQuery("order_by", "desc", false, true);

  const orderAscending = computed(() => {
    if (orderBy.value === "asc") {
      return true;
    } else {
      return false;
    }
  });

  function toggleOrder(): string {
    if (orderBy.value === "asc") {
      orderBy.value = "desc";
    } else {
      orderBy.value = "asc";
    }
    return orderBy.value;
  }
  return {
    orderAscending,
    orderBy,
    toggleOrder,
  };
}
