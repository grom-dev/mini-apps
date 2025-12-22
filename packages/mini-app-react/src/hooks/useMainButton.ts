import { useEffect } from 'react'
import { useMiniApp } from './useMiniApp'

export interface UseMainButtonOptions {
  text?: string
  visible?: boolean
  loading?: boolean
  active?: boolean
  shining?: boolean
  bgColor?: string | null
  textColor?: string | null
  onClick?: () => void
}

export function useMainButton({
  text,
  visible,
  loading,
  active,
  shining,
  bgColor,
  textColor,
  onClick,
}: UseMainButtonOptions): void {
  const { mainButton } = useMiniApp()
  useEffect(() => {
    mainButton.stateStore.setState(prev => ({
      text: text ?? prev.text,
      visible: visible ?? prev.visible,
      loading: loading ?? prev.loading,
      active: active ?? prev.active,
      shining: shining ?? prev.shining,
      bgColor: bgColor === undefined ? prev.bgColor : bgColor,
      textColor: textColor === undefined ? prev.textColor : textColor,
    }))
  }, [mainButton, text, visible, loading, active, shining, bgColor, textColor])
  useEffect(() => {
    if (onClick) {
      return mainButton.onClick(onClick)
    }
  }, [mainButton, onClick])
}
