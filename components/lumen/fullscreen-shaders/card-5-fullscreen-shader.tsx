"use client"

import { Voronoi } from "@paper-design/shaders-react"

/**
 * Fullscreen-only backdrop for clock card 5 — portrait Voronoi preset (Apr 17, 2026).
 * Not used in gallery/detail card mode; see {@link Card5PaperVoronoiShader}.
 */
const voronoiFullscreenProps = {
  speed: 0.5,
  scale: 0.5,
  distortion: 0.5,
  gap: 0.04,
  glow: 0.38,
  stepsPerColor: 3,
  frame: 1258904.700000503,
  colorGlow: "#FFFFFF",
  colorGap: "#2E0000",
  colors: ["#FF8247", "#FFE53D", "#494000", "#D576B2"] as string[],
}

type Card5FullscreenShaderProps = {
  animated?: boolean
}

export function Card5FullscreenShader({ animated = true }: Card5FullscreenShaderProps) {
  const voronoiSpeed = animated ? voronoiFullscreenProps.speed : 0

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden"
        aria-hidden
      >
        <Voronoi
          {...voronoiFullscreenProps}
          speed={voronoiSpeed}
          className="absolute -inset-px z-0"
          style={{ width: "calc(100% + 2px)", height: "calc(100% + 2px)" }}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-black/10"
        aria-hidden
      />
    </>
  )
}
