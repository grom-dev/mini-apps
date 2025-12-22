export function toHex(color: string): string | null {
  let match = /^\s*#([0-9a-f]{6})\s*$/i.exec(color)
  if (match) {
    return `#${match[1]!.toLowerCase()}`
  }
  match = /^\s*#([0-9a-f])([0-9a-f])([0-9a-f])\s*$/i.exec(color)
  if (match) {
    return (`#${match[1]}${match[1]}${match[2]}${match[2]}${match[3]}${match[3]}`).toLowerCase()
  }
  match = /^\s*rgb\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)\s*\)\s*$/.exec(color)
  if (match) {
    const rgb = [match[1]!, match[2]!, match[3]!]
      .map(ch => Number.parseInt(ch))
      .map(ch => (ch < 16 ? '0' : '') + ch.toString(16))
      .join('')
    return `#${rgb}`
  }
  return null
}

export function isDark(hex: string): boolean {
  hex = hex.replace(/[\s#]/g, '')
  if (hex.length === 3) {
    hex = hex[0]! + hex[0]! + hex[1]! + hex[1]! + hex[2]! + hex[2]!
  }
  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))
  return hsp < 120
}
