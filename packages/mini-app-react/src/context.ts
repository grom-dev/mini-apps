import type { BackButton, Haptic, SettingsButton, Theme } from '@grom.js/mini-app'
import type { Context } from 'react'
import { createContext } from 'react'

export interface MiniApp {
  backButton: BackButton.BackButton
  settingsButton: SettingsButton.SettingsButton
  theme: Theme.Theme
  haptic: Haptic.Haptic
}

export const MiniAppContext: Context<MiniApp | null> = createContext<MiniApp | null>(null)
