"use client"

import * as React from "react"

import { ClockLayoutPreviewSurface } from "@/components/lumen/clock-layout-preview-surface"
import { ClockLayoutFace } from "@/components/lumen/clock-layout-face"
import type { ClockCardId } from "@/lib/lumen/clock-card-ids"
import { getLayoutPreviewPosterSrc } from "@/lib/lumen/clock-layout-preview-posters"
import type { ClockLayoutMode } from "@/lib/lumen/clock-layout-modes"
import { cn } from "@/lib/utils"

/** Matches the layout carousel chip shell width (`w-[112px]`). */
export const PREVIEW_FRAME_WIDTH_PX = 112
const PREVIEW_FRAME_HEIGHT_PX = 72

/**
 * Drawer layout strip preview: static poster image (or CSS fallback surface) +
 * {@link ClockLayoutFace} only. Does not mount Paper/WebGL ({@link ClockCardById}).
 */
export function ClockLayoutPreviewCard({
  clockId,
  now,
  layoutMode,
  className,
}: {
  clockId: ClockCardId
  now: Date
  layoutMode: ClockLayoutMode
  className?: string
}) {
  const posterSrc = getLayoutPreviewPosterSrc(clockId)
  const [posterFailed, setPosterFailed] = React.useState(false)
  const showPoster = Boolean(posterSrc) && !posterFailed

  return (
    <div
      className={cn(
        "pointer-events-none relative overflow-hidden rounded-[14px] ring-1 ring-inset ring-white/10",
        className
      )}
      style={{
        width: PREVIEW_FRAME_WIDTH_PX,
        height: PREVIEW_FRAME_HEIGHT_PX,
      }}
      aria-hidden
    >
      {showPoster ? (
        <img
          src={posterSrc!}
          alt=""
          draggable={false}
          className="absolute inset-0 size-full object-cover"
          onError={() => setPosterFailed(true)}
        />
      ) : (
        <ClockLayoutPreviewSurface clockId={clockId} />
      )}
      <div className="relative z-[1] flex h-full w-full items-stretch">
        <ClockLayoutFace mode={layoutMode} now={now} variant="thumb" />
      </div>
    </div>
  )
}
