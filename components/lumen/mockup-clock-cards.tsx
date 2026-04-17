"use client"

import * as React from "react"

// Paper shaders are scaled into cards via `ShaderFit` — see ./shader-fit.tsx and per-card tune comments in card-*.tsx

import { ClockCardById } from "@/components/lumen/clock-card-by-id"
import { CLOCK_CARD_IDS, type ClockCardId } from "@/lib/lumen/clock-card-ids"
import { cn } from "@/lib/utils"

export type MockupClockCardsProps = {
  now: Date
  className?: string
  /** Called with the card root element (button) for FLIP measurement */
  onCardSelect?: (id: ClockCardId, element: HTMLElement) => void
  registerCardRef?: (id: ClockCardId, element: HTMLElement | null) => void
  /** During FLIP, hide the source card (keeps layout; avoids duplicate) */
  hiddenCardId?: ClockCardId | null
  /** When true, no opacity transition on card buttons — instant hide/reveal for flip-out handoff. */
  disableOpacityTransitions?: boolean
}

export function MockupClockCards({
  now,
  className,
  onCardSelect,
  registerCardRef,
  hiddenCardId,
  disableOpacityTransitions = false,
}: MockupClockCardsProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {CLOCK_CARD_IDS.map((id) => (
        <button
          key={id}
          type="button"
          ref={(el) => registerCardRef?.(id, el)}
          className={cn(
            "w-full rounded-[32px] text-left outline-none focus-visible:ring-2 focus-visible:ring-zinc-300/80 focus-visible:ring-offset-2",
            !disableOpacityTransitions && "transition-opacity active:opacity-95",
            id === hiddenCardId && "pointer-events-none opacity-0"
          )}
          onClick={(e) => onCardSelect?.(id, e.currentTarget)}
        >
          <ClockCardById id={id} now={now} animated={id === "1"} />
        </button>
      ))}
    </div>
  )
}

export {
  PAPER_CANVAS_1115_836,
  PAPER_CANVAS_800_600,
  ShaderFit,
} from "./shader-fit"
