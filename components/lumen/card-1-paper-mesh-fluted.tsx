"use client"

import { FlutedGlass, MeshGradient } from "@paper-design/shaders-react"

import {
  PAPER_CANVAS_800_600,
  ShaderFit,
  type ShaderFitMode,
} from "@/components/lumen/shader-fit"

const card1MeshGradientProps = {
  speed: 0.55,
  scale: 1,
  distortion: 0.64,
  swirl: 0.24,
  grainMixer: 0.44,
  grainOverlay: 0.33,
  frame: 3301654.0549995303,
  colors: ["#2EE6FF", "#000000", "#0B1BFF", "#FF7A00", "#FF2DAA", "#FFF2B8"],
}

const card1FlutedGlassProps = {
  size: 0.5,
  shape: "wave" as const,
  angle: 0,
  distortionShape: "lens" as const,
  distortion: 0.5,
  shift: 0,
  blur: 0,
  edges: 0.25,
  stretch: 0,
  scale: 1,
  fit: "cover" as const,
  highlights: 0.15,
  shadows: 0.25,
  colorBack: "#00000000",
  colorHighlight: "#FFFFFF99",
  colorShadow: "#000000",
}

const CANVAS_W = 1200
const { height: CANVAS_H } = PAPER_CANVAS_800_600

// tune shader crop here — wider canvas prevents empty side gutters in wide cards
const FIT = { scale: 0.38, x: 0, y: 0 }

type Card1BackdropProps = {
  /** When false, shader time is frozen (speed 0) for gallery performance */
  animated?: boolean
  /** `cover` fills tall parents (fullscreen preview); `card` keeps gallery crop/scale. */
  shaderFitMode?: ShaderFitMode
}

/**
 * MeshGradient (base) + FlutedGlass (glass layer), clipped by parent
 * `overflow-hidden` + rounded corners. Overlay aids text contrast (z-2).
 */
export function Card1PaperMeshFlutedBackdrop({
  animated = true,
  shaderFitMode = "card",
}: Card1BackdropProps) {
  const meshSpeed = animated ? card1MeshGradientProps.speed : 0
  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <ShaderFit
          width={CANVAS_W}
          height={CANVAS_H}
          scale={FIT.scale}
          x={FIT.x}
          y={FIT.y}
          mode={shaderFitMode}
        >
          <div
            className="relative"
            style={{ width: CANVAS_W, height: CANVAS_H }}
          >
            <MeshGradient
              {...card1MeshGradientProps}
              speed={meshSpeed}
              className="absolute inset-0 z-0"
              style={{ width: "100%", height: "100%" }}
            />
            <FlutedGlass
              {...card1FlutedGlassProps}
              className="absolute inset-0 z-[1]"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </ShaderFit>
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-black/10"
        aria-hidden
      />
    </>
  )
}
