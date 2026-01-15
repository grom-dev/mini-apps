import type { Bridge } from './Bridge.ts'
import type { UnsubscribeFn } from './internal/EventBus.ts'

/**
 * Module for controlling the back button.
 */
export interface BackButton {
  setVisible: (visible: boolean) => void
  onClick: (listener: () => void) => UnsubscribeFn
  offClick: (listener: any) => void
}

export interface InitOptions {
  bridge: Bridge
}

export const init = ({
  bridge,
}: InitOptions): BackButton => {
  return {
    setVisible: (visible) => {
      bridge.emit('setup_back_button', { is_visible: visible })
    },
    onClick: (listener) => {
      return bridge.on('back_button_pressed', listener)
    },
    offClick: (listener) => {
      bridge.off('back_button_pressed', listener)
    },
  }
}
