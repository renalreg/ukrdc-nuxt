import useQuery from "~/helpers/query/useQuery";

export default function () {
  const { integerQuery } = useQuery();

  const pageQuery = integerQuery("page", 1, false);
  const total = ref(0);
  const size = ref(20);

  // Create a new computed ref that returns the current page, but never null.
  // This also guarantees that iterating the page, e.g. page++, will never
  // fail due to trying to iterate a null.
  const page = computed<number>({
    get(): number {
      return pageQuery.value || 1;
    },
    set(newPage: number): void {
      pageQuery.value = newPage;
    },
  });

  return {
    page,
    total,
    size,
  };
}
