import { DateRange } from "~/helpers/utils/dateUtils";
import { singleQuery } from "~/helpers/utils/queryUtils";

export default function () {
  const route = useRoute();
  const router = useRouter();

  function makeDateRange(
    defaultStart: string | null,
    defaultEnd: string | null,
    history: boolean = true,
    resetPage: boolean = true
  ) {
    return computed({
      get: () => {
        return {
          start: singleQuery(route.query.since) || defaultStart,
          end: singleQuery(route.query.until) || defaultEnd,
        };
      },
      set(newRange: DateRange) {
        if (!newRange) {
          return;
        }

        const newQuery = Object.assign({}, route.query, {
          since: newRange.start,
          until: newRange.end,
        });

        if (resetPage) {
          // If we use both date and page to filter, we need to
          // reset the page number
          if (newQuery.page) {
            newQuery.page = "1";
          }
        }

        if (history) {
          router.push({
            path: route.path,
            query: newQuery,
          });
        } else {
          router.replace({
            path: route.path,
            query: newQuery,
          });
        }
      },
    });
  }

  return {
    makeDateRange,
  };
}
