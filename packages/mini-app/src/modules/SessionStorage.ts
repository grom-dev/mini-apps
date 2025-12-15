import * as Di from '../Di.ts'

export const Tag = Di.tag<'SessionStorage', SessionStorage>('SessionStorage')

export interface SessionStorage extends Di.Disposable {
  initStoredState: <T>(key: string) => {
    save: (state: T) => void
    load: () => T | null
    clear: () => void
  }
}

export const init = (options: {
  storage: Storage
  transformKey: (key: string) => string
}): SessionStorage => {
  const { storage, transformKey } = options
  return {
    [Di.DisposeSymbol]: () => {
      storage.clear()
    },
    initStoredState: <T>(key: string) => {
      return {
        save: (state: T) => storage.setItem(transformKey(key), JSON.stringify(state)),
        load: () => JSON.parse(storage.getItem(transformKey(key)) || 'null'),
        clear: () => storage.removeItem(transformKey(key)),
      }
    },
  }
}
