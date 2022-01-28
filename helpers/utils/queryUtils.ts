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

export function integerQuery(query: string | (string | null)[]): number | null {
  const queryString = singleQuery(query);
  if (queryString) {
    return parseInt(queryString);
  }
  return null;
}

export function arrayQuery(query: string | number | (string | number | null)[]): (string | number | null)[] {
  // Return a value array form a query string
  // If a single value is passed,
  // oconvert into a one-element array
  if (!Array.isArray(query)) {
    return [query];
  } else {
    return query;
  }
}
