import { useEffect } from 'react'
import { useMiniApp } from './useMiniApp'

export interface UseBackButtonOptions {
  visible: boolean
  onClick?: () => void
}

export function useBackButton({
  visible,
  onClick,
}: UseBackButtonOptions): void {
  const { backButton } = useMiniApp()
  useEffect(() => {
    backButton.stateStore.setState({ visible })
  }, [visible])
  useEffect(() => {
    if (onClick) {
      return backButton.onClick(onClick)
    }
  }, [onClick])
}
