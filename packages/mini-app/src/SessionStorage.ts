export interface SessionStorage {
  storedState: <TState>(key: string) => StoredState<TState>
}

export interface StoredState<TState> {
  save: (state: TState) => void
  load: () => TState | null
  clear: () => void
}

export interface InitOptions {
  storage: Pick<Storage, 'setItem' | 'getItem' | 'removeItem'>
  transformKey: (key: string) => string
}

export const make = ({
  storage,
  transformKey,
}: InitOptions): SessionStorage => {
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
