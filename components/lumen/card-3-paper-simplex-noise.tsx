"use client"

import { SimplexNoise } from "@paper-design/shaders-react"

import {
  PAPER_CANVAS_800_600,
  ShaderFit,
  type ShaderFitMode,
} from "@/components/lumen/shader-fit"

const card3SimplexNoiseProps = {
  speed: 2,
  scale: 0.2,
  stepsPerColor: 1,
  softness: 0,
  frame: 609443.3199999931,
  colors: ["#FF7B00", "#FFFFFF", "#000000"],
}

const CANVAS_W = 1200
const { height: CANVAS_H } = PAPER_CANVAS_800_600

// tune shader crop here — wider canvas prevents empty side gutters in wide cards
const FIT = { scale: 0.4, x: 0, y: 0 }

type Card3ShaderProps = {
  animated?: boolean
  shaderFitMode?: ShaderFitMode
}

/** Background layer for gallery card 3 — clipped by parent `overflow-hidden` + rounded corners */
export function Card3PaperSimplexNoiseShader({
  animated = true,
  shaderFitMode = "card",
}: Card3ShaderProps) {
  const speed = animated ? card3SimplexNoiseProps.speed : 0
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
          <SimplexNoise
            {...card3SimplexNoiseProps}
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

/** Optional tone-down between shader and glass (z-1) */
export function Card3PaperShaderOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] bg-black/10"
      aria-hidden
    />
  )
}
