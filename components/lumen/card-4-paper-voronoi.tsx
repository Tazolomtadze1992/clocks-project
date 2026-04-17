"use client"

import { Voronoi } from "@paper-design/shaders-react"

import {
  PAPER_CANVAS_800_600,
  ShaderFit,
  type ShaderFitMode,
} from "@/components/lumen/shader-fit"

/** Paper Voronoi preset — https://app.paper.design (Apr 16, 2026) */
const card4VoronoiProps = {
  speed: 0.5,
  scale: 2.15,
  distortion: 0.38,
  gap: 0,
  glow: 1,
  stepsPerColor: 4,
  frame: 508778.24999999744,
  colorGlow: "#FF00D0",
  colorGap: "#FF00D0",
  colors: ["#FFFFFFFC", "#BBFF00", "#00FFFF"],
}

const CANVAS_W = 1200
const { height: CANVAS_H } = PAPER_CANVAS_800_600

// tune shader crop here — wider canvas prevents empty side gutters in wide cards
const FIT = { scale: 0.36, x: 0, y: 0 }

type CardShaderAnimatedProps = {
  animated?: boolean
  shaderFitMode?: ShaderFitMode
}

export function Card4PaperVoronoiShader({
  animated = true,
  shaderFitMode = "card",
}: CardShaderAnimatedProps) {
  const speed = animated ? card4VoronoiProps.speed : 0
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
            {...card4VoronoiProps}
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

export function Card4PaperShaderOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] bg-black/10"
      aria-hidden
    />
  )
}
