export interface UnsubscribeFn {
  (): void
}

export interface Listener<TEventMap, TEvent extends keyof TEventMap> {
  (payload: TEventMap[TEvent]): void
}

export interface EventBus<TEventMap> {
  on: <TEvent extends keyof TEventMap>(
    event: TEvent,
    listener: Listener<TEventMap, TEvent>,
  ) => UnsubscribeFn

  off: <TEvent extends keyof TEventMap>(
    event: TEvent,
    listener: Listener<TEventMap, TEvent>,
  ) => void

  once: <TEvent extends keyof TEventMap>(
    event: TEvent,
    listener: Listener<TEventMap, TEvent>,
  ) => UnsubscribeFn

  dispatch: <TEvent extends keyof TEventMap>(
    event: TEvent,
    payload: TEventMap[TEvent],
  ) => void

  reset: () => void
}

export const make = <TEventMap>(): EventBus<TEventMap> => {
  const listenersMap: Map<keyof TEventMap, Array<Listener<TEventMap, any>>> = new Map()

  const off = <TEvent extends keyof TEventMap>(
    event: TEvent,
    listener: Listener<TEventMap, TEvent>,
  ) => {
    if (listenersMap.has(event)) {
      const listeners = listenersMap.get(event)!
      listenersMap.set(event, listeners.filter(l => l !== listener))
    }
  }

  const on = <TEvent extends keyof TEventMap>(
    event: TEvent,
    listener: Listener<TEventMap, TEvent>,
  ): UnsubscribeFn => {
    const listeners = listenersMap.get(event) || []
    if (!listeners.includes(listener)) {
      listeners.push(listener)
      listenersMap.set(event, listeners)
    }
    return () => off(event, listener)
  }

  const once = <TEvent extends keyof TEventMap>(
    event: TEvent,
    listener: Listener<TEventMap, TEvent>,
  ): UnsubscribeFn => {
    const onceListener = (payload: TEventMap[TEvent]) => {
      listener(payload)
      off(event, onceListener)
    }
    on(event, onceListener)
    return () => off(event, onceListener)
  }

  const dispatch = <TEvent extends keyof TEventMap>(
    event: TEvent,
    payload: TEventMap[TEvent],
  ) => {
    const listeners = listenersMap.get(event) || []
    listeners.forEach(listener => listener(payload))
  }

  const reset = () => {
    listenersMap.clear()
  }

  return { on, off, once, dispatch, reset }
}
