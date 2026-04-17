"use client"

import { MeshGradient } from "@paper-design/shaders-react"

/**
 * Fullscreen-only backdrop for clock card 7 — portrait MeshGradient preset (Apr 17, 2026).
 * Not used in gallery/detail card mode; see {@link Card7PaperMeshGradientShader}.
 */
const meshGradientFullscreenProps = {
  speed: 1,
  scale: 0.68,
  distortion: 0.44,
  swirl: 0.04,
  grainMixer: 0.21,
  grainOverlay: 0.04,
  frame: 4805090.699999799,
  colors: ["#D2CCC9", "#FFC632", "#FA491B", "#350D1B", "#84B8CE", "#4B5472"] as string[],
}

type Card7FullscreenShaderProps = {
  animated?: boolean
}

export function Card7FullscreenShader({ animated = true }: Card7FullscreenShaderProps) {
  const meshSpeed = animated ? meshGradientFullscreenProps.speed : 0

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden"
        aria-hidden
      >
        <MeshGradient
          {...meshGradientFullscreenProps}
          speed={meshSpeed}
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
