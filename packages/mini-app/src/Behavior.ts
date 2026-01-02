import type { Bridge } from './Bridge.ts'
import type { SessionStorage } from './SessionStorage.ts'
import { Effect, Store } from '@tanstack/store'

export interface Behavior {
  stateStore: Store<State>
}

export interface State {
  closingConfirmationEnabled: boolean
  verticalSwipeEnabled: boolean
  orientationLocked: boolean
}

export interface InitOptions {
  storage: SessionStorage
  bridge: Bridge
}

export const init = ({
  storage,
  bridge,
}: InitOptions): Behavior => {
  const storedState = storage.storedState<State>('Behavior')
  const stateStore = new Store<State>(storedState.load() ?? {
    closingConfirmationEnabled: false,
    verticalSwipeEnabled: true,
    orientationLocked: false,
  })
  const flushEffect = new Effect({
    fn: () => {
      const state = stateStore.state
      bridge.emit('setup_closing_behavior', {
        need_confirmation: state.closingConfirmationEnabled,
      })
      bridge.emit('setup_swipe_behavior', {
        allow_vertical_swipe: state.verticalSwipeEnabled,
      })
      bridge.emit('toggle_orientation_lock', {
        locked: state.orientationLocked,
      })
      storedState.save(state)
    },
    deps: [stateStore],
  })
  flushEffect.mount()
  return { stateStore }
}
