import type { Bridge } from './Bridge.ts'
import type { OutgoingEventMap } from './Events.ts'

export interface Links {
  openLink: (
    url: string | URL,
    options?: {
      tryInstantView?: boolean
      tryBrowser?:
        | 'chrome'
        | 'firefox'
        | 'edge'
        | 'opera'
        | 'opera-mini'
        | 'brave'
        | 'duckduckgo'
        | 'samsung'
        | 'vivaldi'
        | 'kiwi'
        | 'uc'
        | 'tor'
    },
  ) => void
  openTelegramLink: (
    url: string | URL,
    options?: {
      force_request?: boolean
    },
  ) => void
}

export interface InitOptions {
  bridge: Bridge
  isIframe: boolean
}

export const init = ({
  bridge,
  isIframe,
}: InitOptions): Links => {
  const links: Links = {
    openLink: (url_, options = {}) => {
      const url = new URL(url_)
      const params: OutgoingEventMap['open_link'] = {
        url: url.toString(),
      }
      if (options.tryInstantView) {
        params.try_instant_view = true
      }
      if (options.tryBrowser) {
        params.try_browser = options.tryBrowser
      }
      bridge.emit('open_link', params)
    },
    openTelegramLink: (url_, options = {}) => {
      const url = new URL(url_)
      const params: OutgoingEventMap['open_tg_link'] = {
        path_full: url.pathname + url.search,
      }
      if (options.force_request) {
        params.force_request = true
      }
      bridge.emit('open_tg_link', params)
    },
  }
  if (isIframe) {
    document.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey) {
        return
      }
      let el = event.target as any
      if (el == null) {
        return
      }
      while (el.tagName !== 'A' && el.parentNode) {
        el = el.parentNode
      }
      const anchor = el as HTMLAnchorElement
      if (
        anchor.tagName === 'A' &&
        anchor.target !== '_blank' &&
        (anchor.protocol === 'http:' || anchor.protocol === 'https:') &&
        anchor.hostname === 't.me'
      ) {
        links.openTelegramLink(anchor.href)
        event.preventDefault()
      }
    })
  }
  return links
}
