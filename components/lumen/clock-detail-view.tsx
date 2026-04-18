"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { ChevronDown, ChevronLeft, Cookie, Palette } from "lucide-react"
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion"

import { ClockCardById } from "@/components/lumen/clock-card-by-id"
import { ClockFullscreenPreview } from "@/components/lumen/clock-fullscreen-preview"
import { ClockOptionDrawer } from "@/components/lumen/clock-option-drawer"
import type { ClockCardId } from "@/lib/lumen/clock-card-ids"
import {
  DEFAULT_FONT_COLOR_ID,
  FONT_COLOR_CSS,
  FONT_COLOR_IDS,
  fontColorLabel,
  type FontColorId,
} from "@/lib/lumen/font-color-options"
import { CLOCK_LAYOUT_MODES, type ClockLayoutMode } from "@/lib/lumen/clock-layout-modes"
import { cn } from "@/lib/utils"

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1]

const backEnterDurationSec = 0.18
const controlsEnterDurationSec = 0.2
const controlsEnterDelaySec = 0

/** Shared layout morph (detail card ↔ fullscreen preview); face stagger lives in clock-fullscreen-preview. */
const previewLayoutDurationSec = 0.32

/** Stable id for Framer shared layout (Jakub-style card → fullscreen). */
const PREVIEW_SURFACE_LAYOUT_ID = "lumen-preview-surface"

type ClockDetailViewProps = {
  clockId: ClockCardId
  now: Date
  heroRef: React.RefObject<HTMLDivElement | null>
  onBack: () => void
  /** Detail controls visible (can start during flip-in tail, behind overlay). */
  showControls: boolean
  /** Keep the detail shader frozen during the landing handoff, then start it after settle. */
  heroAnimated?: boolean
  /** True while the FLIP overlay is on top — no interaction until handoff finishes. */
  interactionLocked?: boolean
  /** When false, hero stays layout-measured but visually hidden (avoids duplicate card during flip-in). */
  heroVisible?: boolean
  /** Mount Vaul’s portal inside this node (e.g. phone shell) so the drawer is not full-viewport. */
  drawerContainer?: HTMLElement | null
  /** Notifies parent when lock-screen preview is open (e.g. hide mock status bar). */
  onPreviewOpenChange?: (open: boolean) => void
  /** Controlled layout selection (gallery default + FLIP overlay live in parent). */
  layoutMode: ClockLayoutMode
  onLayoutModeChange: (mode: ClockLayoutMode) => void
}

function SettingRow({
  icon,
  label,
  value,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  value: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full min-w-0 items-center justify-between gap-6 border-0 bg-transparent py-3 text-left shadow-none ring-0 outline-none"
    >
      <span className="flex min-w-0 items-center gap-2">
        <span className="flex shrink-0 items-center justify-center">{icon}</span>
        <span className="text-[14px] font-medium leading-none tracking-tight text-zinc-900">{label}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1">
        <span className="text-[14px] font-medium leading-none tracking-tight text-zinc-900">{value}</span>
        <ChevronDown className="size-[16px] text-zinc-400" strokeWidth={3} aria-hidden />
      </span>
    </button>
  )
}

