"use client"

import * as React from "react"
import { useReducedMotion } from "framer-motion"
import { X } from "lucide-react"
import { Drawer } from "vaul"

import { ClockLayoutCarousel } from "@/components/lumen/clock-layout-carousel"
import type { ClockCardId } from "@/lib/lumen/clock-card-ids"
import type { FontColorId } from "@/lib/lumen/font-color-options"
import { FONT_COLOR_CSS, fontColorLabel } from "@/lib/lumen/font-color-options"
import type { ClockLayoutMode } from "@/lib/lumen/clock-layout-modes"
import { cn } from "@/lib/utils"

/** Matches `easeOut` in clock-detail-view — picker micro-interaction. */
const swatchIndicatorTransitionClass =
  "origin-center transform-gpu transition-[opacity,scale] duration-[120ms] ease-[cubic-bezier(.23,1,.32,1)]"

export type ClockOptionDrawerVariant = "cards" | "rows" | "layoutCarousel" | "fontSwatches"

export type ClockOptionDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  options: readonly string[]
  selected: string
  onSelect: (value: string) => void
  variant: ClockOptionDrawerVariant
  /** Required when `variant` is `layoutCarousel` (shared clock time for preview thumbnails). */
  layoutCarouselNow?: Date
  /** Static preview palette only (CSS); must match the open detail clock. Not a live shader mount. */
  layoutCarouselClockId?: ClockCardId
  /** Portals the drawer into this node (pass from `Drawer.Root` only; do not set on `Drawer.Portal`). */
  container?: HTMLElement | null
}

export function ClockOptionDrawer({
  open,
  onOpenChange,
  title,
  options,
  selected,
  onSelect,
  variant,
  layoutCarouselNow,
  layoutCarouselClockId,
  container,
}: ClockOptionDrawerProps) {
  /** Without this, `fixed` overlay/sheet stay viewport-anchored even when Radix portals into the phone. */
  const inPhone = Boolean(container)
  const reduceMotion = useReducedMotion()
  const hasMountedSwatchesRef = React.useRef(false)
  const [previousFontId, setPreviousFontId] = React.useState<FontColorId | null>(null)
  const lastFontRef = React.useRef(selected)
  const prevVariantRef = React.useRef(variant)

  React.useEffect(() => {
    hasMountedSwatchesRef.current = true
  }, [])

  React.useEffect(() => {
    if (variant === "fontSwatches" && prevVariantRef.current !== "fontSwatches") {
      lastFontRef.current = selected
      setPreviousFontId(null)
    }
    prevVariantRef.current = variant
  }, [variant, selected])

  React.useEffect(() => {
    if (variant !== "fontSwatches") return
    if (lastFontRef.current !== selected) {
      setPreviousFontId(lastFontRef.current as FontColorId)
      lastFontRef.current = selected
    }
  }, [selected, variant])

  return (
    <Drawer.Root
      open={open}
      onOpenChange={onOpenChange}
      container={container ?? undefined}
      shouldScaleBackground={false}
      modal
    >
      <Drawer.Portal>
        <Drawer.Overlay
          className={cn(
            "inset-0 z-40 bg-zinc-950/[0.14]",
            inPhone ? "absolute" : "fixed"
          )}
        />
        <Drawer.Content
          className={cn(
            "bottom-0 left-0 right-0 z-50 flex flex-col outline-none",
            inPhone ? "absolute max-h-[min(520px,85%)]" : "fixed max-h-[min(520px,85vh)]",
            "rounded-t-[28px] bg-white shadow-[0_-12px_48px_-12px_rgba(15,23,42,0.12)]"
          )}
          aria-describedby={undefined}
        >
          <div className="flex min-h-0 flex-1 flex-col px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-2">
            <div className="mx-auto mb-5 h-1 w-10 shrink-0 rounded-full bg-zinc-200" aria-hidden />

            <div className={cn("flex shrink-0 items-center justify-between gap-3", variant === "fontSwatches" ? "mb-7" : "mb-5")}>
              <Drawer.Title className="text-[17px] font-semibold leading-snug tracking-tight text-zinc-900">
                {title}
              </Drawer.Title>
              <Drawer.Close
                type="button"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors transition-transform duration-150 hover:bg-zinc-200/90 active:scale-[0.97]"
                aria-label="Close"
              >
                <X className="size-[16px]" strokeWidth={3.5} />
              </Drawer.Close>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
              {variant === "layoutCarousel" && layoutCarouselNow && layoutCarouselClockId ? (
                <ClockLayoutCarousel
                  clockId={layoutCarouselClockId}
                  options={options as readonly ClockLayoutMode[]}
                  selected={selected as ClockLayoutMode}
                  onSelect={(mode) => onSelect(mode)}
                  now={layoutCarouselNow}
                />
              ) : variant === "fontSwatches" ? (
                <div className="flex flex-wrap justify-between gap-y-3 pb-1">
                  {(options as readonly FontColorId[]).map((id) => {
                    const isOn = selected === id
                    const isPrevious = previousFontId === id && !isOn
                    const fill = FONT_COLOR_CSS[id]
                    const indicatorClassName = isOn
                      ? "scale-100 opacity-100"
                      : isPrevious
                        ? "scale-[0.3] opacity-0"
                        : "scale-[0.3] opacity-0"
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => onSelect(id)}
                        className={cn(
                          "relative flex size-8 shrink-0 items-center justify-center rounded-full outline-none transition active:scale-[0.97]",
                          id === "white" && "border border-zinc-200"
                        )}
                        style={{ backgroundColor: fill }}
                        aria-label={fontColorLabel(id)}
                        aria-pressed={isOn}
                      >
                        <span
                          className={cn(
                            "pointer-events-none absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-zinc-200",
                            swatchIndicatorTransitionClass,
                            reduceMotion && "transition-none",
                            hasMountedSwatchesRef.current
                              ? indicatorClassName
                              : isOn
                                ? "scale-100 opacity-100"
                                : "scale-[0.3] opacity-0"
                          )}
                          aria-hidden
                        />
                      </button>
                    )
                  })}
                </div>
              ) : variant === "cards" ? (
                <div className="grid grid-cols-2 gap-2.5 pb-1">
                  {options.map((opt) => {
                    const isOn = selected === opt
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => onSelect(opt)}
                        className={cn(
                          "rounded-2xl border px-3 py-3.5 text-left text-[14px] font-medium leading-tight tracking-tight transition",
                          isOn
                            ? "border-zinc-900 bg-zinc-50 text-zinc-900"
                            : "border-zinc-200/90 bg-zinc-50/40 text-zinc-900 hover:border-zinc-300/90"
                        )}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-1 pb-1">
                  {options.map((opt) => {
                    const isOn = selected === opt
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => onSelect(opt)}
                        className={cn(
                          "flex w-full items-center rounded-xl px-3.5 py-3.5 text-left text-[15px] font-medium leading-none tracking-tight transition",
                          isOn ? "bg-zinc-100 text-zinc-900" : "text-zinc-900 hover:bg-zinc-50"
                        )}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <Drawer.Close asChild>
              <button
                type="button"
                className={cn(
                  "flex h-12 w-full shrink-0 items-center justify-center rounded-full bg-control-soft text-[15px] font-semibold text-zinc-900 transition-colors transition-transform duration-150 hover:bg-control-soft-hover active:scale-[0.97]",
                  variant === "fontSwatches" ? "mt-7" : "mt-5"
                )}
              >
                Save
              </button>
            </Drawer.Close>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
