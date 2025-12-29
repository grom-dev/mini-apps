import type { Bridge } from './Bridge.ts'
import type { UnsubscribeFn } from './internal/EventBus.ts'
import type { SessionStorage } from './SessionStorage.ts'
import { Store } from '@tanstack/store'

/**
 * Module for controlling the back button.
 */
export interface BackButton {
  stateStore: Store<State>
  onClick: (listener: () => void) => UnsubscribeFn
  offClick: (listener: any) => void
}

export interface State {
  visible: boolean
}

export interface InitOptions {
  storage: SessionStorage
  bridge: Bridge
}

export const init = ({
  storage,
  bridge,
}: InitOptions): BackButton => {
  const storedState = storage.storedState<State>('BackButton')
  const stateStore = new Store<State>(storedState.load() ?? { visible: false })
  stateStore.subscribe(({ currentVal }) => {
    bridge.emit('setup_back_button', { is_visible: currentVal.visible })
    storedState.save(currentVal)
  })
  return {
    stateStore,
    onClick: (listener) => {
      return bridge.on('back_button_pressed', listener)
    },
    offClick: (listener) => {
      bridge.off('back_button_pressed', listener)
    },
  }
}
