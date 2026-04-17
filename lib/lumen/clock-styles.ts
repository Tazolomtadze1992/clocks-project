import type { ClockStyleId } from "./types"

export const CLOCK_STYLES: {
  id: ClockStyleId
  label: string
  description: string
}[] = [
  { id: "aurora", label: "Aurora", description: "Electric mesh, cyan and violet" },
  { id: "solar", label: "Solar", description: "Conic sweep, cream and sky" },
  { id: "noir", label: "Noir", description: "Deep black with contour drift" },
  { id: "plasma", label: "Plasma", description: "Magenta, orange, and teal fusion" },
  { id: "mist", label: "Mist", description: "Soft ink-blue atmosphere" },
  { id: "ascii", label: "ASCII", description: "Halftone grain field" },
]
