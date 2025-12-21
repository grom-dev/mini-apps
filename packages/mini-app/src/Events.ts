import type { ThemeParams } from './LaunchParams.ts'

/**
 * Event types that can be received by the mini app from the client.
 *
 * @see https://core.telegram.org/api/bots/webapps#incoming-events-client-to-mini-app
 */
export interface IncomingEventMap {
  back_button_pressed: void

  settings_button_pressed: void

  theme_changed: {
    theme_params: ThemeParams
  }
}

/**
 * Event types that can be emitted by the mini app to the client.
 *
 * @see https://core.telegram.org/api/web-events#event-apis
 */
export interface OutgoingEventMap {
  web_app_close: void | {
    return_back?: boolean
  }

  web_app_expand: void

  web_app_request_viewport: void

  web_app_request_theme: void

  web_app_ready: void

  web_app_setup_back_button: {
    is_visible: boolean
  }

  web_app_setup_settings_button: {
    is_visible: boolean
  }

  web_app_trigger_haptic_feedback:
    | { type: 'impact', impact_style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' }
    | { type: 'notification', notification_type: 'error' | 'success' | 'warning' }
    | { type: 'selection_change' }
}
