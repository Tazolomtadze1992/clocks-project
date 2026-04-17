"use client"

import * as React from "react"

import { Card1PaperMeshFlutedBackdrop } from "@/components/lumen/card-1-paper-mesh-fluted"
import { Card1FullscreenShader } from "@/components/lumen/fullscreen-shaders/card-1-fullscreen-shader"
import type { ShaderFitMode } from "@/components/lumen/shader-fit"
import {
  Card7PaperMeshGradientShader,
  Card7PaperShaderOverlay,
} from "@/components/lumen/card-7-paper-mesh-gradient"
import { Card7FullscreenShader } from "@/components/lumen/fullscreen-shaders/card-7-fullscreen-shader"
import { ClockStaticImageBackdrop } from "@/components/lumen/clock-static-image-backdrop"
import { getStaticClockImageSrc, type ClockCardId } from "@/lib/lumen/clock-card-ids"
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
 * Backdrop for a clock id: Paper/WebGL shaders, or a full-bleed static JPEG — same sources as {@link ClockCardById},
 * without the card shell or layout face. Use inside a `relative` parent (`absolute inset-0` or full-height flex).
 */
export function ClockBackdropById({
  id,
  animated = true,
  className,
  variant = "card",
}: ClockBackdropByIdProps) {
  const shaderFitMode: ShaderFitMode = variant === "fullscreen" ? "cover" : "card"

  const staticSrc = getStaticClockImageSrc(id)

  const inner = staticSrc ? (
    <ClockStaticImageBackdrop src={staticSrc} />
  ) : (() => {
    switch (id) {
      case "1":
        return variant === "fullscreen" ? (
          <Card1FullscreenShader animated={animated} />
        ) : (
          <Card1PaperMeshFlutedBackdrop animated={animated} shaderFitMode={shaderFitMode} />
        )
      case "7":
        return variant === "fullscreen" ? (
          <Card7FullscreenShader animated={animated} />
        ) : (
          <>
            <Card7PaperMeshGradientShader animated={animated} shaderFitMode={shaderFitMode} />
            <Card7PaperShaderOverlay />
          </>
        )
      default:
        return null
    }
  })()

  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full min-h-full min-w-full overflow-hidden [&>*]:absolute",
        variant === "fullscreen"
          ? "[&>*]:!-inset-px [&>*]:!h-[calc(100%+2px)] [&>*]:!w-[calc(100%+2px)]"
          : "[&>*]:inset-0 [&>*]:h-full [&>*]:w-full",
        /* Card mode: light base behind shaders. Fullscreen: black so subpixel gaps read as shadow, not white stripes. */
        variant === "fullscreen"
          ? "bg-black"
          : id === "7"
            ? "bg-[#f4f4f5]"
            : null,
        className
      )}
    >
      {inner}
    </div>
  )
}
