import type { Viewport } from '@grom.js/mini-app'
import { useStore } from '@tanstack/react-store'
import { useEffect } from 'react'
import { useMiniApp } from './useMiniApp'

export interface UseViewportOptions {
  onChange?: (state: Viewport.State) => void
}

export interface UseViewportReturn {
  stableHeight: number
  resizing: boolean
  expanded: boolean
  expand: () => void
  safeAreaInset: Viewport.SafeAreaInset
  contentSafeAreaInset: Viewport.ContentSafeAreaInset
}

export function useViewport({
  onChange,
}: UseViewportOptions = {}): UseViewportReturn {
  const { viewport } = useMiniApp()
  const stableHeight = useStore(viewport.stateStore, state => state.stableHeight)
  const expanded = useStore(viewport.stateStore, state => state.expanded)
  const resizing = useStore(viewport.stateStore, state => state.resizing)
  const safeAreaInset = useStore(viewport.safeAreaInsetStore)
  const contentSafeAreaInset = useStore(viewport.contentSafeAreaInsetStore)
  useEffect(() => {
    if (onChange) {
      return viewport.stateStore.subscribe(({ currentVal }) => {
        onChange(currentVal)
      })
    }
  }, [viewport.stateStore, onChange])
  return {
    stableHeight,
    expanded,
    resizing,
    safeAreaInset,
    contentSafeAreaInset,
    expand: viewport.expand.bind(viewport),
  }
}
