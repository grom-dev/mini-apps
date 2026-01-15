import type { SessionStorage } from './SessionStorage.ts'
import * as Url from './internal/Url.ts'

export interface LaunchParams {
  version: string
  platform: string
  themeParams: ThemeParams
  defaultColors: DefaultColors
  initData?: InitData
  initDataRaw?: string
  isFullscreen: boolean
  isInline: boolean
}

export interface InitData {
  auth_date: number
  hash: string
  signature: string
  start_param?: string
  query_id?: string
  can_send_after?: number
  chat_type?: 'sender' | 'private' | 'group' | 'supergroup' | 'channel'
  chat_instance?: string
  user?: User & {
    /**
     * IETF language tag of the user's language.
     */
    language_code: string
  }
  chat?: Chat
  receiver?: User & {
    /**
     * True, if this user is a bot.
     */
    is_bot?: boolean
  }
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

export interface DefaultColors {
  bg_color?: string
  header_color?: string
  bg_dark_color?: string
  header_dark_color?: string
}

export interface User {
  /**
   * A unique identifier for the user or bot.
   */
  id: number

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
   * Type of the chat.
   */
  type: 'group' | 'supergroup' | 'channel'

  /**
   * Title of the chat.
   */
  title: string

  /**
   * Username of the chat.
   */
  username?: string

  /**
   * URL of the chat's photo. The photo can be in .jpeg or .svg formats.
   */
  photo_url?: string
}

interface State {
  params: Record<string, string | null>
}

export interface InitOptions {
  storage: SessionStorage
  locationHash: string
}

export const init = ({
  storage,
  locationHash,
}: InitOptions): LaunchParams => {
  const storedState = storage.storedState<State>('LaunchParams')
  const params = Url.parseHashParams(locationHash)
  const paramsRestored = storedState.load()?.params
  if (paramsRestored) {
    for (const [name, storedValue] of Object.entries(paramsRestored)) {
      if (params[name] === undefined) {
        params[name] = storedValue
      }
    }
  }
  storedState.save({ params })
  return {
    version: params.tgWebAppVersion || '6.0',
    platform: params.tgWebAppPlatform || 'unknown',
    themeParams: parseJsonOrFallback<ThemeParams>(params.tgWebAppThemeParams, {}),
    defaultColors: parseJsonOrFallback<DefaultColors>(params.tgWebAppDefaultColors, {}),
    ...(() => {
      const initDataRaw = params.tgWebAppData || ''
      if (initDataRaw.length > 0) {
        return {
          initDataRaw,
          initData: Url.parseQueryStringWithNestedObjects(initDataRaw) as any,
        }
      }
      return {}
    })(),
    isFullscreen: Boolean(params.tgWebAppFullscreen),
    isInline: Boolean(params.tgWebAppBotInline),
  }
}

function parseJsonOrFallback<T>(
  encoded: string | null | undefined,
  fallback: NoInfer<T>,
): NoInfer<T> {
  try {
    if (encoded) {
      return JSON.parse(encoded)
    }
  }
  catch {}
  return fallback
}
