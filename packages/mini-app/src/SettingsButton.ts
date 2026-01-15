import type { Bridge } from './Bridge.ts'
import type { UnsubscribeFn } from './internal/EventBus.ts'

/**
 * Module for controlling the settings button.
 */
export interface SettingsButton {
  setVisible: (visible: boolean) => void
  onClick: (listener: () => void) => UnsubscribeFn
  offClick: (listener: any) => void
}

export interface InitOptions {
  bridge: Bridge
}

export const init = ({
  bridge,
}: InitOptions): SettingsButton => {
  return {
    setVisible: (visible) => {
      bridge.emit('setup_settings_button', { is_visible: visible })
    },
    onClick: (listener) => {
      return bridge.on('settings_button_pressed', listener)
    },
    offClick: (listener) => {
      bridge.off('settings_button_pressed', listener)
    },
  }
}
