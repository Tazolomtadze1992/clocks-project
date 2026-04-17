import type { ClockCardId } from "@/lib/lumen/clock-card-ids"
import { STATIC_CLOCK_CARD_IDS } from "@/lib/lumen/clock-card-ids"

const staticPosters = Object.fromEntries(
  STATIC_CLOCK_CARD_IDS.map((id) => [id, `/statics/${id}.jpeg`])
) as Record<(typeof STATIC_CLOCK_CARD_IDS)[number], string>

/**
 * Static poster paths under `public/posters/` (WebGL cards) or `public/statics/` (JPEG cards).
 * `null` means no asset yet — UI falls back to {@link ClockLayoutPreviewSurface}.
 */
export const LAYOUT_PREVIEW_POSTER_BY_CLOCK_ID: Record<ClockCardId, string | null> = {
  "1": "/posters/card-1-poster.webp",
  "7": "/posters/card-7-poster.webp",
  ...staticPosters,
}

export function getLayoutPreviewPosterSrc(clockId: ClockCardId): string | null {
  return LAYOUT_PREVIEW_POSTER_BY_CLOCK_ID[clockId]
}
