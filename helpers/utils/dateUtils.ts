import { DateTime } from "luxon";

export function nowString(addDays: number = 0): string {
  return DateTime.now().plus({ days: addDays }).toISO();
}

export function formatDate(rawDate: string, t: boolean = true, s: boolean = false): string {
  return DateTime.fromISO(rawDate)
    .setLocale("en-GB")
    .toLocaleString(t ? (s ? DateTime.DATETIME_SHORT_WITH_SECONDS : DateTime.DATETIME_SHORT) : DateTime.DATE_SHORT);
}

export interface DateRange {
  start: string | null;
  end: string | null;
}
