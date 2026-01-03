import type { IncomingEventMap, OutgoingEventMap } from './Events.ts'
import * as EventBus from './internal/EventBus.ts'

/**
 * Communication bridge between Mini App and Telegram client.
 */
export interface Bridge extends Pick<EventBus.EventBus<IncomingEventMap>, 'on' | 'off' | 'once'> {
  emit: <TEvent extends keyof OutgoingEventMap>(
    // workaround to make TS allow omitting optional payloads
    // see: https://github.com/microsoft/TypeScript/issues/29131
    ...args: (
      [void] extends [OutgoingEventMap[TEvent]]
        ? Parameters<(event: TEvent, payload?: OutgoingEventMap[TEvent]) => void>
        : Parameters<(event: TEvent, payload: OutgoingEventMap[TEvent]) => void>
    )
  ) => void
}

export interface InitOptions {
  isIframe: boolean
}

export const init = ({
  isIframe,
}: InitOptions): Bridge => {
  const incomingEventBus = EventBus.make<IncomingEventMap>()
  const emitViaPostMessage = (eventType: string, eventData?: unknown) => {
    // TODO: Isn't it better to set targetOrigin?
    window.parent.postMessage(JSON.stringify({ eventType, eventData }), '*')
  }
  const w = window as any
  //////////////////////////////////////////////////////////////////////////////
  const emit = (() => {
    if (w.TelegramWebviewProxy !== undefined) {
      return (eventType, eventData) => {
        w.TelegramWebviewProxy.postEvent(eventType, JSON.stringify(eventData))
      }
    }
    else if (w.external && 'notify' in w.external) {
      return (eventType, eventData) => {
        w.external.notify(JSON.stringify({ eventType, eventData }))
      }
    }
    else if (isIframe) {
      return emitViaPostMessage
    }
    throw new Error('Could not determine the post event method.')
  })() as (event: string, payload?: unknown) => void
  //////////////////////////////////////////////////////////////////////////////
  const receiveEvent = incomingEventBus.dispatch.bind(incomingEventBus)
  // 1 (iframe)
  if (isIframe) {
    const iframeStyle = document.createElement('style')
    document.head.appendChild(iframeStyle)
    window.addEventListener('message', (event) => {
      if (event.source !== window.parent) {
        return
      }
      let dataParsed: any
      try {
        dataParsed = JSON.parse(event.data)
      }
      catch {
        return
      }
      if (!dataParsed || !dataParsed.eventType) {
        return
      }
      if (dataParsed.eventType === 'set_custom_style') {
        if (event.origin === 'https://web.telegram.org') {
          iframeStyle.innerHTML = dataParsed.eventData
        }
      }
      else if (dataParsed.eventType === 'reload_iframe') {
        try {
          emitViaPostMessage('iframe_will_reload')
        }
        catch {}
        location.reload()
      }
      else {
        receiveEvent(dataParsed.eventType, dataParsed.eventData)
      }
    })
    try {
      emitViaPostMessage('iframe_ready', { reload_supported: true })
    }
    catch {}
  }
  // 2
  if (!w.Telegram) {
    w.Telegram = {}
  }
  if (!w.Telegram.WebView) {
    w.Telegram.WebView = {}
  }
  w.Telegram.WebView.receiveEvent = receiveEvent
  // 3
  w.TelegramGameProxy_receiveEvent = receiveEvent
  // 4
  if (!w.TelegramGameProxy) {
    w.TelegramGameProxy = {}
  }
  w.TelegramGameProxy.receiveEvent = receiveEvent
  //////////////////////////////////////////////////////////////////////////////
  return {
    on: incomingEventBus.on.bind(incomingEventBus),
    off: incomingEventBus.off.bind(incomingEventBus),
    once: incomingEventBus.once.bind(incomingEventBus),
    emit: (event, payload = undefined) => {
      if (payload === undefined) {
        payload = '' as any
      }
      emit(`web_app_${event}`, payload)
    },
  }
}
