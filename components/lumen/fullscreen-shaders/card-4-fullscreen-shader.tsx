"use client"

import { Voronoi } from "@paper-design/shaders-react"

/**
 * Fullscreen-only backdrop for clock card 4 — portrait Voronoi preset (Apr 17, 2026).
 * Not used in gallery/detail card mode; see {@link Card4PaperVoronoiShader}.
 */
const voronoiFullscreenProps = {
  speed: 0.5,
  scale: 0.82,
  distortion: 0.38,
  gap: 0,
  glow: 1,
  stepsPerColor: 4,
  frame: 1258666.9500004933,
  colorGlow: "#FF00D0",
  colorGap: "#FF00D0",
  colors: ["#FFFFFFFC", "#BBFF00", "#00FFFF"] as string[],
}

type Card4FullscreenShaderProps = {
  animated?: boolean
}

export function Card4FullscreenShader({ animated = true }: Card4FullscreenShaderProps) {
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
