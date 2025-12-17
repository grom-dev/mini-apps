import type { IncomingEventMap, OutgoingEventMap } from './Events.ts'
import * as EventBus from './internal/EventBus.ts'

/**
 * Communication bridge between Mini App and Telegram client.
 */
export interface Bridge extends Pick<EventBus.EventBus<IncomingEventMap>, 'on' | 'off' | 'once'> {
  emit: <TEvent extends keyof OutgoingEventMap>(
    event: TEvent,
    payload: OutgoingEventMap[TEvent],
  ) => void
}

export const connect = (): Bridge => {
  const incomingEventBus = EventBus.make<IncomingEventMap>()
  const isIframe = (window.parent != null && window !== window.parent)
  const emitViaPostMessage = (eventType: string, eventData?: unknown) => {
    // TODO: Isn't it better to set targetOrigin?
    window.parent.postMessage(JSON.stringify({ eventType, eventData }), '*')
  }
  const w = window as any
  //////////////////////////////////////////////////////////////////////////////
  const emit: Bridge['emit'] = (() => {
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
  })()
  //////////////////////////////////////////////////////////////////////////////
  const receiveEvent = incomingEventBus.dispatch.bind(incomingEventBus)
  // 1 (iframe)
  if (isIframe) {
    const iFrameStyle = document.createElement('style')
    document.head.appendChild(iFrameStyle)
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
          iFrameStyle.innerHTML = dataParsed.eventData
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
    emit,
  }
}
