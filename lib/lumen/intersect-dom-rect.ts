/**
 * Intersects `rect` with `bounds` (both in viewport space, e.g. from `getBoundingClientRect()`).
 * Used so FLIP animations use only the on-screen portion of a gallery card / hero when clipped
 * by the scrollport or phone shell.
 */
export function intersectDomRectWithBounds(
  rect: DOMRectReadOnly,
  bounds: DOMRectReadOnly
): DOMRect {
  const left = Math.max(rect.left, bounds.left)
  const top = Math.max(rect.top, bounds.top)
  const right = Math.min(rect.right, bounds.right)
  const bottom = Math.min(rect.bottom, bounds.bottom)
  const width = right - left
  const height = bottom - top
  if (width <= 0 || height <= 0) {
    return new DOMRect(rect.x, rect.y, rect.width, rect.height)
  }
  return new DOMRect(left, top, width, height)
}
