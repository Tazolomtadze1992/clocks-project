import type { ClockCardId } from "@/lib/lumen/clock-card-ids"

/**
 * Static poster paths under `public/posters/` for layout drawer previews.
 * `null` means no asset yet — UI falls back to {@link ClockLayoutPreviewSurface}.
 */
export const LAYOUT_PREVIEW_POSTER_BY_CLOCK_ID: Record<ClockCardId, string | null> = {
  "1": "/posters/card-1-poster.webp",
  "2": "/posters/card-2-poster.webp",
  "3": "/posters/card-3-poster.webp",
  "4": null,
  "5": "/posters/card-5-poster.webp",
  "6": null,
  "7": "/posters/card-7-poster.webp",
  "8": "/posters/card-8-poster.webp",
}

export function getLayoutPreviewPosterSrc(clockId: ClockCardId): string | null {
  return LAYOUT_PREVIEW_POSTER_BY_CLOCK_ID[clockId]
}
