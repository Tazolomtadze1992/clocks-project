/**
 * Shared hero sizing reference for the “Glass Container” layout mode in `clock-layout-face.tsx`.
 */
export const glassContainerHeroLayout = {
  /** Outer row: right-aligned glass, full card min height. */
  row: "relative flex w-full min-h-[164px] flex-row items-start justify-end",
  /**
   * Inset glass panel — tighter top/right than bottom so it doesn’t feel detached.
   * Vertical: mt-3 (12px) + panel h-[128px] + mb-6 (24px) = 164px card.
   */
  panel:
    "flex h-[128px] w-[min(50%,200px)] shrink-0 flex-col justify-between rounded-[22px] border border-white/25 bg-white/[0.18] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-xl backdrop-saturate-150 mb-6 mr-3 mt-3",
} as const
