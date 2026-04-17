"use client"

import * as React from "react"

import { ClockBackdropById } from "@/components/lumen/clock-backdrop-by-id"
import { ClockLayoutFace } from "@/components/lumen/clock-layout-face"
import type { ClockCardId } from "@/lib/lumen/clock-card-ids"
import type { ClockLayoutMode } from "@/lib/lumen/clock-layout-modes"
import { cn } from "@/lib/utils"

export type ClockFullscreenPreviewProps = {
  clockId: ClockCardId
  now: Date
  layoutMode: ClockLayoutMode
  fontColor: string
  animated?: boolean
  className?: string
}

/**
 * Lock-screen style preview: selected shader fills the surface; {@link ClockLayoutFace} on top (no rounded card shell).
 */
export const ClockFullscreenPreview = React.forwardRef<HTMLDivElement, ClockFullscreenPreviewProps>(
  function ClockFullscreenPreviewInner({ clockId, now, layoutMode, fontColor, animated = true, className }, ref) {
    return (
      <div
        ref={ref}
        className={cn("relative flex min-h-0 w-full flex-1 flex-col overflow-hidden", className)}
      >
        <ClockBackdropById id={clockId} animated={animated} variant="fullscreen" />
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <div className="pointer-events-none flex min-h-0 flex-1 flex-col px-5 pb-10 pt-4">
            <ClockLayoutFace
              mode={layoutMode}
              now={now}
              variant="fullscreen"
              fontColor={fontColor}
            />
          </div>
        </div>
      </div>
    )
  }
)
ClockFullscreenPreview.displayName = "ClockFullscreenPreview"
