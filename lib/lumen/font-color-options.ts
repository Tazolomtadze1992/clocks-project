export const FONT_COLOR_IDS = [
  "white",
  "black",
  "grey",
  "red",
  "blue",
  "green",
  "yellow",
  "pink",
] as const

export type FontColorId = (typeof FONT_COLOR_IDS)[number]

export const DEFAULT_FONT_COLOR_ID: FontColorId = "white"

/** CSS color values for clock face text */
export const FONT_COLOR_CSS: Record<FontColorId, string> = {
  white: "#ffffff",
  black: "#000000",
  grey: "#737373",
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  pink: "#ec4899",
}

export function fontColorLabel(id: FontColorId): string {
  return id.charAt(0).toUpperCase() + id.slice(1)
}