export function ClockDetailView({
  clockId,
  now,
  heroRef,
  onBack,
  showControls,
  heroAnimated = true,
  interactionLocked = false,
  heroVisible = true,
  drawerContainer = null,
  onPreviewOpenChange,
  layoutMode,
  onLayoutModeChange,
}: ClockDetailViewProps) {
  const reduceMotion = useReducedMotion()
  const controlsInitial = reduceMotion ? false : { opacity: 0 }
  const controlsTransition = reduceMotion
    ? { duration: 0 }
    : { duration: controlsEnterDurationSec, delay: controlsEnterDelaySec, ease: easeOut }
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [activeDrawer, setActiveDrawer] = React.useState<null | "layout" | "font">(null)
  const [fontColorId, setFontColorId] = React.useState<FontColorId>(DEFAULT_FONT_COLOR_ID)
  const [previewOpen, setPreviewOpen] = React.useState(false)

  React.useEffect(() => {
    if (previewOpen) setActiveDrawer(null)
  }, [previewOpen])

  React.useEffect(() => {
    onPreviewOpenChange?.(previewOpen)
  }, [previewOpen, onPreviewOpenChange])

  React.useEffect(() => {
    return () => onPreviewOpenChange?.(false)
  }, [onPreviewOpenChange])

  React.useEffect(() => {
    if (!interactionLocked || !rootRef.current) return
    const root = rootRef.current
    const active = document.activeElement
    if (active && root.contains(active) && active instanceof HTMLElement) {
      active.blur()
    }
  }, [interactionLocked])

  const layoutTransition = reduceMotion
    ? { duration: 0 }
    : { type: "tween" as const, duration: previewLayoutDurationSec, ease: easeOut }

  const fullscreenOverlay = (
    <AnimatePresence initial={false} mode="popLayout">
      {previewOpen && (
        <motion.div
          key="clock-fullscreen-preview"
          layoutId={PREVIEW_SURFACE_LAYOUT_ID}
          className="absolute inset-0 z-[300] flex min-h-full min-w-full flex-col overflow-hidden bg-black"
          initial={false}
          animate={{ borderRadius: "0px" }}
          role="button"
          tabIndex={0}
          aria-label="Exit preview"
          onClick={() => setPreviewOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              setPreviewOpen(false)
            }
          }}
          transition={{ layout: layoutTransition, borderRadius: layoutTransition }}
        >
          {/*
           * Do not pass heroRef here — it must stay on the detail card wrapper only. Sharing the
           * ref with ClockFullscreenPreview caused heroRef to follow the portaled preview or go
           * null after unmount, so lumen-app handleBack's `if (!hero)` bailed and back did nothing.
           */}
          <ClockFullscreenPreview
            clockId={clockId}
            now={now}
            layoutMode={layoutMode}
            fontColor={FONT_COLOR_CSS[fontColorId]}
            animated
            className="h-full min-h-0 w-full flex-1"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <LayoutGroup id="lumen-preview">
    <div
      ref={rootRef}
      className={cn(
        "relative isolate flex min-h-0 flex-1 flex-col overflow-hidden bg-white",
        interactionLocked && "pointer-events-none select-none"
      )}
      aria-hidden={interactionLocked}
      inert={interactionLocked ? true : undefined}
    >
      {previewOpen ? null : (
        <div className="flex shrink-0 items-center pb-3 pt-16">
          <motion.button
            type="button"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: backEnterDurationSec, ease: easeOut }}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors transition-transform duration-150 hover:bg-zinc-200/90 active:scale-[0.97]"
            aria-label="Back to gallery"
            tabIndex={interactionLocked ? -1 : undefined}
            onClick={onBack}
          >
            <ChevronLeft className="size-[16px] text-zinc-500" strokeWidth={3.5} />
          </motion.button>
        </div>
      )}

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col bg-white",
          previewOpen ? "overflow-hidden" : "overflow-y-auto overflow-x-hidden overscroll-contain"
        )}
      >
        {previewOpen ? null : (
          <div className="mx-auto my-auto flex w-full min-w-0 max-w-[358px] flex-col">
            <div className="flex min-h-[220px] shrink-0 items-center justify-center pb-6 pt-2">
              <div
                className={cn("w-full max-w-[358px]", !heroVisible && "pointer-events-none opacity-0")}
                aria-hidden={!heroVisible}
              >
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  disabled={interactionLocked}
                  aria-label="Preview clock"
                  className={cn(
                    "w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-left shadow-none outline-none ring-0",
                    "rounded-[32px] transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-zinc-300/80 focus-visible:ring-offset-2 active:scale-[0.97]",
                    interactionLocked && "cursor-default"
                  )}
                >
                  <motion.div
                    layoutId={PREVIEW_SURFACE_LAYOUT_ID}
                    className="relative w-full min-h-[164px] overflow-hidden rounded-[32px] shadow-[0_12px_12px_-10px_rgba(15,23,42,0.28),0_4px_8px_-6px_rgba(15,23,42,0.16)]"
                    initial={false}
                    animate={{ borderRadius: "32px" }}
                    transition={{ layout: layoutTransition, borderRadius: layoutTransition }}
                  >
                    <ClockCardById
                      ref={heroRef}
                      id={clockId}
                      now={now}
                      className="w-full !rounded-none !shadow-none"
                      animated={heroAnimated}
                      layoutMode={layoutMode}
                      fontColor={FONT_COLOR_CSS[fontColorId]}
                    />
                  </motion.div>
                </button>
              </div>
            </div>

            {showControls && (
            <motion.div
              className="w-full bg-white pb-4 pt-1 shadow-none ring-0"
              initial={controlsInitial}
              animate={{ opacity: 1 }}
              transition={controlsTransition}
            >
              <SettingRow
                label="Layout"
                value={layoutMode}
                onClick={() => {
                  setActiveDrawer("layout")
                }}
                icon={
                  <Cookie className="size-5 text-zinc-400" strokeWidth={2.5} aria-hidden />
                }
              />
              <SettingRow
                label="Font Color"
                value={fontColorLabel(fontColorId)}
                onClick={() => {
                  setActiveDrawer("font")
                }}
                icon={
                  <Palette className="size-5 text-zinc-400" strokeWidth={2.5} aria-hidden />
                }
              />
            </motion.div>
            )}
          </div>
        )}
      </div>

      <ClockOptionDrawer
        open={!previewOpen && activeDrawer === "layout"}
        onOpenChange={(open) => {
          if (!open) setActiveDrawer((d) => (d === "layout" ? null : d))
        }}
        title="Change layout"
        options={CLOCK_LAYOUT_MODES}
        selected={layoutMode}
        onSelect={(v) => onLayoutModeChange(v as ClockLayoutMode)}
        variant="layoutCarousel"
        layoutCarouselNow={now}
        layoutCarouselClockId={clockId}
        container={drawerContainer}
      />
      <ClockOptionDrawer
        open={!previewOpen && activeDrawer === "font"}
        onOpenChange={(open) => {
          if (!open) setActiveDrawer((d) => (d === "font" ? null : d))
        }}
        title="Change font"
        options={FONT_COLOR_IDS}
        selected={fontColorId}
        onSelect={(v) => setFontColorId(v as FontColorId)}
        variant="fontSwatches"
        container={drawerContainer}
      />

      {showControls && !previewOpen && (
        <div className="relative z-10 -mt-px w-full shrink-0 bg-white pt-4 pb-[max(12px,env(safe-area-inset-bottom))] shadow-none ring-0">
          <motion.div
            initial={controlsInitial}
            animate={{ opacity: 1 }}
            transition={controlsTransition}
          >
            <button
              type="button"
              className="flex h-14 min-h-[52px] w-full items-center justify-center rounded-full border-0 bg-black px-5 text-base font-semibold text-white shadow-none ring-0 outline-none"
              onClick={() => setPreviewOpen(true)}
            >
              Preview Clock
            </button>
          </motion.div>
        </div>
      )}

      {drawerContainer ? createPortal(fullscreenOverlay, drawerContainer) : fullscreenOverlay}
    </div>
    </LayoutGroup>
  )
}
