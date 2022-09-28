import { HistoryPoint } from "@ukkidney/ukrdc-axios-ts";
import { DateTime } from "luxon";

export function getPointDateRange(dateString: string) {
  const startDate = DateTime.fromISO(dateString);
  const endDate = startDate.plus({ days: 1 });
  return { since: startDate.toISO(), until: endDate.toISO() };
}

export function unpackHistoryPoints(historyPoints: HistoryPoint[]) {
  const x: string[] = [];
  const y: number[] = [];
  historyPoints.forEach((point) => {
    x.push(point.time);
    y.push(point.count);
  });
  return { x, y };
}
