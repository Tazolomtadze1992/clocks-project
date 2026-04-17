/**
 * Target rect for the clock card in the detail hero (matches {@link ClockDetailView} layout).
 * `galleryHeaderPx` compensates: in gallery mode the scroll area sits below the app header;
 * in detail that header is gone, so the landing position is shifted up accordingly.
 *
 * Detail layout stacks: back row → flex-1 middle (`my-auto` cluster: hero + rows) → Preview footer.
 * The FLIP `to` rect must include the vertical offset of the centered cluster inside the middle region,
 * or the overlay lands high and the real hero “jumps” when the overlay unmounts.
 */
export function computeHeroRect(
  scrollAreaEl: HTMLElement,
  opts?: {
    backRowPx?: number
    heroHeight?: number
    /** App header height when gallery is visible; subtracted from scroll top for detail alignment */
    galleryHeaderPx?: number
    /** Detail hero `min-h` (card is vertically centered in inner padded area) */
    heroMinPx?: number
    heroPaddingTopPx?: number
    heroPaddingBottomPx?: number
    /**
     * Height of the bottom Preview strip (`pt-4` + CTA + bottom padding). Tune if safe-area inset differs.
     * Keep aligned with `ClockDetailView` Preview `motion.div` + button.
     */
    detailFooterPx?: number
    /**
     * Height of the centered cluster when Layout/Font rows are shown: hero block (`min-h-[220px]` row)
     * + controls `motion` block. Tune if row spacing changes.
     */
    detailClusterPx?: number
  }
): DOMRect {
  const backRowPx = opts?.backRowPx ?? 56
  const heroHeight = opts?.heroHeight ?? 164
  const galleryHeaderPx = opts?.galleryHeaderPx ?? 68
  const heroMinPx = opts?.heroMinPx ?? 220
  const heroPaddingTopPx = opts?.heroPaddingTopPx ?? 8
  const heroPaddingBottomPx = opts?.heroPaddingBottomPx ?? 24
  /** ~ `pt-4` + `h-14` + `pb-[max(12px,env(safe-area-inset-bottom))]` (0 safe-area baseline) */
  const detailFooterPx = opts?.detailFooterPx ?? 88
  /** ~ hero `min-h-[220px]` + `motion` (`pt-1`/`pb-4` + two `py-3` rows) */
  const detailClusterPx = opts?.detailClusterPx ?? 330

  const r = scrollAreaEl.getBoundingClientRect()
  const pad = 16
  const w = Math.min(r.width - pad * 2, 358)
  const left = r.left + (r.width - w) / 2

  const detailScrollTop = r.top - galleryHeaderPx
  const innerHeroH = heroMinPx - heroPaddingTopPx - heroPaddingBottomPx

  const middleHeight = Math.max(0, r.height - backRowPx - detailFooterPx)
  const clusterOffsetY = Math.max(0, (middleHeight - detailClusterPx) / 2)

  const top =
    detailScrollTop +
    backRowPx +
    clusterOffsetY +
    heroPaddingTopPx +
    Math.max(0, (innerHeroH - heroHeight) / 2)

  return new DOMRect(left, top, w, heroHeight)
}
