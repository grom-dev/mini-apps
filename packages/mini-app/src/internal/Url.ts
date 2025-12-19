export function parseHashParams(hash: string): Record<string, string | null> {
  hash = hash.replace(/^#/, '')
  if (hash.length === 0) {
    return {}
  }
  if (!hash.includes('=') && !hash.includes('?')) {
    return {}
  }
  const qIndex = hash.indexOf('?')
  if (qIndex >= 0) {
    hash = hash.slice(qIndex + 1)
  }
  return parseQueryString(hash)
}

export function parseQueryString(queryString: string): Record<string, string | null> {
  return Object.fromEntries(
    queryString
      .split('&')
      .map(part => part.split('='))
      .filter(pair => pair[0])
      .map(([name, value]) => [safeDecode(name!), value == null ? null : safeDecode(value)]),
  )
}

export function parseQueryStringWithNestedObjects(
  queryString: string,
): Record<string, string | null | Record<string, unknown> | Array<unknown>> {
  const params = parseQueryString(queryString)
  for (const [key, value] of Object.entries(params)) {
    try {
      if (
        (value?.at(0) === '{' && value?.at(-1) === '}') ||
        (value?.at(0) === '[' && value?.at(-1) === ']')
      ) {
        params[key] = JSON.parse(value)
      }
    }
    catch {}
  }
  return params
}

export function safeDecode(encoded: string): string {
  try {
    return decodeURIComponent(encoded.replace(/\+/g, '%20'))
  }
  catch {
    return encoded
  }
}
