import { AuditEvent } from '~/interfaces/audit'
import { Message } from '~/interfaces/messages'

export interface MessagePage {
  items: Message[]
  total: number
  page: number
  size: number
}

export interface AuditPage {
  items: AuditEvent[]
  total: number
  page: number
  size: number
}

export function buildCommonDateRangeQuery(since: string | null, until: string | null): string {
  let path = ''
  // Filter by since if it exists
  if (since) {
    path = path + `&since=${encodeURIComponent(since)}`
  }
  // Pass `until` to API if it's given
  if (until) {
    path = path + `&until=${encodeURIComponent(until)}`
  } else if (since) {
    // If no `until` is given but a `since` is given, then a single date is selected
    // In this case we want to only show that one day, not a dateRange
    path = path + `&until=${encodeURIComponent(since)}`
  }
  return path
}

export function buildCommonMessageQuery(
  orderBy: string | null,
  statuses: (string | null)[] | null,
  since: string | null,
  until: string | null
): string {
  let path = ''
  // Order results
  if (orderBy) {
    path = path + `&order_by=${orderBy}`
  }
  // Filter by since-until if it exists
  path = path + buildCommonDateRangeQuery(since, until)
  // Filter by message status
  if (statuses) {
    for (const status of statuses) {
      path = path + `&status=${status}`
    }
  }

  return path
}
