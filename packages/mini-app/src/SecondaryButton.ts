import type { Bridge } from './Bridge.ts'
import type { UnsubscribeFn } from './internal/EventBus.ts'
import * as Color from './internal/Color.ts'

/**
 * Module for controlling secondary button.
 */
export interface SecondaryButton {
  setup: (state: null | State) => void
  onClick: (listener: () => void) => UnsubscribeFn
  offClick: (listener: any) => void
}

export interface State {
  text: string
  loading?: boolean
  shining?: boolean
  position?: 'left' | 'right' | 'top' | 'bottom'
  bgColor?: string
  textColor?: string
}

export interface InitOptions {
  bridge: Bridge
}

const PRESS_EVENT = 'secondary_button_pressed'
const SETUP_EVENT = 'setup_secondary_button'

export const init = ({
  bridge,
}: InitOptions): SecondaryButton => {
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
          position: state.position,
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
