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
  "static-10",
  "static-11",
  "static-12",
  "static-13",
  "static-14",
  "static-15",
  "static-16",
  "static-17",
] as const

/** Gallery order: existing shader cards first, then static JPEG backgrounds. */
export const CLOCK_CARD_IDS = [...SHADER_CLOCK_CARD_IDS, ...STATIC_CLOCK_CARD_IDS] as const

export type ClockCardId = (typeof CLOCK_CARD_IDS)[number]

export function isClockCardId(s: string): s is ClockCardId {
  return (CLOCK_CARD_IDS as readonly string[]).includes(s)
}

/**
 * Filenames under `public/statics/` that do not follow `/statics/${id}.jpeg` (numeric names, mixed extensions).
 * Order matches appended ids static-10 … static-17.
 */
const STATIC_CLOCK_IMAGE_PATH_BY_ID: Partial<
  Record<(typeof STATIC_CLOCK_CARD_IDS)[number], string>
> = {
  "static-10": "/statics/13.jpeg",
  "static-11": "/statics/14.jpeg",
  "static-12": "/statics/15.jpeg",
  "static-13": "/statics/16.jpeg",
  "static-14": "/statics/17.jpeg",
  "static-15": "/statics/18.jpeg",
  "static-16": "/statics/19.png",
  "static-17": "/statics/static-12.jpeg",
}

/** Public URL for a static clock card image (`public/statics/`), or `null` for shader cards. */
export function getStaticClockImageSrc(id: ClockCardId): string | null {
  if (!(STATIC_CLOCK_CARD_IDS as readonly string[]).includes(id)) {
    return null
  }
  return STATIC_CLOCK_IMAGE_PATH_BY_ID[id as keyof typeof STATIC_CLOCK_IMAGE_PATH_BY_ID] ?? `/statics/${id}.jpeg`
}
