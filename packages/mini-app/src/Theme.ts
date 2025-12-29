import type { Bridge } from './Bridge.ts'
import type { LaunchParams, ThemeParams } from './LaunchParams.ts'
import type { SessionStorage } from './SessionStorage.ts'
import { Derived, Store } from '@tanstack/store'
import * as Color from './internal/Color.ts'

export interface Theme {
  paletteStore: Derived<Palette>
  colorSchemeStore: Derived<ColorScheme>
}

export type Palette = ThemeParams

export type ColorScheme = 'light' | 'dark'

export interface InitOptions {
  storage: SessionStorage
  launchParams: LaunchParams
  bridge: Bridge
}

export const init = ({
  storage,
  launchParams,
  bridge,
}: InitOptions): Theme => {
  const storedState = storage.storedState<ThemeParams>('Theme')
  const paramsStore = new Store<ThemeParams>({}, {
    onUpdate: () => {
      storedState.save(paramsStore.state)
    },
  })
  const storedParams = storedState.load()
  if (storedParams) {
    paramsStore.setState(storedParams)
  }
  else {
    paramsStore.setState(launchParams.themeParams)
  }
  bridge.on('theme_changed', ({ theme_params }) => {
    paramsStore.setState(theme_params)
  })
  const paletteStore = new Derived({
    fn: ({ currDepVals: [params] }) => paletteFromParams(params),
    deps: [paramsStore],
  })
  const colorSchemeStore = new Derived({
    fn: ({ currDepVals: [palette] }) => palette.bg_color ? Color.isDark(palette.bg_color) ? 'dark' : 'light' : 'light',
    deps: [paletteStore],
  })
  colorSchemeStore.mount()
  paletteStore.mount()
  bridge.emit('request_theme')
  return { paletteStore, colorSchemeStore }
}

function paletteFromParams(params?: Readonly<ThemeParams> | null): Palette {
  const palette: Palette = {}
  for (const [key, value] of Object.entries(params ?? {})) {
    const color = Color.toHex(value)
    if (color) {
      palette[key as keyof Palette] = color
    }
  }
  // temp iOS fix
  if (palette.bg_color === '#1c1c1d' && palette.bg_color === palette.secondary_bg_color) {
    palette.secondary_bg_color = '#2c2c2e'
  }
  return palette
}
