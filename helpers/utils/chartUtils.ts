import { DateTime } from "luxon";

export function getPointDateRange(dateString: string) {
  const startDate = DateTime.fromISO(dateString);
  const endDate = startDate.plus({ days: 1 });
  return { since: startDate.toISO(), until: endDate.toISO() };
}
