import { DateTime } from 'luxon'

export function nowString(addDays: number = 0): string {
  return DateTime.now().plus({ days: addDays }).toISO()
}

export function formatDate(rawDate: string, t: boolean = true): string {
  return DateTime.fromISO(rawDate).toLocaleString(t ? DateTime.DATETIME_SHORT : DateTime.DATE_SHORT)
}

export interface DateRange {
  start: string | null
  end: string | null
}
