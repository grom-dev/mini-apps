import type { Bridge } from './Bridge.ts'
import type { UnsubscribeFn } from './internal/EventBus.ts'
import * as Color from './internal/Color.ts'

/**
 * Module for controlling main button.
 */
export interface MainButton {
  setup: (state: null | State) => void
  onClick: (listener: () => void) => UnsubscribeFn
  offClick: (listener: any) => void
}

export interface State {
  text: string
  loading?: boolean
  shining?: boolean
  bgColor?: string
  textColor?: string
}

export interface InitOptions {
  bridge: Bridge
}

const SETUP_EVENT = 'setup_main_button'
const PRESS_EVENT = 'main_button_pressed'

export const init = ({
  bridge,
}: InitOptions): MainButton => {
  return {
    setup: (state) => {
      if (!state?.text) {
        bridge.emit(SETUP_EVENT, { is_visible: false })
      }
      else {
        bridge.emit(SETUP_EVENT, {
          is_visible: true,
          is_active: true,
          text: state.text,
          is_progress_visible: state.loading,
          has_shine_effect: state.shining,
          color: state.bgColor ? Color.toHexUnsafe(state.bgColor) : undefined,
          text_color: state.textColor ? Color.toHexUnsafe(state.textColor) : undefined,
        })
      }
    },
    onClick: (listener) => {
      return bridge.on(PRESS_EVENT, listener)
    },
    offClick: (listener) => {
      bridge.off(PRESS_EVENT, listener)
    },
  }
}
