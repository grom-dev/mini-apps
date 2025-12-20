import type { StoredState } from './SessionStorage.ts'
import * as Url from './internal/Url.ts'

export type InitParams = Record<string, string | null>

export const init = (options: {
  locationHash: string
  storedState: StoredState<InitParams>
}): InitParams => {
  const { locationHash, storedState } = options
  const params = Url.parseHashParams(locationHash)
  const paramsStored = storedState.load()
  if (paramsStored) {
    for (const [name, storedValue] of Object.entries(paramsStored)) {
      if (params[name] === undefined) {
        params[name] = storedValue
      }
    }
  }
  storedState.save(params)
  return params
}
