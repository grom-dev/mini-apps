import type { Bridge } from './Bridge.ts'
import type { LaunchParams } from './LaunchParams.ts'
import type { StoredState } from './SessionStorage.ts'
import { Store } from '@tanstack/store'

/**
 * Module for controlling the fullscreen mode of the mini app.
 */
export interface Fullscreen {
  stateStore: Store<State>
  setFullscreen: (value: boolean) => Promise<{
    isFullscreen: boolean
    error?: 'UNSUPPORTED' | 'ALREADY_FULLSCREEN'
  }>
}

export interface State {
  state: 'fullscreen' | 'not-fullscreen' | 'entering' | 'exiting'
}

const toState = (value: boolean): State['state'] => (value ? 'fullscreen' : 'not-fullscreen')

export const init = (options: {
  launchParams: LaunchParams
  bridge: Bridge
  storedState: StoredState<State>
}): Fullscreen => {
  const { launchParams, bridge, storedState } = options
  const stored = storedState.load()
  const stateStore = new Store<State>({ state: stored?.state ?? toState(launchParams.fullscreen) })
  stateStore.subscribe(({ currentVal }) => {
    storedState.save(currentVal)
  })
  let request: null | {
    promise: ReturnType<Fullscreen['setFullscreen']>
    resolve: (result: Awaited<ReturnType<Fullscreen['setFullscreen']>>) => void
  } = null
  bridge.on('fullscreen_changed', ({ is_fullscreen }) => {
    stateStore.setState({ state: toState(is_fullscreen) })
    if (request) {
      request.resolve({ isFullscreen: is_fullscreen })
      request = null
    }
  })
  bridge.on('fullscreen_failed', ({ error }) => {
    stateStore.setState({ state: toState(error === 'ALREADY_FULLSCREEN') })
    if (request) {
      request.resolve({
        isFullscreen: stateStore.state.state === 'fullscreen',
        error,
      })
      request = null
    }
  })
  return {
    stateStore,
    setFullscreen: (value) => {
      if (request) {
        return request.promise
      }
      if (value) {
        stateStore.setState({ state: 'entering' })
        bridge.emit('web_app_request_fullscreen')
      }
      else {
        stateStore.setState({ state: 'exiting' })
        bridge.emit('web_app_exit_fullscreen')
      }
      request = Promise.withResolvers()
      return request.promise
    },
  }
}
