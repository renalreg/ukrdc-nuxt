export function singleQuery(query: string | (string | null)[]): string | null {
  // Return a single value form a query string
  // If multiple values are passed as an array,
  // only the zeroth value is returned
  if (Array.isArray(query)) {
    return query[0];
  } else {
    return query;
  }
}
