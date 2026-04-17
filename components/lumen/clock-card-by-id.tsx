"use client"

import * as React from "react"

import { ClockBackdropById } from "@/components/lumen/clock-backdrop-by-id"
import { ClockLayoutFace } from "@/components/lumen/clock-layout-face"
import type { ClockCardId } from "@/lib/lumen/clock-card-ids"
import type { ClockLayoutMode } from "@/lib/lumen/clock-layout-modes"
import { DEFAULT_CLOCK_LAYOUT_MODE } from "@/lib/lumen/clock-layout-modes"
import { cn } from "@/lib/utils"

/** `className` can override `min-h-*` / `h-*` (e.g. FLIP overlay uses `min-h-0 h-full`) */
export const clockCardShellClass =
  "relative min-h-[164px] overflow-hidden rounded-[32px] shadow-[0_12px_12px_-10px_rgba(15,23,42,0.28),0_4px_8px_-6px_rgba(15,23,42,0.16)]"

function CardInnerWithLayout({
  layoutMode,
  now,
  fontColor,
}: {
  layoutMode: ClockLayoutMode
  now: Date
  /** CSS color for face typography (detail view). */
  fontColor?: string
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] flex items-stretch p-0">
      <ClockLayoutFace mode={layoutMode} now={now} variant="hero" fontColor={fontColor} />
    </div>
  )
}

type ClockCardByIdProps = {
  id: ClockCardId
  now: Date
  className?: string
  /** When false, Paper shader `speed` is 0 (frozen frame) for gallery performance */
  animated?: boolean
  /** Visual layout of the time/date layer (detail view). */
  layoutMode?: ClockLayoutMode
  /** Face text color (detail); defaults to white when omitted (gallery). */
  fontColor?: string
}

export const ClockCardById = React.memo(function ClockCardById({
  id,
  now,
  className,
  animated = true,
  layoutMode = DEFAULT_CLOCK_LAYOUT_MODE,
  fontColor,
}: ClockCardByIdProps) {
  return (
    <div className={cn(clockCardShellClass, className)}>
      <ClockBackdropById id={id} animated={animated} />
      <CardInnerWithLayout layoutMode={layoutMode} now={now} fontColor={fontColor} />
    </div>
  )
})
