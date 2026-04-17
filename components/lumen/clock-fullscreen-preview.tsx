"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

import { ClockBackdropById } from "@/components/lumen/clock-backdrop-by-id"
import { ClockLayoutFace } from "@/components/lumen/clock-layout-face"
import type { ClockCardId } from "@/lib/lumen/clock-card-ids"
import type { ClockLayoutMode } from "@/lib/lumen/clock-layout-modes"
import { cn } from "@/lib/utils"

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Stagger vs. shell in clock-detail-view; exit slightly faster than shell (content-first dismiss). */
const faceEnterDelaySec = 0.05
const faceEnterDurationSec = 0.3
const faceExitDurationSec = 0.16

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
    const reduceMotion = useReducedMotion()
    const faceTransition = reduceMotion
      ? { duration: 0 }
      : {
          delay: faceEnterDelaySec,
          duration: faceEnterDurationSec,
          ease: easeOut,
        }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex min-h-0 min-w-full flex-1 flex-col overflow-hidden bg-black",
          className
        )}
      >
        <ClockBackdropById id={clockId} animated={animated} variant="fullscreen" />
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <motion.div
            className="pointer-events-none flex min-h-0 flex-1 flex-col px-5 pb-10 pt-4"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, transition: { duration: faceExitDurationSec, ease: easeOut } }
            }
            transition={faceTransition}
          >
            <ClockLayoutFace
              mode={layoutMode}
              now={now}
              variant="fullscreen"
              fontColor={fontColor}
            />
          </motion.div>
        </div>
      </div>
    )
  }
)
ClockFullscreenPreview.displayName = "ClockFullscreenPreview"
