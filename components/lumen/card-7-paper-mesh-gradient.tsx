"use client"

import { MeshGradient } from "@paper-design/shaders-react"

import {
  PAPER_CANVAS_800_600,
  ShaderFit,
  type ShaderFitMode,
} from "@/components/lumen/shader-fit"

/** Paper MeshGradient preset — https://app.paper.design (Apr 16, 2026) */
const card7MeshGradientProps = {
  speed: 1,
  scale: 0.68,
  distortion: 0.44,
  swirl: 0.04,
  grainMixer: 0.21,
  grainOverlay: 0.04,
  frame: 4060222.7000003103,
  colors: ["#D2CCC9", "#FFC632", "#FA491B", "#350D1B", "#84B8CE", "#4B5472"],
}

const CANVAS_W = 1200
const { height: CANVAS_H } = PAPER_CANVAS_800_600

// tune shader crop here — wider canvas prevents empty side gutters in wide cards
const FIT = { scale: 0.38, x: 0, y: 0 }

type CardShaderAnimatedProps = {
  animated?: boolean
  shaderFitMode?: ShaderFitMode
}

export function Card7PaperMeshGradientShader({
  animated = true,
  shaderFitMode = "card",
}: CardShaderAnimatedProps) {
  const speed = animated ? card7MeshGradientProps.speed : 0
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
          <MeshGradient
            {...card7MeshGradientProps}
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

export function Card7PaperShaderOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] bg-black/10"
      aria-hidden
    />
  )
}
