import type { Bridge } from '../Bridge'
import type { UnsubscribeFn } from '../internal/EventBus'
import type { StoredState } from '../SessionStorage'
import type { Theme } from './Theme'
import { Effect, Store } from '@tanstack/store'

export interface MainButton {
  stateStore: Store<State>
  onClick: (listener: () => void) => UnsubscribeFn
  offClick: (listener: any) => void
}

export interface State {
  text: string
  visible: boolean
  loading: boolean
  active: boolean
  shining: boolean
  bgColor: string | null
  textColor: string | null
}

const INITIAL_STATE: State = {
  text: 'Continue',
  visible: false,
  active: true,
  shining: false,
  loading: false,
  bgColor: null,
  textColor: null,
}

export const init = (options: {
  bridge: Bridge
  theme: Theme
  storedState: StoredState<State>
}): MainButton => {
  const { bridge, theme, storedState } = options
  const stateStore = new Store<State>(storedState.load() ?? INITIAL_STATE)
  stateStore.subscribe(({ currentVal }) => {
    storedState.save(currentVal)
  })
  const effect = new Effect({
    fn: () => {
      const state = stateStore.state
      const palette = theme.paletteStore.state
      bridge.emit('web_app_setup_main_button', {
        text: state.text,
        is_visible: state.visible,
        is_active: state.active,
        is_progress_visible: state.loading,
        has_shine_effect: state.shining,
        color: state.bgColor ?? palette.button_color ?? '#2481cc',
        text_color: state.textColor ?? palette.button_text_color ?? '#ffffff',
      })
    },
    deps: [stateStore, theme.paletteStore],
  })
  effect.mount()
  return {
    stateStore,
    onClick: (listener) => {
      return bridge.on('main_button_pressed', listener)
    },
    offClick: (listener) => {
      bridge.off('main_button_pressed', listener)
    },
  }
}
