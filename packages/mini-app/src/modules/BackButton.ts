import type { EventBus } from './EventBus.ts'
import type { SessionStorage } from './SessionStorage.ts'
import { Store } from '@tanstack/store'
import * as Di from '../Di.ts'

export const Tag = Di.tag<'BackButton', BackButton>('BackButton')

export interface BackButton extends Di.Disposable {
  stateStore: Store<State>
  onClick: (callback: () => void) => () => void
  offClick: (callback: any) => void
}

export interface State {
  visible: boolean
}

export const init = (options: {
  eventBus: EventBus
  sessionStorage: SessionStorage
}): BackButton => {
  const { eventBus, sessionStorage } = options
  const storedState = sessionStorage.initStoredState<State>('BackButton')
  const stateStore = new Store<State>(storedState.load() ?? { visible: false })
  const unsubscribe = stateStore.subscribe(({ currentVal }) => {
    eventBus.emit('web_app_setup_back_button', { is_visible: currentVal.visible })
    storedState.save(currentVal)
  })
  const onClick = (callback: () => void) => {
    return eventBus.on('back_button_pressed', callback)
  }
  const offClick = (callback: any) => {
    eventBus.off('back_button_pressed', callback)
  }
  return {
    [Di.DisposeSymbol]: () => {
      unsubscribe()
      storedState.clear()
    },
    stateStore,
    onClick,
    offClick,
  }
}
