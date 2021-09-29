import type { Context } from '@nuxt/types'

export function parseQuery(queryString: string): Record<string, unknown> {
  const query: { [key: string]: string } = {}
  const pairs = queryString.split('&')
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }
  return query
}

export function encodeQuery(queryObject: { [key: string]: string | number | boolean }): string {
  return Object.entries(queryObject)
    .filter(([_key, value]) => typeof value !== 'undefined')
    .map(([key, value]) => encodeURIComponent(key) + (value != null ? '=' + encodeURIComponent(value) : ''))
    .join('&')
}

export function normalizePath(path = '', ctx?: Context): string {
  // Remove query string
  let result = path.split('?')[0]

  // Remove base path
  if (ctx && ctx.base) {
    result = result.replace(ctx.base, '/')
  }

  // Remove redundant / from the end of path
  if (result.charAt(result.length - 1) === '/') {
    result = result.slice(0, -1)
  }

  // Remove duplicate slashes
  result = result.replace(/\/+/g, '/')

  return result
}

/**
 * Get property defined by dot notation in string.
 * Based on  https://github.com/dy/dotprop (MIT)
 *
 * @param  {Object} holder   Target object where to look property up
 * @param  {string} propName Dot notation, like 'this.a.b.c'
 * @return {*}          A property value
 */
export function getProp(holder: Record<string, any>, propName: string | false): any {
  if (!propName || !holder || typeof holder !== 'object') {
    return holder
  }

  if (propName in holder) {
    return holder[propName]
  }

  const propParts = Array.isArray(propName) ? propName : (propName + '').split('.')

  let result: any = holder
  while (propParts.length && result) {
    result = result[propParts.shift()]
  }

  return result
}
