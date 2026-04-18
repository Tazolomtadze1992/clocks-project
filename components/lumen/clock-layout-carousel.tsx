"use client"

import * as React from "react"
import { useReducedMotion } from "framer-motion"

import { ClockLayoutPreviewCard } from "@/components/lumen/clock-layout-preview-card"
import type { ClockCardId } from "@/lib/lumen/clock-card-ids"
import type { ClockLayoutMode } from "@/lib/lumen/clock-layout-modes"
import { cn } from "@/lib/utils"

const previewShellClass =
  "relative h-[72px] w-[112px] shrink-0 overflow-hidden rounded-[14px] shadow-[0_6px_16px_-6px_rgba(15,23,42,0.2)]"

/** Matches `easeOut` in clock-detail-view — picker micro-interaction. */
const indicatorTransitionClass =
  "origin-center transform-gpu transition-[opacity,scale] duration-[120ms] ease-[cubic-bezier(.23,1,.32,1)]"

type ClockLayoutCarouselProps = {
  /** Drives static preview palette (CSS only; not full {@link ClockCardById}). */
  clockId: ClockCardId
  options: readonly ClockLayoutMode[]
  selected: ClockLayoutMode
  onSelect: (mode: ClockLayoutMode) => void
  now: Date
}

export function ClockLayoutCarousel({ clockId, options, selected, onSelect, now }: ClockLayoutCarouselProps) {
  const reduceMotion = useReducedMotion()
  const hasMountedRef = React.useRef(false)
  const [previousSelected, setPreviousSelected] = React.useState<ClockLayoutMode | null>(null)
  const lastSelectedRef = React.useRef(selected)

  React.useEffect(() => {
    hasMountedRef.current = true
  }, [])

  React.useEffect(() => {
    if (lastSelectedRef.current !== selected) {
      setPreviousSelected(lastSelectedRef.current)
      lastSelectedRef.current = selected
    }
  }, [selected])

  return (
    <div
      className={cn(
        "flex gap-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      )}
    >
      {options.map((opt) => {
        const isOn = selected === opt
        const isPrevious = previousSelected === opt && !isOn
        const indicatorClassName = isOn
          ? "scale-100 opacity-100"
          : isPrevious
            ? "scale-[0.97] opacity-0"
            : "scale-[0.78] opacity-0"

        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className="flex shrink-0 flex-col items-center gap-2 rounded-lg text-left outline-none"
          >
            <div className={previewShellClass}>
              <div className="relative z-[1]">
                <ClockLayoutPreviewCard clockId={clockId} now={now} layoutMode={opt} />
              </div>
              <span
                className={cn(
                  "pointer-events-none absolute inset-[3px] z-[2] rounded-[11px] ring-2 ring-inset ring-white",
                  indicatorTransitionClass,
                  reduceMotion && "transition-none",
                  hasMountedRef.current
                    ? indicatorClassName
                    : isOn
                      ? "scale-100 opacity-100"
                      : "scale-[0.8] opacity-0"
                )}
                aria-hidden
              />
            </div>
            <span
              className={cn(
                "max-w-[112px] text-center text-[11px] font-medium leading-tight tracking-tight",
                isOn ? "text-zinc-900" : "text-zinc-500"
              )}
            >
              {opt}
            </span>
          </button>
        )
      })}
    </div>
  )
}
