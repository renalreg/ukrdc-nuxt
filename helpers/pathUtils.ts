const isAbsoluteURLRegex = /^(?:\w+:)\/\//;

export function urlCompare(url1: string, url2: string) {
  return url1.replace(/\/$/, "") === url2.replace(/\/$/, "");
}

export function urlStartsWith(url1: string, url2: string) {
  return url1.replace(/\/$/, "").startsWith(url2.replace(/\/$/, ""));
}

export function isAbsolute(url: string) {
  return isAbsoluteURLRegex.test(url);
}
