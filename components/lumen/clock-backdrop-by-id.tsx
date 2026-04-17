"use client"

import * as React from "react"

import { Card1PaperMeshFlutedBackdrop } from "@/components/lumen/card-1-paper-mesh-fluted"
import { Card2PaperShaderBackdrop } from "@/components/lumen/card-2-paper-liquid-metal"
import type { ShaderFitMode } from "@/components/lumen/shader-fit"
import {
  Card3PaperShaderOverlay,
  Card3PaperSimplexNoiseShader,
} from "@/components/lumen/card-3-paper-simplex-noise"
import {
  Card4PaperShaderOverlay,
  Card4PaperVoronoiShader,
} from "@/components/lumen/card-4-paper-voronoi"
import {
  Card5PaperShaderOverlay,
  Card5PaperVoronoiShader,
} from "@/components/lumen/card-5-paper-voronoi"
import {
  Card6PaperMeshGradientShader,
  Card6PaperShaderOverlay,
} from "@/components/lumen/card-6-paper-mesh-gradient"
import {
  Card7PaperMeshGradientShader,
  Card7PaperShaderOverlay,
} from "@/components/lumen/card-7-paper-mesh-gradient"
import {
  Card8PaperDitheringShader,
  Card8PaperShaderOverlay,
} from "@/components/lumen/card-8-paper-dithering"
import type { ClockCardId } from "@/lib/lumen/clock-card-ids"
import { cn } from "@/lib/utils"

type ClockBackdropByIdProps = {
  id: ClockCardId
  animated?: boolean
  className?: string
  /**
   * `fullscreen` scales the Paper canvas to cover the parent (lock-screen preview).
   * `card` keeps the tuned gallery crop. Gallery/detail cards omit this (default `card`).
   */
  variant?: "card" | "fullscreen"
}

/**
 * Paper/WebGL layers for a clock id — same sources as {@link ClockCardById}, without the card shell or layout face.
 * Use inside a `relative` parent (`absolute inset-0` or full-height flex).
 */
export function ClockBackdropById({
  id,
  animated = true,
  className,
  variant = "card",
}: ClockBackdropByIdProps) {
  const shaderFitMode: ShaderFitMode = variant === "fullscreen" ? "cover" : "card"

  const inner = (() => {
    switch (id) {
      case "1":
        return <Card1PaperMeshFlutedBackdrop animated={animated} shaderFitMode={shaderFitMode} />
      case "2":
        return <Card2PaperShaderBackdrop animated={animated} shaderFitMode={shaderFitMode} />
      case "3":
        return (
          <>
            <Card3PaperSimplexNoiseShader animated={animated} shaderFitMode={shaderFitMode} />
            <Card3PaperShaderOverlay />
          </>
        )
      case "4":
        return (
          <>
            <Card4PaperVoronoiShader animated={animated} shaderFitMode={shaderFitMode} />
            <Card4PaperShaderOverlay />
          </>
        )
      case "5":
        return (
          <>
            <Card5PaperVoronoiShader animated={animated} shaderFitMode={shaderFitMode} />
            <Card5PaperShaderOverlay />
          </>
        )
      case "6":
        return (
          <>
            <Card6PaperMeshGradientShader animated={animated} shaderFitMode={shaderFitMode} />
            <Card6PaperShaderOverlay />
          </>
        )
      case "7":
        return (
          <>
            <Card7PaperMeshGradientShader animated={animated} shaderFitMode={shaderFitMode} />
            <Card7PaperShaderOverlay />
          </>
        )
      case "8":
        return (
          <>
            <Card8PaperDitheringShader animated={animated} shaderFitMode={shaderFitMode} />
            <Card8PaperShaderOverlay />
          </>
        )
      default:
        return null
    }
  })()

  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full overflow-hidden [&>*]:absolute [&>*]:inset-0 [&>*]:h-full [&>*]:w-full",
        id === "2" && "bg-[#AAAAAC]",
        id === "4" || id === "5" || id === "6" || id === "7" ? "bg-[#f4f4f5]" : null,
        id === "8" && "bg-black",
        className
      )}
    >
      {inner}
    </div>
  )
}
