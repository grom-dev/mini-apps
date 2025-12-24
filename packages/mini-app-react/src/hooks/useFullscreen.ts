import { useStore } from '@tanstack/react-store'
import { useMiniApp } from './useMiniApp'

export interface UseFullscreenReturn {
  isFullscreen: boolean
  state: 'fullscreen' | 'not-fullscreen' | 'entering' | 'exiting'
  setFullscreen: (value: boolean) => Promise<{
    isFullscreen: boolean
    error?: 'UNSUPPORTED' | 'ALREADY_FULLSCREEN'
  }>
}

export function useFullscreen(): UseFullscreenReturn {
  const { fullscreen } = useMiniApp()
  const state = useStore(fullscreen.stateStore, ({ state }) => state)
  return {
    isFullscreen: state === 'fullscreen',
    state,
    setFullscreen: fullscreen.setFullscreen,
  }
}
