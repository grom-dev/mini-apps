import type { ThemeParams } from './LaunchParams.ts'

/**
 * Event types that can be received by the mini app from the client.
 *
 * @see https://core.telegram.org/api/bots/webapps#incoming-events-client-to-mini-app
 */
export interface IncomingEventMap {
  main_button_pressed: void
  back_button_pressed: void
  settings_button_pressed: void
  invoice_closed: {
    slug: string
    status: 'cancelled' | 'failed' | 'pending' | 'paid'
  }
  viewport_changed: {
    height: number
    is_state_stable: boolean
    is_expanded: boolean
  }
  theme_changed: {
    theme_params: ThemeParams
  }
  popup_closed: {
    button_id?: string
  }
  write_access_requested: {
    status: 'allowed' | 'cancelled'
  }
  phone_requested: {
    status: 'sent' | 'cancelled'
  }
  biometry_info_received: {
    available: boolean
    type?: 'finger' | 'face' | 'unknown'
    access_requested: boolean
    access_granted: boolean
    token_saved: boolean
    device_id: string
  }
  biometry_token_updated: {
    status: 'updated' | 'removed' | 'failed'
  }
  biometry_auth_requested: {
    status: 'authorized' | 'failed'
    token?: string
  }
  custom_method_invoked:
    | { req_id: string, result: unknown }
    | { req_id: string, error: string }
  clipboard_text_received: {
    req_id: string
    data?: string
  }
  qr_text_received: {
    data: string
  }
  scan_qr_popup_closed: null | {}
  visibility_changed: {
    is_visible: boolean
  }
  secondary_button_pressed: void
  fullscreen_changed: {
    is_fullscreen: boolean
  }
  fullscreen_failed: {
    error: 'UNSUPPORTED' | 'ALREADY_FULLSCREEN'
  }
  accelerometer_started: void
  accelerometer_failed: {
    error: 'UNSUPPORTED'
  }
  accelerometer_stopped: void
  accelerometer_changed: {
    x: number
    y: number
    z: number
  }
  gyroscope_started: void
  gyroscope_failed: {
    error: 'UNSUPPORTED'
  }
  gyroscope_stopped: void
  gyroscope_changed: {
    x: number
    y: number
    z: number
  }
  device_orientation_started: void
  device_orientation_failed: {
    error: 'UNSUPPORTED'
  }
  device_orientation_stopped: void
  device_orientation_changed: {
    alpha: number
    beta: number
    gamma: number
    absolute: boolean
  }
  home_screen_added: void
  home_screen_failed: {
    error: 'UNSUPPORTED'
  }
  home_screen_checked: {
    status: 'unsupported' | 'unknown' | 'added' | 'missed'
  }
  emoji_status_failed: {
    error: 'UNSUPPORTED' | 'SUGGESTED_EMOJI_INVALID' | 'DURATION_INVALID' | 'USER_DECLINED' | 'SERVER_ERROR' | 'UNKNOWN_ERROR'
  }
  emoji_status_set: void
  emoji_status_access_requested: {
    status: 'allowed' | 'cancelled'
  }
  file_download_requested: {
    status: 'cancelled' | 'downloading'
  }
  prepared_message_failed: {
    error: string
  }
  prepared_message_sent: void
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
  location_requested: {
    available: boolean
    latitude?: number
    longitude?: number
    altitude?: number | null
    course?: number | null
    speed?: number | null
    horizontal_accuracy?: number | null
    vertical_accuracy?: number | null
    course_accuracy?: number | null
    speed_accuracy?: number | null
  }
  location_checked: {
    available: boolean
    access_requested?: boolean
    access_granted?: boolean
  }
  device_storage_key_saved: {
    req_id: string
  }
  device_storage_key_received: {
    req_id: string
    value: string | null
  }
  device_storage_cleared: {
    req_id: string
  }
  device_storage_failed: {
    req_id: string
    error: string
  }
  secure_storage_key_saved: {
    req_id: string
  }
  secure_storage_key_received: {
    req_id: string
    value: string | null
    can_restore: boolean
  }
  secure_storage_key_restored: {
    req_id: string
    value: string
  }
  secure_storage_cleared: {
    req_id: string
  }
  secure_storage_failed: {
    req_id: string
    error: string
  }
}

