import type { ClockCardId } from "@/lib/lumen/clock-card-ids"
import { getDefaultLayoutForClockId } from "@/lib/lumen/default-layout-by-clock-id"
import type { ClockLayoutMode } from "@/lib/lumen/clock-layout-modes"
import { DEFAULT_FONT_COLOR_ID, type FontColorId } from "@/lib/lumen/font-color-options"

/** User-editable visual settings for a clock card (gallery + detail share this). */
export type ClockCardAppearance = {
  layoutMode: ClockLayoutMode
  fontColorId: FontColorId
}

export function defaultAppearanceForClockId(id: ClockCardId): ClockCardAppearance {
  return {
    layoutMode: getDefaultLayoutForClockId(id),
    fontColorId: DEFAULT_FONT_COLOR_ID,
  }
}

export function resolveClockCardAppearance(
  store: Partial<Record<ClockCardId, ClockCardAppearance>>,
  id: ClockCardId
): ClockCardAppearance {
  return store[id] ?? defaultAppearanceForClockId(id)
}
