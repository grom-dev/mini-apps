import type { InitParams } from './InitParams.ts'
import * as Url from './internal/Url.ts'

export interface LaunchParams {
  initData: InitData | null
  initDataRaw: string
  themeParams: ThemeParams
  defaultColors: Record<string, string>
  version: string
  platform: string
  fullscreen: boolean
  isInlineBot: boolean
}

export interface InitData {
  auth_date: number
  hash: string
  signature: string
  query_id?: string
  user?: User
  receiver?: User
  chat?: Chat
  chat_type?: 'sender' | 'private' | 'group' | 'supergroup' | 'channel'
  chat_instance?: string
  start_param?: string
  can_send_after?: number
}

export interface ThemeParams {
  bg_color?: string
  text_color?: string
  hint_color?: string
  link_color?: string
  button_color?: string
  button_text_color?: string
  secondary_bg_color?: string
  header_bg_color?: string
  bottom_bar_bg_color?: string
  accent_text_color?: string
  section_bg_color?: string
  section_header_text_color?: string
  section_separator_color?: string
  subtitle_text_color?: string
  destructive_text_color?: string
}

export interface User {
  /**
   * A unique identifier for the user or bot.
   */
  id: number

  /**
   * True, if this user is a bot. Returns in the receiver field only.
   */
  is_bot?: boolean

  /**
   * First name of the user or bot.
   */
  first_name: string

  /**
   * Last name of the user or bot.
   */
  last_name?: string

  /**
   * Username of the user or bot.
   */
  username?: string

  /**
   * IETF language tag of the user's language. Returns in user field only.
   */
  language_code?: string

  /**
   * True, if this user is a Telegram Premium user.
   */
  is_premium?: true

  /**
   * True, if this user added the bot to the attachment menu.
   */
  added_to_attachment_menu?: true

  /**
   * True, if this user allowed the bot to message them.
   */
  allows_write_to_pm?: true

  /**
   * URL of the user's profile photo. The photo can be in .jpeg or .svg formats.
   */
  photo_url?: string
}

export interface Chat {
  /**
   * Unique identifier for this chat.
   */
  id: number

  /**
   * Type of chat, can be either "group", "supergroup" or "channel"
   */
  type: 'group' | 'supergroup' | 'channel'

  /**
   * Title of the chat
   */
  title: string

  /**
   * Username of the chat
   */
  username?: string

  /**
   * URL of the chat's photo. The photo can be in .jpeg or .svg formats. Only returned for Mini Apps launched from the attachment menu.
   */
  photo_url?: string
}

export interface InitOptions {
  initParams: InitParams
}

export const init = ({
  initParams,
}: InitOptions): LaunchParams => {
  return {
    ...(() => {
      const initDataRaw = initParams.tgWebAppData || ''
      if (initDataRaw.length > 0) {
        return {
          initDataRaw,
          initData: Url.parseQueryStringWithNestedObjects(initDataRaw) as any,
        }
      }
      return { initDataRaw, initData: null }
    })(),
    themeParams: (() => {
      if (initParams.tgWebAppThemeParams) {
        try {
          return JSON.parse(initParams.tgWebAppThemeParams)
        }
        catch {}
      }
      return {}
    })(),
    defaultColors: (() => {
      if (initParams.tgWebAppDefaultColors) {
        try {
          return JSON.parse(initParams.tgWebAppDefaultColors)
        }
        catch {}
      }
      return {}
    })(),
    version: initParams.tgWebAppVersion || '6.0',
    platform: initParams.tgWebAppPlatform || 'unknown',
    fullscreen: Boolean(initParams.tgWebAppFullscreen),
    isInlineBot: Boolean(initParams.tgWebAppBotInline),
  }
}
