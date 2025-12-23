import type { ThemeParams } from './LaunchParams.ts'

/**
 * Event types that can be received by the mini app from the client.
 *
 * @see https://core.telegram.org/api/bots/webapps#incoming-events-client-to-mini-app
 */
export interface IncomingEventMap {
  main_button_pressed: void

  secondary_button_pressed: void

  back_button_pressed: void

  settings_button_pressed: void

  viewport_changed: {
    height: number
    is_state_stable: boolean
    is_expanded: boolean
  }

  theme_changed: {
    theme_params: ThemeParams
  }

  safe_area_changed: {
    top: number
    bottom: number
    left: number
    right: number
  }

  content_safe_area_changed: {
    top: number
    bottom: number
    left: number
    right: number
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

  web_app_setup_main_button: {
    is_visible?: boolean
    is_active?: boolean
    text: string
    color?: string
    text_color?: string
    is_progress_visible?: boolean
    has_shine_effect?: boolean
  }

  web_app_setup_secondary_button: {
    is_visible?: boolean
    is_active?: boolean
    text: string
    color?: string
    text_color?: string
    is_progress_visible?: boolean
    has_shine_effect?: boolean
    position?: 'left' | 'right' | 'top' | 'bottom'
  }

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

  web_app_request_safe_area: void

  web_app_request_content_safe_area: void
}
