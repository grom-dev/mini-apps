import type { MiniApp } from '../context.ts'
import { useContext } from 'react'
import { MiniAppContext } from '../context.ts'

export function useMiniApp(): MiniApp {
  const ctx = useContext(MiniAppContext)
  if (!ctx) {
    throw new Error('Mini App context is not provided.')
  }
  return ctx
}