/**
 * Event types that can be emitted by the mini app to the client.
 *
 * **Note**: property names are event types without `web_app_` prefix.
 *
 * @see https://core.telegram.org/api/web-events#event-apis
 */
export interface OutgoingEventMap {
  close: void | {
    return_back?: boolean
  }
  open_popup: {
    title?: string
    message: string
    buttons: Array<
      | { type: 'ok' | 'close' | 'cancel', text?: string, id: string }
      | { type: 'default' | 'destructive', text: string, id: string }
    >
  }
  request_write_access: void
  request_phone: void
  biometry_get_info: void
  biometry_request_access: {
    reason?: string
  }
  biometry_update_token: {
    token: string
    reason?: string
  }
  biometry_request_auth: {
    reason?: string
  }
  biometry_open_settings: void
  invoke_custom_method: {
    req_id: string
    method: string
    params: unknown
  }
  read_text_from_clipboard: {
    req_id: string
  }
  open_scan_qr_popup: {
    text?: string
  }
  close_scan_qr_popup: void
  setup_closing_behavior: {
    need_confirmation: boolean
  }
  set_background_color: {
    color: string
  }
  set_header_color: {
    color_key?: 'bg_color' | 'secondary_bg_color'
    color?: string
  }
  data_send: {
    data: string
  }
  switch_inline_query: {
    query: string
    chat_types: Array<'users' | 'bots' | 'groups' | 'channels'>
  }
  trigger_haptic_feedback:
    | { type: 'impact', impact_style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' }
    | { type: 'notification', notification_type: 'error' | 'success' | 'warning' }
    | { type: 'selection_change' }
  open_link: {
    url: string
    try_instant_view?: boolean
    try_browser?: string
  }
  open_tg_link: {
    path_full: string
    force_request?: boolean
  }
  open_invoice: {
    slug: string
  }
  expand: void
  request_viewport: void
  request_theme: void
  ready: void
  setup_main_button: {
    is_visible: boolean
    is_active?: boolean
    text?: string
    color?: string
    text_color?: string
    is_progress_visible?: boolean
    has_shine_effect?: boolean
  }
  setup_back_button: {
    is_visible: boolean
  }
  setup_settings_button: {
    is_visible: boolean
  }
  setup_swipe_behavior: {
    allow_vertical_swipe: boolean
  }
  set_bottom_bar_color: {
    color: string
  }
  setup_secondary_button: {
    is_visible: boolean
    is_active?: boolean
    text?: string
    color?: string
    text_color?: string
    is_progress_visible?: boolean
    has_shine_effect?: boolean
    position?: 'left' | 'right' | 'top' | 'bottom'
  }
  share_to_story: {
    media_url: string
    text?: string
    widget_link?: {
      url: string
      text?: string
    }
  }
  request_fullscreen: void
  exit_fullscreen: void
  start_accelerometer: {
    refresh_rate?: number
  }
  stop_accelerometer: void
  start_gyroscope: {
    refresh_rate?: number
  }
  stop_gyroscope: void
  start_device_orientation: {
    refresh_rate?: number
    need_absolute?: boolean
  }
  stop_device_orientation: void
  add_to_home_screen: void
  check_home_screen: void
  set_emoji_status: {
    custom_emoji_id: string
    duration?: number
  }
  request_emoji_status_access: void
  request_safe_area: void
  request_content_safe_area: void
  check_location: void
  request_location: void
  open_location_settings: void
  request_file_download: {
    url: string
    filename: string
  }
  send_prepared_message: {
    id: string
  }
  toggle_orientation_lock: {
    locked?: boolean
  }
  device_storage_save_key: {
    req_id: string
    key: string
    value: string | null
  }
  device_storage_get_key: {
    req_id: string
    key: string
  }
  device_storage_clear: {
    req_id: string
  }
  secure_storage_save_key: {
    req_id: string
    key: string
    value: string | null
  }
  secure_storage_get_key: {
    req_id: string
    key: string
  }
  secure_storage_clear: {
    req_id: string
  }
  secure_storage_restore_key: {
    req_id: string
    key: string
  }
  hide_keyboard: void
}
