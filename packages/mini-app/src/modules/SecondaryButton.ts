import type { Bridge } from '../Bridge'
import type { UnsubscribeFn } from '../internal/EventBus'
import type { StoredState } from '../SessionStorage'
import type { Theme } from './Theme'
import { Effect, Store } from '@tanstack/store'
import * as Color from '../internal/Color'

/**
 * Module for controlling secondary button.
 */
export interface SecondaryButton {
  stateStore: Store<State>
  onClick: (listener: () => void) => UnsubscribeFn
  offClick: (listener: any) => void
}

export interface State {
  text: string
  visible: boolean
  active: boolean
  loading: boolean
  shining: boolean
  position: 'left' | 'right' | 'top' | 'bottom'
  bgColor: string | null
  textColor: string | null
}

const INITIAL_STATE: State = {
  text: 'Cancel',
  visible: false,
  active: true,
  shining: false,
  loading: false,
  position: 'left',
  bgColor: null,
  textColor: null,
}

export const init = (options: {
  bridge: Bridge
  theme: Theme
  storedState: StoredState<State>
}): SecondaryButton => {
  const { bridge, theme, storedState } = options
  const stateStore = new Store<State>(storedState.load() ?? INITIAL_STATE)
  stateStore.subscribe(({ currentVal }) => {
    storedState.save(currentVal)
  })
  const effect = new Effect({
    fn: () => {
      const state = stateStore.state
      const palette = theme.paletteStore.state
      bridge.emit('web_app_setup_secondary_button', {
        text: state.text,
        is_visible: state.visible,
        is_active: state.active,
        is_progress_visible: state.loading,
        has_shine_effect: state.shining,
        position: state.position,
        color: (state.bgColor ? Color.toHex(state.bgColor) : null) ?? palette.bottom_bar_bg_color ?? palette.secondary_bg_color ?? '#ffffff',
        text_color: (state.textColor ? Color.toHex(state.textColor) : null) ?? palette.button_color ?? '#2481cc',
      })
    },
    deps: [stateStore, theme.paletteStore],
  })
  effect.mount()
  return {
    stateStore,
    onClick: (listener) => {
      return bridge.on('secondary_button_pressed', listener)
    },
    offClick: (listener) => {
      bridge.off('secondary_button_pressed', listener)
    },
  }
}
