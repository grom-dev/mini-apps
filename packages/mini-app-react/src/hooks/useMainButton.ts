import { useEffect } from 'react'
import { useMiniApp } from './useMiniApp'

export interface UseMainButtonOptions {
  text?: string
  loading?: boolean
  shining?: boolean
  bgColor?: string
  textColor?: string
  onClick?: () => void
}

export function useMainButton({
  text = '',
  loading = false,
  shining = false,
  bgColor,
  textColor,
  onClick,
}: UseMainButtonOptions): void {
  const { mainButton } = useMiniApp()
  useEffect(() => {
    mainButton.setup({
      text,
      loading,
      shining,
      bgColor,
      textColor,
    })
  }, [mainButton.setup, text, loading, shining, bgColor, textColor])
  useEffect(() => {
    if (onClick) {
      return mainButton.onClick(onClick)
    }
  }, [mainButton.onClick, onClick])
}
