export function buildCommonDateRangeQuery(since: string | null, until: string | null): string {
  let path = ''
  // Filter by since if it exists
  if (since) {
    path = path + `&since=${since}`
  }
  // Pass `until` to API if it's given
  if (until) {
    path = path + `&until=${until}`
  } else if (since) {
    // If no `until` is given but a `since` is given, then a single date is selected
    // In this case we want to only show that one day, not a dateRange
    path = path + `&until=${since}`
  }
  return path
}
