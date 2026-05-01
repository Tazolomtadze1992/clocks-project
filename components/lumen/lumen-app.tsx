"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

import { ClockCardById } from "@/components/lumen/clock-card-by-id"
import { ClockDetailView } from "@/components/lumen/clock-detail-view"
import { ClockFlipOverlay } from "@/components/lumen/clock-flip-overlay"
import { MockupClockCards } from "@/components/lumen/mockup-clock-cards"
import { PhoneShell } from "@/components/lumen/phone-shell"
import type { ClockCardId } from "@/lib/lumen/clock-card-ids"
import {
  resolveClockCardAppearance,
  type ClockCardAppearance,
} from "@/lib/lumen/clock-card-appearance"
import { DEFAULT_CLOCK_LAYOUT_MODE, type ClockLayoutMode } from "@/lib/lumen/clock-layout-modes"
import { FONT_COLOR_CSS } from "@/lib/lumen/font-color-options"
import { intersectDomRectWithBounds } from "@/lib/lumen/intersect-dom-rect"
import { useTickingClock } from "@/lib/lumen/use-ticking-clock"
import { cn } from "@/lib/utils"

function IosStatusBar({ now, className }: { now: Date; className?: string }) {
  const h = now.getHours() % 12 || 12
  const m = String(now.getMinutes()).padStart(2, "0")
  const display = `${h}:${m}`

  return (
    <div
      className={cn(
        "flex items-center justify-between px-5 pb-2 pt-[10px] text-[13px] text-zinc-900",
        className
      )}
    >
      <span className="px-2.5 py-1 text-[14px] font-medium leading-none text-zinc-900 tabular-nums">
        {display}
      </span>
      <div className="flex items-center gap-1.5 pr-0.5">
        <svg width="19" height="12" viewBox="0 0 19 12" fill="none" aria-hidden className="text-zinc-900">
          <rect x="0" y="7" width="3" height="5" rx="1" fill="currentColor" />
          <rect x="5" y="5" width="3" height="7" rx="1" fill="currentColor" />
          <rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" />
          <rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" />
        </svg>
        <span className="text-[13px] font-semibold tracking-tight">5G</span>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden className="text-zinc-900">
          <rect
            x="1"
            y="2.5"
            width="21"
            height="8"
            rx="2.25"
            stroke="currentColor"
            strokeOpacity="0.38"
            strokeWidth="1"
          />
          <rect x="23" y="4.5" width="2.5" height="4" rx="0.75" fill="currentColor" fillOpacity="0.38" />
          <rect x="2.5" y="4" width="16" height="5" rx="1.25" fill="currentColor" />
          <path
            d="M9.5 4.8 11.2 6.5 9.5 8.2 8.8 7.5 9.8 6.5 8.8 5.5 9.5 4.8z"
            fill="#34C759"
          />
        </svg>
      </div>
    </div>
  )
}

type Phase = "gallery" | "flip-in" | "detail" | "flip-out"

