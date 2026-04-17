"use client"

import { Voronoi } from "@paper-design/shaders-react"

import {
  PAPER_CANVAS_800_600,
  ShaderFit,
  type ShaderFitMode,
} from "@/components/lumen/shader-fit"

/** Paper Voronoi preset — https://app.paper.design (Apr 16, 2026) */
const card5VoronoiProps = {
  speed: 0.5,
  scale: 0.5,
  distortion: 0.5,
  gap: 0.04,
  glow: 0.38,
  stepsPerColor: 3,
  frame: 508715.99999999744,
  colorGlow: "#FFFFFF",
  colorGap: "#2E0000",
  colors: ["#FF8247", "#FFE53D", "#494000", "#D576B2"],
}

const CANVAS_W = 1200
const { height: CANVAS_H } = PAPER_CANVAS_800_600

// tune shader crop here — wider canvas prevents empty side gutters in wide cards
const FIT = { scale: 0.38, x: 0, y: 0 }

type CardShaderAnimatedProps = {
  animated?: boolean
  shaderFitMode?: ShaderFitMode
}

export function Card5PaperVoronoiShader({
  animated = true,
  shaderFitMode = "card",
}: CardShaderAnimatedProps) {
  const speed = animated ? card5VoronoiProps.speed : 0
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
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
          <Voronoi
            {...card5VoronoiProps}
            speed={speed}
            className="absolute inset-0"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </ShaderFit>
    </div>
  )
}

export function Card5PaperShaderOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] bg-black/10"
      aria-hidden
    />
  )
}
