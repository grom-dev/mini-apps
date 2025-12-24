import type {
  BackButton,
  Fullscreen,
  Haptic,
  MainButton,
  SecondaryButton,
  SettingsButton,
  Theme,
  Viewport,
} from '@grom.js/mini-app'
import type { Context } from 'react'
import { createContext } from 'react'

export interface MiniApp {
  viewport: Viewport.Viewport
  fullscreen: Fullscreen.Fullscreen
  backButton: BackButton.BackButton
  settingsButton: SettingsButton.SettingsButton
  mainButton: MainButton.MainButton
  secondaryButton: SecondaryButton.SecondaryButton
  theme: Theme.Theme
  haptic: Haptic.Haptic
}

export const MiniAppContext: Context<MiniApp | null> = createContext<MiniApp | null>(null)
