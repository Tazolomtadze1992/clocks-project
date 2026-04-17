"use client"

import { Dithering } from "@paper-design/shaders-react"

import {
  PAPER_CANVAS_800_600,
  ShaderFit,
  type ShaderFitMode,
} from "@/components/lumen/shader-fit"

/** Paper Dithering preset — https://app.paper.design (Apr 16, 2026) */
const card8DitheringProps = {
  speed: 1,
  shape: "dots" as const,
  type: "random" as const,
  size: 3.9,
  scale: 0.71,
  frame: 3321700.3000003193,
  colorBack: "#00000000",
  colorFront: "#008000",
}

const CANVAS_W = 1200
const { height: CANVAS_H } = PAPER_CANVAS_800_600

// tune shader crop here — wider canvas prevents empty side gutters in wide cards; dot dither reads large so scale is slightly lower
const FIT = { scale: 0.36, x: 0, y: 0 }

type CardShaderAnimatedProps = {
  animated?: boolean
  shaderFitMode?: ShaderFitMode
}

export function Card8PaperDitheringShader({
  animated = true,
  shaderFitMode = "card",
}: CardShaderAnimatedProps) {
  const speed = animated ? card8DitheringProps.speed : 0
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
          <Dithering
            {...card8DitheringProps}
            speed={speed}
            className="absolute inset-0"
            style={{
              backgroundColor: "#000000",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </ShaderFit>
    </div>
  )
}

export function Card8PaperShaderOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] bg-black/10"
      aria-hidden
    />
  )
}
