"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

/** iOS-like smooth step for on-screen travel (FLIP move). */
const easeFlipMove: [number, number, number, number] = [0.45, 0, 0.2, 1]
const defaultFlipInMoveDurationSec = 0.3

type ClockFlipOverlayProps = {
  /** Animation interpolates from this screen rect to `to`. */
  from: DOMRect
  to: DOMRect
  /** Fires when the FLIP transform finishes (opacity stays 1 — parent reveals real card, then unmounts overlay on next frame). */
  onMoveComplete: () => void
  children: React.ReactNode
  /** FLIP translation/scale duration (seconds). Flip-out uses a slightly shorter default. */
  moveDurationSec?: number
}

/**
 * FLIP-style move: fixed box at the destination rect, animate with transform only
 * (avoids per-frame layout on left/top/width/height — smoother with shader-heavy cards).
 */
export function ClockFlipOverlay({
  from,
  to,
  onMoveComplete,
  children,
  moveDurationSec = defaultFlipInMoveDurationSec,
}: ClockFlipOverlayProps) {
  const reduceMotion = useReducedMotion()
  const completed = React.useRef(false)

  const finish = React.useCallback(() => {
    if (completed.current) return
    completed.current = true
    onMoveComplete()
  }, [onMoveComplete])

  React.useEffect(() => {
    completed.current = false
  }, [from, to, onMoveComplete])

  React.useEffect(() => {
    if (reduceMotion) {
      finish()
    }
  }, [reduceMotion, finish])

  if (reduceMotion) {
    return null
  }

  const sx = to.width > 0 ? from.width / to.width : 1
  const sy = to.height > 0 ? from.height / to.height : 1

  const moveTransition = { duration: moveDurationSec, ease: easeFlipMove }

  return (
    <motion.div
      className="pointer-events-none fixed z-[200] overflow-hidden rounded-[32px] shadow-[0_12px_12px_-10px_rgba(15,23,42,0.28),0_4px_8px_-6px_rgba(15,23,42,0.16)] will-change-transform"
      style={{
        position: "fixed",
        left: to.left,
        top: to.top,
        width: to.width,
        height: to.height,
        transformOrigin: "top left",
      }}
      initial={{
        x: from.left - to.left,
        y: from.top - to.top,
        scaleX: sx,
        scaleY: sy,
      }}
      animate={{
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
      }}
      transition={moveTransition}
      onAnimationComplete={finish}
    >
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[32px] [&_*]:pointer-events-none">
        {children}
      </div>
    </motion.div>
  )
}
