export function todayString(addDays: number = 0): string {
  const today = new Date()
  today.setDate(today.getDate() + addDays)
  return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
}

export function nowString(addDays: number = 0): string {
  const today = new Date()
  today.setDate(today.getDate() + addDays)
  return today.toISOString()
}

export function formatDate(rawDate: string, t: boolean = true): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }
  if (t === true) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }
  return new Date(Date.parse(rawDate)).toLocaleString([], options)
}

export interface DateRange {
  start: string
  end: string
}
