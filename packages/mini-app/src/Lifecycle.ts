import type { Bridge } from './Bridge.ts'
import type { OutgoingEventMap } from './Events.ts'
import { Store } from '@tanstack/store'

export interface Lifecycle {
  isActiveStore: Store<boolean>
  ready: () => void
  close: (options?: {
    returnBack?: boolean
  }) => void
}

export interface InitOptions {
  bridge: Bridge
}

export const init = ({
  bridge,
}: InitOptions): Lifecycle => {
  const isActiveStore = new Store<boolean>(true)
  bridge.on('visibility_changed', ({ is_visible }) => {
    isActiveStore.setState(is_visible)
  })
  return {
    isActiveStore,
    ready: () => {
      bridge.emit('ready')
    },
    close: (options = {}) => {
      const payload: OutgoingEventMap['close'] = {}
      if (options.returnBack) {
        payload.return_back = true
      }
      bridge.emit('close', payload)
    },
  }
}
