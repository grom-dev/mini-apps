import * as Di from './Di'
import * as BackButton from './modules/BackButton'
import * as EventBus from './modules/EventBus'
import * as SessionStorage from './modules/SessionStorage'

export interface MiniApp {
  BackButton: BackButton.BackButton
}

export const init = (): MiniApp => {
  const eventBus = EventBus.init({
    postEvent: (type, payload) => {
      console.info('Event emitted:', type, payload)
    },
  })

  const container = new Di.Container()
    .provide(
      EventBus.Tag,
      {},
      () => eventBus,
    )
    .provide(
      SessionStorage.Tag,
      {},
      () => SessionStorage.init({
        storage: globalThis.sessionStorage,
        transformKey: key => `@grom.js/mini-app/${key}`,
      }),
    )
    .provide(
      BackButton.Tag,
      {
        eventBus: EventBus.Tag,
        sessionStorage: SessionStorage.Tag,
      },
      BackButton.init,
    )
    .build()
}