export function LumenApp() {
  const now = useTickingClock(1000)
  const prefersReducedMotion = useReducedMotion()
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)
  const [drawerPortalContainer, setDrawerPortalContainer] = React.useState<HTMLDivElement | null>(null)
  const heroRef = React.useRef<HTMLDivElement>(null)
  const cardRefs = React.useRef<Partial<Record<ClockCardId, HTMLElement>>>({})
  const savedScrollTop = React.useRef(0)
  const closingIdRef = React.useRef<ClockCardId | null>(null)
  const openingGalleryRectRef = React.useRef<DOMRect | null>(null)

  const [phase, setPhase] = React.useState<Phase>("gallery")
  const [selectedId, setSelectedId] = React.useState<ClockCardId | null>(null)
  /** Per-card layout + font; merged when user edits detail. Gallery + detail read same store. */
  const [cardAppearances, setCardAppearances] = React.useState<
    Partial<Record<ClockCardId, ClockCardAppearance>>
  >({})
  /** Curated default on open; updated by Layout drawer — drives detail hero, preview, and FLIP overlay. */
  const [detailLayoutMode, setDetailLayoutMode] = React.useState<ClockLayoutMode>(DEFAULT_CLOCK_LAYOUT_MODE)
  const [flipRects, setFlipRects] = React.useState<{ from: DOMRect; to: DOMRect } | null>(null)
  const [showDetailControls, setShowDetailControls] = React.useState(false)
  const [detailHeroAnimated, setDetailHeroAnimated] = React.useState(false)
  /** False during flip-in move; set true when move ends so real hero sits under overlay before it unmounts. */
  const [detailHeroShown, setDetailHeroShown] = React.useState(true)
  /** False during flip-out move; true for one frame overlap before overlay unmounts. */
  const [flipOutRevealGalleryCard, setFlipOutRevealGalleryCard] = React.useState(false)
  const flipKindRef = React.useRef<"in" | "out">("in")
  /** Gallery card rect at open (immutable snapshot for FLIP `from`). */
  const flipInFromRef = React.useRef<DOMRect | null>(null)
  const flipInToMeasuredRef = React.useRef(false)

  /** Restore gallery `scrollTop` once the list is mounted (sync + rAF for late layout). */
  const restoreGalleryScroll = React.useCallback(() => {
    const apply = () => {
      const el = scrollAreaRef.current
      if (el) el.scrollTop = savedScrollTop.current
    }
    apply()
    requestAnimationFrame(() => {
      requestAnimationFrame(apply)
    })
  }, [])

  React.useLayoutEffect(() => {
    if (phase !== "gallery" && phase !== "flip-out") return
    restoreGalleryScroll()
  }, [phase, restoreGalleryScroll])

  const registerCardRef = React.useCallback((id: ClockCardId, el: HTMLElement | null) => {
    if (el) cardRefs.current[id] = el
    else delete cardRefs.current[id]
  }, [])

  const mergeCardAppearance = React.useCallback((id: ClockCardId, patch: Partial<ClockCardAppearance>) => {
    setCardAppearances((prev) => {
      const base = resolveClockCardAppearance(prev, id)
      return { ...prev, [id]: { ...base, ...patch } }
    })
  }, [])

  const resolveAppearance = React.useCallback(
    (id: ClockCardId) => resolveClockCardAppearance(cardAppearances, id),
    [cardAppearances]
  )

  const openCard = React.useCallback(
    (id: ClockCardId) => {
      const scrollEl = scrollAreaRef.current
      if (!scrollEl) return
      const surface = cardRefs.current[id]
      if (!surface) return
      savedScrollTop.current = scrollEl.scrollTop
      openingGalleryRectRef.current = surface.getBoundingClientRect()
      setDetailLayoutMode(resolveClockCardAppearance(cardAppearances, id).layoutMode)
      if (prefersReducedMotion) {
        setSelectedId(id)
        setDetailHeroShown(true)
        setDetailHeroAnimated(true)
        setPhase("detail")
        setShowDetailControls(true)
        return
      }
      const shell = phoneShellElRef.current?.getBoundingClientRect()
      const rawFrom = surface.getBoundingClientRect()
      const from = shell
        ? intersectDomRectWithBounds(rawFrom, shell)
        : new DOMRect(rawFrom.x, rawFrom.y, rawFrom.width, rawFrom.height)
      flipInFromRef.current = from
      flipInToMeasuredRef.current = false
      setSelectedId(id)
      setDetailHeroShown(false)
      setFlipRects(null)
      flipKindRef.current = "in"
      setPhase("flip-in")
      setDetailHeroAnimated(false)
      /** Mount rows on first paint so centered hero + cluster matches measured `to` at handoff. */
      setShowDetailControls(true)
      scrollEl.style.overflow = "hidden"
    },
    [prefersReducedMotion, cardAppearances]
  )

  /** Measure real detail hero rect after layout — matches overlay `to` exactly (no estimated hero-rect math). */
  React.useLayoutEffect(() => {
    if (prefersReducedMotion) return
    if (phase !== "flip-in" || !selectedId || flipInToMeasuredRef.current) return
    const from = flipInFromRef.current
    if (!from) return

    let attempts = 0
    const apply = () => {
      if (flipInToMeasuredRef.current) return
      attempts += 1
      if (attempts > 120) return
      const hero = heroRef.current
      if (!hero) {
        requestAnimationFrame(apply)
        return
      }
      const raw = hero.getBoundingClientRect()
      if (raw.width < 2 || raw.height < 2) {
        requestAnimationFrame(apply)
        return
      }
      const shell = phoneShellElRef.current?.getBoundingClientRect()
      const to = shell
        ? intersectDomRectWithBounds(raw, shell)
        : new DOMRect(raw.x, raw.y, raw.width, raw.height)
      flipInToMeasuredRef.current = true
      setFlipRects({
        from: new DOMRect(from.x, from.y, from.width, from.height),
        to,
      })
    }
    apply()
  }, [phase, selectedId, prefersReducedMotion])

  const onFlipMoveComplete = React.useCallback(() => {
    if (flipKindRef.current === "in") {
      setDetailHeroShown(true)
      flipInFromRef.current = null
      requestAnimationFrame(() => {
        setFlipRects(null)
        setPhase("detail")
        setShowDetailControls(true)
        const scrollEl = scrollAreaRef.current
        if (scrollEl) scrollEl.style.overflow = ""

        window.setTimeout(() => setDetailHeroAnimated(true), 24)
      })
    } else {
      setFlipOutRevealGalleryCard(true)
      requestAnimationFrame(() => {
        setFlipRects(null)
        setPhase("gallery")
        setDetailHeroAnimated(false)
        closingIdRef.current = null
        setFlipOutRevealGalleryCard(false)
        const scrollEl = scrollAreaRef.current
        if (scrollEl) scrollEl.style.overflow = ""
      })
    }
  }, [])

  const handleBack = React.useCallback(() => {
    const id = selectedId
    const hero = heroRef.current
    const scrollEl = scrollAreaRef.current
    if (!id || !hero || !scrollEl) return

    if (prefersReducedMotion) {
      setSelectedId(null)
      setDetailHeroAnimated(false)
      setShowDetailControls(false)
      setPhase("gallery")
      return
    }

    const shell = phoneShellElRef.current?.getBoundingClientRect()
    const rawFrom = hero.getBoundingClientRect()
    const from = shell
      ? intersectDomRectWithBounds(rawFrom, shell)
      : new DOMRect(rawFrom.x, rawFrom.y, rawFrom.width, rawFrom.height)

    const measured = cardRefs.current[id]?.getBoundingClientRect()
    const rawTo = measured ?? openingGalleryRectRef.current
    if (!rawTo) {
      setSelectedId(null)
      setDetailHeroAnimated(false)
      setShowDetailControls(false)
      setPhase("gallery")
      return
    }
    const to = shell
      ? intersectDomRectWithBounds(rawTo, shell)
      : new DOMRect(rawTo.x, rawTo.y, rawTo.width, rawTo.height)

    closingIdRef.current = id
    flipKindRef.current = "out"
    setFlipOutRevealGalleryCard(false)
    setFlipRects({ from, to })
    setPhase("flip-out")
    setSelectedId(null)
    setDetailHeroAnimated(false)
    setShowDetailControls(false)
    scrollEl.style.overflow = "hidden"
  }, [prefersReducedMotion, selectedId])

  const showGallery = phase === "gallery" || phase === "flip-out"
  const overlayId: ClockCardId | null =
    phase === "flip-out" ? closingIdRef.current : selectedId

  const hiddenCardId: ClockCardId | null =
    phase === "flip-in"
      ? selectedId
      : phase === "flip-out" && !flipOutRevealGalleryCard
        ? closingIdRef.current
        : null

  const phoneShellElRef = React.useRef<HTMLDivElement | null>(null)
  const phoneShellRef = React.useCallback((node: HTMLDivElement | null) => {
    phoneShellElRef.current = node
    setDrawerPortalContainer(node)
  }, [])

  const flipClipRef = React.useRef<HTMLDivElement>(null)

  const [clockPreviewOpen, setClockPreviewOpen] = React.useState(false)

  return (
    <PhoneShell ref={phoneShellRef}>
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-white text-zinc-900 [color-scheme:light]">
        {!clockPreviewOpen && (
          <IosStatusBar now={now} className="pointer-events-none absolute inset-x-0 top-0 z-50" />
        )}

        <div
          ref={scrollAreaRef}
          className={cn(
            "relative min-h-0 flex-1 px-4 pb-6 [-webkit-overflow-scrolling:touch]",
            showGallery && "overflow-x-visible overflow-y-auto",
            (phase === "flip-in" || phase === "flip-out") && "overflow-y-hidden",
            (phase === "detail" || phase === "flip-in") &&
              "flex min-h-0 flex-1 flex-col overflow-hidden pt-0"
          )}
        >
          {showGallery && (
            <>
              <div className={cn("pt-16", phase === "flip-out" && "pointer-events-none")}>
                <MockupClockCards
                  now={now}
                  onCardSelect={openCard}
                  registerCardRef={registerCardRef}
                  hiddenCardId={hiddenCardId}
                  disableOpacityTransitions={phase === "flip-out"}
                  resolveCardAppearance={resolveAppearance}
                />
              </div>
            </>
          )}

          {(phase === "detail" || phase === "flip-in") && selectedId && (
            <ClockDetailView
              clockId={selectedId}
              now={now}
              heroRef={heroRef}
              onBack={handleBack}
              showControls={showDetailControls && (phase === "detail" || phase === "flip-in")}
              heroAnimated={detailHeroAnimated}
              interactionLocked={phase === "flip-in"}
              heroVisible={detailHeroShown}
              drawerContainer={drawerPortalContainer}
              onPreviewOpenChange={setClockPreviewOpen}
              layoutMode={detailLayoutMode}
              onLayoutModeChange={(mode) => {
                setDetailLayoutMode(mode)
                mergeCardAppearance(selectedId, { layoutMode: mode })
              }}
              fontColorId={resolveAppearance(selectedId).fontColorId}
              onFontColorIdChange={(fc) => mergeCardAppearance(selectedId, { fontColorId: fc })}
            />
          )}

        </div>

        <div
          ref={flipClipRef}
          className="pointer-events-none absolute inset-0 z-[200] min-h-0 overflow-hidden"
          aria-hidden
        >
          {(phase === "flip-in" || phase === "flip-out") && flipRects && overlayId && (
            <ClockFlipOverlay
              clipContainerRef={flipClipRef}
              from={flipRects.from}
              to={flipRects.to}
              moveDurationSec={phase === "flip-out" ? 0.28 : 0.3}
              onMoveComplete={onFlipMoveComplete}
            >
              <ClockCardById
                id={overlayId}
                now={now}
                animated={false}
                layoutMode={detailLayoutMode}
                fontColor={FONT_COLOR_CSS[resolveAppearance(overlayId).fontColorId]}
                className="h-full min-h-0 w-full shadow-none"
              />
            </ClockFlipOverlay>
          )}
        </div>

        {phase === "gallery" && (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-40 h-8 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.82)_28%,rgba(255,255,255,0.38)_64%,rgba(255,255,255,0)_100%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-8 bg-[linear-gradient(to_top,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.82)_28%,rgba(255,255,255,0.38)_64%,rgba(255,255,255,0)_100%)]"
            />
          </>
        )}
      </div>
    </PhoneShell>
  )
}
