"use client"

import { LiquidMetal } from "@paper-design/shaders-react"

import {
  PAPER_CANVAS_1115_836,
  ShaderFit,
  type ShaderFitMode,
} from "@/components/lumen/shader-fit"

/** Paper `LiquidMetal` preset for gallery card 2 — see @paper-design/shaders-react */
const card2LiquidMetalProps = {
  speed: 0.61,
  softness: 0.21,
  repetition: 1.5,
  shiftRed: 0.47,
  shiftBlue: 0.3,
  distortion: 0.08,
  contour: 0.77,
  scale: 1,
  rotation: 0,
  shape: "none" as const,
  angle: 54,
  frame: 208159.29299996953,
  colorBack: "#00000000",
  colorTint: "#FFFFFF",
}

const CANVAS_W = 1600
const { height: CANVAS_H } = PAPER_CANVAS_1115_836

// tune shader crop here — wider internal canvas gives the metal shader room to breathe in wide cards
const FIT = { scale: 0.52, x: 0, y: -18 }

type Card2ShaderProps = {
  animated?: boolean
  shaderFitMode?: ShaderFitMode
}

/**
 * Fills the parent card (clip via parent `overflow-hidden` + rounded corners).
 * Shader sits behind {@link Card2PaperShaderOverlay} and card text (higher z-index).
 */
export function Card2PaperLiquidMetalShader({
  animated = true,
  shaderFitMode = "card",
}: Card2ShaderProps) {
  const speed = animated ? card2LiquidMetalProps.speed : 0
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
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
          <LiquidMetal
            {...card2LiquidMetalProps}
            speed={speed}
            className="absolute inset-0"
            style={{
              backgroundColor: "#AAAAAC",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </ShaderFit>
    </div>
  )
}

/** Subtle darken layer between shader and typography */
export function Card2PaperShaderOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_18%_55%,rgba(7,82,75,0.42),transparent_34%),radial-gradient(circle_at_78%_52%,rgba(255,122,0,0.46),transparent_38%),linear-gradient(90deg,rgba(0,0,0,0.10),rgba(0,0,0,0.02),rgba(0,0,0,0.08))] mix-blend-multiply"
      aria-hidden
    />
  )
}

/** Shader + overlay; parent card should be `relative overflow-hidden rounded-*`. */
export function Card2PaperShaderBackdrop({
  animated = true,
  shaderFitMode = "card",
}: Card2ShaderProps) {
  return (
    <>
      <Card2PaperLiquidMetalShader animated={animated} shaderFitMode={shaderFitMode} />
      <Card2PaperShaderOverlay />
    </>
  )
}
