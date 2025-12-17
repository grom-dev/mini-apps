import type { Bridge } from '../Bridge.ts'
import type { OutgoingEventMap } from '../Events.ts'

/**
 * Module for controlling haptic feedback.
 */
export interface Haptic {
  /**
   * Triggers haptic feedback of the given style.
   */
  trigger: (style: HapticStyle) => void
}

export type HapticStyle
  = | 'impact/light'
    | 'impact/medium'
    | 'impact/heavy'
    | 'impact/rigid'
    | 'impact/soft'
    | 'notification/error'
    | 'notification/success'
    | 'notification/warning'
    | 'selection-change'

export const init = (options: {
  bridge: Bridge
}): Haptic => {
  const { bridge } = options
  return {
    trigger: (style) => {
      bridge.emit('web_app_trigger_haptic_feedback', payloadFromStyle(style))
    },
  }
}

function payloadFromStyle(style: HapticStyle): OutgoingEventMap['web_app_trigger_haptic_feedback'] {
  switch (style) {
    case 'impact/light': return { type: 'impact', impact_style: 'light' }
    case 'impact/medium': return { type: 'impact', impact_style: 'medium' }
    case 'impact/heavy': return { type: 'impact', impact_style: 'heavy' }
    case 'impact/rigid': return { type: 'impact', impact_style: 'rigid' }
    case 'impact/soft': return { type: 'impact', impact_style: 'soft' }
    case 'notification/error': return { type: 'notification', notification_type: 'error' }
    case 'notification/success': return { type: 'notification', notification_type: 'success' }
    case 'notification/warning': return { type: 'notification', notification_type: 'warning' }
    case 'selection-change': return { type: 'selection_change' }
  }
}
