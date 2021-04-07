export function todayString(addDays: number = 0): string {
  const today = new Date()
  today.setDate(today.getDate() + addDays)
  return (
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  )
}

export interface DateRange {
  start: string
  end: string
}
