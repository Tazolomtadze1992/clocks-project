"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Clock, Settings } from "lucide-react"

import { ClockCardById } from "@/components/lumen/clock-card-by-id"
import { ClockDetailView } from "@/components/lumen/clock-detail-view"
import { ClockFlipOverlay } from "@/components/lumen/clock-flip-overlay"
import { MockupClockCards } from "@/components/lumen/mockup-clock-cards"
import { PhoneShell } from "@/components/lumen/phone-shell"
import type { ClockCardId } from "@/lib/lumen/clock-card-ids"
import { useTickingClock } from "@/lib/lumen/use-ticking-clock"
import { cn } from "@/lib/utils"

/** Matches `clock-detail-view` back button enter (ease-out, short). */
const galleryNavEaseOut: [number, number, number, number] = [0.22, 1, 0.36, 1]
const galleryNavEnterDurationSec = 0.18

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

  const openCard = React.useCallback(
    (id: ClockCardId, el: HTMLElement) => {
      const scrollEl = scrollAreaRef.current
      if (!scrollEl) return
      savedScrollTop.current = scrollEl.scrollTop
      openingGalleryRectRef.current = el.getBoundingClientRect()
      if (prefersReducedMotion) {
        setSelectedId(id)
        setDetailHeroShown(true)
        setDetailHeroAnimated(true)
        setPhase("detail")
        setShowDetailControls(true)
        return
      }
      const from = el.getBoundingClientRect()
      flipInFromRef.current = new DOMRect(from.x, from.y, from.width, from.height)
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
    [prefersReducedMotion]
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
      flipInToMeasuredRef.current = true
      setFlipRects({
        from: new DOMRect(from.x, from.y, from.width, from.height),
        to: new DOMRect(raw.x, raw.y, raw.width, raw.height),
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

    const from = hero.getBoundingClientRect()

    const measured = cardRefs.current[id]?.getBoundingClientRect()
    const to = measured ?? openingGalleryRectRef.current
    if (!to) {
      setSelectedId(null)
      setDetailHeroAnimated(false)
      setShowDetailControls(false)
      setPhase("gallery")
      return
    }

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

  const phoneShellRef = React.useCallback((node: HTMLDivElement | null) => {
    setDrawerPortalContainer(node)
  }, [])

  const [clockPreviewOpen, setClockPreviewOpen] = React.useState(false)

  return (
    <PhoneShell ref={phoneShellRef}>
      <div className="relative flex min-h-0 flex-1 flex-col bg-white text-zinc-900 [color-scheme:light]">
        {!clockPreviewOpen && <IosStatusBar now={now} />}

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
              <motion.header
                key="gallery-nav"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: galleryNavEnterDurationSec, ease: galleryNavEaseOut }}
                className="sticky top-0 z-10 -mx-4 mb-5 flex shrink-0 items-center justify-between px-4 pb-3 pt-4"
              >
                <div className="flex h-10 items-center gap-2.5 rounded-full bg-white px-3 pr-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 drop-shadow-sm">
                    <defs>
                      <linearGradient id="lumen-clock-icon-gradient" x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#FB7185" />
                        <stop offset="0.5" stopColor="#D946EF" />
                        <stop offset="1" stopColor="#7C3AED" />
                      </linearGradient>
                    </defs>
                    <circle cx="12" cy="12" r="10" fill="url(#lumen-clock-icon-gradient)" />
                    <path
                      d="M12 7.25v5.15l3.35 2"
                      stroke="white"
                      strokeWidth="1.65"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[15px] font-medium tracking-tight text-zinc-950">Clocks</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex size-10 items-center justify-center rounded-full border border-zinc-200/90 bg-white shadow-sm transition hover:bg-zinc-50"
                    aria-label="Settings"
                  >
                    <Settings className="size-5 text-zinc-900" strokeWidth={1.65} />
                  </button>
                </div>
              </motion.header>
              <div className={cn(phase === "flip-out" && "pointer-events-none")}>
                <MockupClockCards
                  now={now}
                  onCardSelect={openCard}
                  registerCardRef={registerCardRef}
                  hiddenCardId={hiddenCardId}
                  disableOpacityTransitions={phase === "flip-out"}
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
            />
          )}

          {(phase === "flip-in" || phase === "flip-out") && flipRects && overlayId && (
            <>
              <ClockFlipOverlay
                from={flipRects.from}
                to={flipRects.to}
                moveDurationSec={phase === "flip-out" ? 0.28 : 0.3}
                onMoveComplete={onFlipMoveComplete}
              >
                <ClockCardById
                  id={overlayId}
                  now={now}
                  animated={false}
                  className="h-full min-h-0 w-full shadow-none"
                />
              </ClockFlipOverlay>
            </>
          )}
        </div>

        {phase === "gallery" && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-8 bg-[linear-gradient(to_top,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.82)_28%,rgba(255,255,255,0.38)_64%,rgba(255,255,255,0)_100%)]"
          />
        )}
      </div>
    </PhoneShell>
  )
}
