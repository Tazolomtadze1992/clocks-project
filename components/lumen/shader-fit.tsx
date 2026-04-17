"use client"

import * as React from "react"

/**
 * Reference size from Paper exports. Gallery cards pair **height** with `CANVAS_W = 1200` so the
 * shader fills wide cards without grey side gutters (see `card-*-paper-*.tsx`).
 */
export const PAPER_CANVAS_800_600 = { width: 800, height: 600 } as const

/** Native LiquidMetal export from Paper — already wide; keep this canvas (not forced to 1200×600). */
export const PAPER_CANVAS_1115_836 = { width: 1115, height: 836 } as const

/** How {@link ShaderFit} maps the design canvas into its parent. */
export type ShaderFitMode = "card" | "cover"

const DEFAULT_COVER_FALLBACK_W = 390
const DEFAULT_COVER_FALLBACK_H = 844

/**
 * Renders Paper shaders at their design canvas size, then scales the whole layer.
 *
 * - **card**: fixed scale tuned for short gallery cards (~164px tall).
 * - **cover**: scales like CSS `object-fit: cover` so the layer fills a tall fullscreen parent
 *   (lock-screen preview) without leaving empty bands above/below.
 */
export function ShaderFit({
  children,
  width = 800,
  height = 600,
  scale = 0.42,
  x = 0,
  y = 0,
  mode = "card",
}: {
  children: React.ReactNode
  width?: number
  height?: number
  scale?: number
  x?: number
  y?: number
  mode?: ShaderFitMode
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [coverScale, setCoverScale] = React.useState(() =>
    Math.max(DEFAULT_COVER_FALLBACK_W / width, DEFAULT_COVER_FALLBACK_H / height)
  )

  React.useLayoutEffect(() => {
    if (mode !== "cover") return
    const el = containerRef.current
    if (!el) return

    const update = () => {
      const cr = el.getBoundingClientRect()
      if (cr.width <= 0 || cr.height <= 0) return
      const s = Math.max(cr.width / width, cr.height / height)
      setCoverScale(s * 1.002)
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [mode, width, height])

  const effectiveScale = mode === "cover" ? coverScale : scale

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width,
          height,
          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${effectiveScale})`,
          transformOrigin: "center",
        }}
      >
        {children}
      </div>
    </div>
  )
}
