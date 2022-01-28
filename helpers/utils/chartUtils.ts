import { DateTime } from "luxon";
import { HistoryPointEvent } from "~/interfaces/charts";

export function getPointDateRange(point: HistoryPointEvent) {
  const startDate = DateTime.fromMillis(point.x);
  const endDate = startDate.plus({ days: 1 });
  return { since: startDate.toISO(), until: endDate.toISO() };
}
