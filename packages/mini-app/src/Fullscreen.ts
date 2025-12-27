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

export interface InitOptions {
  launchParams: LaunchParams
  bridge: Bridge
  storedState: StoredState<State>
}

export const init = ({
  launchParams,
  bridge,
  storedState,
}: InitOptions): Fullscreen => {
  const stored = storedState.load()
  const stateStore = new Store<State>({ state: stored?.state ?? stateFromBool(launchParams.fullscreen) })
  stateStore.subscribe(({ currentVal }) => {
    storedState.save(currentVal)
  })
  let request: null | PromiseWithResolvers<Awaited<ReturnType<Fullscreen['setFullscreen']>>> = null
  bridge.on('fullscreen_changed', ({ is_fullscreen }) => {
    stateStore.setState({ state: stateFromBool(is_fullscreen) })
    if (request) {
      request.resolve({ isFullscreen: is_fullscreen })
      request = null
    }
  })
  bridge.on('fullscreen_failed', ({ error }) => {
    stateStore.setState({ state: stateFromBool(error === 'ALREADY_FULLSCREEN') })
    if (request) {
      request.resolve({
        isFullscreen: boolFromState(stateStore.state.state),
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

function stateFromBool(value: boolean): State['state'] {
  return value ? 'fullscreen' : 'not-fullscreen'
}

function boolFromState(state: State['state']): boolean {
  return state === 'fullscreen'
}
