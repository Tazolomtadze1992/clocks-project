export const CLOCK_CARD_IDS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const

export type ClockCardId = (typeof CLOCK_CARD_IDS)[number]

export function isClockCardId(s: string): s is ClockCardId {
  return (CLOCK_CARD_IDS as readonly string[]).includes(s)
}
