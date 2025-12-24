export interface SessionStorage {
  storedState: <TState>(key: string) => StoredState<TState>
}

export interface StoredState<TState> {
  save: (state: TState) => void
  load: () => TState | null
  clear: () => void
}

export const make = (options: {
  storage: Pick<Storage, 'setItem' | 'getItem' | 'removeItem'>
  transformKey: (key: string) => string
}): SessionStorage => {
  const { storage, transformKey } = options
  return {
    storedState: (key: string) => ({
      save: (state) => {
        storage.setItem(transformKey(key), JSON.stringify(state))
      },
      load: () => {
        const stored = storage.getItem(transformKey(key))
        if (stored) {
          return JSON.parse(stored)
        }
        return null
      },
      clear: () => {
        storage.removeItem(transformKey(key))
      },
    }),
  }
}
