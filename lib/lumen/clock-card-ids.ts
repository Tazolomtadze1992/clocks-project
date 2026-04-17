export const SHADER_CLOCK_CARD_IDS = ["1", "7"] as const

export const STATIC_CLOCK_CARD_IDS = [
  "static-1",
  "static-2",
  "static-3",
  "static-4",
  "static-5",
  "static-6",
  "static-7",
  "static-8",
  "static-9",
] as const

/** Gallery order: existing shader cards first, then static JPEG backgrounds. */
export const CLOCK_CARD_IDS = [...SHADER_CLOCK_CARD_IDS, ...STATIC_CLOCK_CARD_IDS] as const

export type ClockCardId = (typeof CLOCK_CARD_IDS)[number]

export function isClockCardId(s: string): s is ClockCardId {
  return (CLOCK_CARD_IDS as readonly string[]).includes(s)
}

/** Public URL for a static clock card JPEG (`public/statics/`), or `null` for shader cards. */
export function getStaticClockImageSrc(id: ClockCardId): string | null {
  if ((STATIC_CLOCK_CARD_IDS as readonly string[]).includes(id)) {
    return `/statics/${id}.jpeg`
  }
  return null
}
