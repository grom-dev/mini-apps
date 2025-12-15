import type { IncomingEvents, OutgoingEvents } from '../events.ts'
import * as Di from '../Di.ts'

export const Tag = Di.tag<'EventBus', EventBus>('EventBus')

/**
 * Communication layer between the mini app and the hosting client.
 */
export interface EventBus {
  /**
   * Emits an event to the client.
   */
  emit: <TEvent extends keyof OutgoingEvents>(
    type: TEvent,
    payload: OutgoingEvents[TEvent],
  ) => void

  /**
   * Registers a listener callback for a specific event type.
   *
   * To unsubscribe the listener, use the {@linkcode EventBus.off} method,
   * or call the returned unsubscribe function.
   *
   * @returns Unsubscribe function to remove the listener.
   */
  on: <TEvent extends keyof IncomingEvents>(
    type: TEvent,
    callback: (payload: IncomingEvents[TEvent]) => void,
  ) => () => void

  /**
   * Removes a listener callback for a specific event type.
   * If no callback is provided, all listeners for the event type are removed.
   */
  off: <TEvent extends keyof IncomingEvents>(
    type: TEvent,
    callback?: any,
  ) => void

  /**
   * Dispatches an event to all listeners for the event type.
   */
  dispatch: (type: string, payload: unknown | void) => void
}

export const init = (options: {
  postEvent: (type: string, payload: unknown | void) => void
}): EventBus => {
  const listeners: Map<string, Array<(params: unknown | void) => void>> = new Map()
  const off = (type: string, callback: any) => {
    if (!callback) {
      listeners.delete(type)
      return
    }
    if (!listeners.has(type)) {
      return
    }
    const callbacks = listeners.get(type)!
    listeners.set(type, callbacks.filter(cb => cb !== callback))
  }
  const on = (type: string, callback: (params: unknown | void) => void) => {
    const callbacks = listeners.get(type) || []
    callbacks.push(callback)
    listeners.set(type, callbacks)
    return () => off(type, callback)
  }
  const dispatch = (type: string, payload: unknown | void) => {
    if (!listeners.has(type)) {
      return
    }
    const callbacks = listeners.get(type)!
    callbacks.forEach((callback) => {
      try {
        callback(payload)
      }
      catch (error) {
        console.error(`Listener for an event of type "${type}" thrown:`, error)
      }
    })
  }
  return {
    emit: options.postEvent,
    on,
    off,
    dispatch,
  } as EventBus
}
