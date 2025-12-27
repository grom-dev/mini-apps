import type { Bridge } from './Bridge.ts'
import { Store } from '@tanstack/store'

/**
 * Module for controlling mini app viewport.
 */
export interface Viewport {
  stateStore: Store<State>
  safeAreaInsetStore: Store<SafeAreaInset>
  contentSafeAreaInsetStore: Store<ContentSafeAreaInset>
  expand: () => void
}

export interface SafeAreaInset {
  top: number
  bottom: number
  left: number
  right: number
}

export interface ContentSafeAreaInset {
  top: number
  bottom: number
  left: number
  right: number
}

export interface State {
  height: number
  stableHeight: number
  expanded: boolean
  resizing: boolean
}

export interface InitOptions {
  bridge: Bridge
}

export const init = ({
  bridge,
}: InitOptions): Viewport => {
  const stateStore = new Store<State>({
    height: window.innerHeight,
    stableHeight: window.innerHeight,
    expanded: true,
    resizing: false,
  })
  const safeAreaInsetStore = new Store<SafeAreaInset>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  })
  const contentSafeAreaInsetStore = new Store<ContentSafeAreaInset>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  })
  let onWindowResize: (() => void) | null = () => {
    if (window.innerHeight !== stateStore.state.height) {
      stateStore.setState(prev => ({
        height: window.innerHeight,
        stableHeight: window.innerHeight,
        expanded: prev.expanded,
        resizing: false,
      }))
    }
  }
  window.addEventListener('resize', onWindowResize)
  bridge.on('viewport_changed', ({ height, is_state_stable, is_expanded }) => {
    if (onWindowResize) {
      window.removeEventListener('resize', onWindowResize)
      onWindowResize = null
    }
    stateStore.setState(prev => ({
      height,
      stableHeight: is_state_stable ? height : prev.stableHeight,
      expanded: is_expanded,
      resizing: !is_state_stable,
    }))
  })
  bridge.on('safe_area_changed', ({ top, bottom, left, right }) => {
    safeAreaInsetStore.setState({ top, bottom, left, right })
  })
  bridge.on('content_safe_area_changed', ({ top, bottom, left, right }) => {
    contentSafeAreaInsetStore.setState({ top, bottom, left, right })
  })
  bridge.emit('web_app_request_viewport')
  bridge.emit('web_app_request_safe_area')
  bridge.emit('web_app_request_content_safe_area')
  return {
    stateStore,
    safeAreaInsetStore,
    contentSafeAreaInsetStore,
    expand: () => {
      bridge.emit('web_app_expand')
    },
  }
}
