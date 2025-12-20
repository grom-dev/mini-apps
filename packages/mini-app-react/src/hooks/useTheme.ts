import type { Theme } from '@grom.js/mini-app'
import { useStore } from '@tanstack/react-store'
import { useMiniApp } from './useMiniApp'

export interface UseThemeReturn {
  palette: Theme.Palette
  colorScheme: Theme.ColorScheme
}

export function useTheme(): UseThemeReturn {
  const { theme } = useMiniApp()
  const palette = useStore(theme.paletteStore)
  const colorScheme = useStore(theme.colorSchemeStore)
  return { palette, colorScheme }
}
