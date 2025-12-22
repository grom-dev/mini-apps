import { useEffect } from 'react'
import { useMiniApp } from './useMiniApp'

export interface UseSecondaryButtonOptions {
  text?: string
  visible?: boolean
  loading?: boolean
  active?: boolean
  shining?: boolean
  position?: 'left' | 'right' | 'top' | 'bottom'
  bgColor?: string | null
  textColor?: string | null
  onClick?: () => void
}

export function useSecondaryButton({
  text,
  visible,
  loading,
  active,
  shining,
  position,
  bgColor,
  textColor,
  onClick,
}: UseSecondaryButtonOptions): void {
  const { secondaryButton } = useMiniApp()
  useEffect(() => {
    secondaryButton.stateStore.setState(prev => ({
      text: text ?? prev.text,
      visible: visible ?? prev.visible,
      loading: loading ?? prev.loading,
      active: active ?? prev.active,
      shining: shining ?? prev.shining,
      position: position ?? prev.position,
      bgColor: bgColor === undefined ? prev.bgColor : bgColor,
      textColor: textColor === undefined ? prev.textColor : textColor,
    }))
  }, [secondaryButton, text, visible, loading, active, shining, position, bgColor, textColor])
  useEffect(() => {
    if (onClick) {
      return secondaryButton.onClick(onClick)
    }
  }, [secondaryButton, onClick])
}
