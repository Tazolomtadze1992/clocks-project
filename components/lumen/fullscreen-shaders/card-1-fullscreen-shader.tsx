"use client"

import { FlutedGlass, MeshGradient } from "@paper-design/shaders-react"


/**
 * Fullscreen-only backdrop for clock card 1 — portrait Paper preset (Apr 17, 2026).
 * Not used in gallery/detail card mode; see {@link Card1PaperMeshFlutedBackdrop}.
 */
const meshGradientFullscreenProps = {
  speed: 0.85,
  scale: 1,
  distortion: 0.97,
  swirl: 0.72,
  grainMixer: 0.44,
  grainOverlay: 0.33,
  frame: 3824381.8139976696,
  colors: ["#2EE6FF", "#000000", "#0B1BFF", "#FF7A00", "#FF2DAA", "#FFF2B8"] as string[],
}

const flutedGlassFullscreenProps = {
  size: 0.5,
  shape: "wave" as const,
  angle: 0,
  distortionShape: "lens" as const,
  distortion: 0.5,
  shift: 0,
  blur: 0,
  edges: 0.26,
  stretch: 0,
  scale: 1,
  fit: "cover" as const,
  highlights: 0,
  shadows: 0.62,
  colorBack: "#00000000",
  colorHighlight: "#FFFFFF99",
  colorShadow: "#000000",
}

type Card1FullscreenShaderProps = {
  animated?: boolean
}

export function Card1FullscreenShader({ animated = true }: Card1FullscreenShaderProps) {
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
        <FlutedGlass
          {...flutedGlassFullscreenProps}
          className="absolute -inset-px z-[1]"
          style={{
            width: "calc(100% + 2px)",
            height: "calc(100% + 2px)",
            opacity: 0.3,
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-black/10"
        aria-hidden
      />
    </>
  )
}
