export const CLOCK_LAYOUT_MODES = [
  "Default",
  "Centered",
  "Glass Container",
  "Analog",
  "Bottom Row",
  "Small Corners",
  "Thunder",
] as const

export type ClockLayoutMode = (typeof CLOCK_LAYOUT_MODES)[number]

export const DEFAULT_CLOCK_LAYOUT_MODE: ClockLayoutMode = "Default"
