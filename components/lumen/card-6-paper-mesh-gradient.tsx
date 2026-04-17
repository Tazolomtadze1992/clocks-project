"use client"

import { MeshGradient } from "@paper-design/shaders-react"

import {
  PAPER_CANVAS_800_600,
  ShaderFit,
  type ShaderFitMode,
} from "@/components/lumen/shader-fit"

/** Paper MeshGradient preset — https://app.paper.design (Apr 16, 2026) */
const card6MeshGradientProps = {
  speed: 0.55,
  scale: 1,
  distortion: 0.64,
  swirl: 0.24,
  grainMixer: 0.44,
  grainOverlay: 0.33,
  frame: 3198522.6199995256,
  colors: ["#2EE6FF", "#000000", "#0B1BFF", "#FF7A00", "#FF2DAA", "#FFF2B8"],
}

const CANVAS_W = 1200
const { height: CANVAS_H } = PAPER_CANVAS_800_600

// tune shader crop here — wider canvas prevents empty side gutters in wide cards
const FIT = { scale: 0.38, x: 0, y: 0 }

type CardShaderAnimatedProps = {
  animated?: boolean
  shaderFitMode?: ShaderFitMode
}

export function Card6PaperMeshGradientShader({
  animated = true,
  shaderFitMode = "card",
}: CardShaderAnimatedProps) {
  const speed = animated ? card6MeshGradientProps.speed : 0
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
            {...card6MeshGradientProps}
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

export function Card6PaperShaderOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] bg-black/10"
      aria-hidden
    />
  )
}
