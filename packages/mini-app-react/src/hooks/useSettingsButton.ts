import { useEffect } from 'react'
import { useMiniApp } from './useMiniApp'

export interface UseSettingsButtonOptions {
  visible: boolean
  onClick?: () => void
}

export function useSettingsButton({
  visible,
  onClick,
}: UseSettingsButtonOptions): void {
  const { settingsButton } = useMiniApp()
  useEffect(() => {
    settingsButton.stateStore.setState({ visible })
  }, [settingsButton.stateStore, visible])
  useEffect(() => {
    if (onClick) {
      return settingsButton.onClick(onClick)
    }
  }, [settingsButton, onClick])
}
