import type { ClockCardId } from "@/lib/lumen/clock-card-ids"
import type { ClockLayoutMode } from "@/lib/lumen/clock-layout-modes"

/**
 * Curated initial layout per clock card for gallery + first detail open.
 * Users can still pick any mode from the Layout drawer; this is only the starting selection.
 */
export const DEFAULT_LAYOUT_BY_CLOCK_ID: Record<ClockCardId, ClockLayoutMode> = {
  "1": "Default",
  "7": "Thunder",
  "static-1": "Default",
  "static-2": "Centered",
  "static-3": "Glass Container",
  "static-4": "Small Corners",
  "static-5": "Bottom Row",
  "static-6": "Thunder",
  "static-7": "Centered",
  "static-8": "Glass Container",
  "static-9": "Bottom Row",
}

export function getDefaultLayoutForClockId(clockId: ClockCardId): ClockLayoutMode {
  return DEFAULT_LAYOUT_BY_CLOCK_ID[clockId]
}
