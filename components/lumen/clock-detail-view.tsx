"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { CaseUpper, ChevronDown, ChevronLeft, Image } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"

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
import {
  CLOCK_LAYOUT_MODES,
  DEFAULT_CLOCK_LAYOUT_MODE,
  type ClockLayoutMode,
} from "@/lib/lumen/clock-layout-modes"
import { cn } from "@/lib/utils"

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1]

const backEnterDurationSec = 0.18
const controlsEnterDurationSec = 0.2
const controlsEnterDelaySec = 0

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
      className="flex w-full min-w-0 items-center justify-between gap-6 py-3 text-left"
    >
      <span className="flex min-w-0 items-center gap-2">
        <span className="flex shrink-0 items-center justify-center">{icon}</span>
        <span className="text-[14px] font-medium leading-none tracking-tight text-zinc-900">{label}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1.5">
        <span className="text-[14px] font-medium leading-none tracking-tight text-zinc-900">{value}</span>
        <ChevronDown className="size-[18px] text-zinc-400" strokeWidth={2} aria-hidden />
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
}: ClockDetailViewProps) {
  const reduceMotion = useReducedMotion()
  const controlsInitial = reduceMotion ? false : { opacity: 0, y: 4 }
  const controlsTransition = reduceMotion
    ? { duration: 0 }
    : { duration: controlsEnterDurationSec, delay: controlsEnterDelaySec, ease: easeOut }
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [activeDrawer, setActiveDrawer] = React.useState<null | "layout" | "font">(null)
  const [layoutSelection, setLayoutSelection] = React.useState<ClockLayoutMode>(DEFAULT_CLOCK_LAYOUT_MODE)
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

  const fullscreenPreview = previewOpen ? (
    <div
      className="absolute inset-0 z-[300] overflow-hidden bg-black"
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
    >
      <ClockFullscreenPreview
        ref={heroRef}
        clockId={clockId}
        now={now}
        layoutMode={layoutSelection}
        fontColor={FONT_COLOR_CSS[fontColorId]}
        animated
        className="h-full w-full"
      />
    </div>
  ) : null

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative flex min-h-0 flex-1 flex-col",
        interactionLocked && "pointer-events-none select-none",
        previewOpen && "overflow-hidden"
      )}
      aria-hidden={interactionLocked}
      inert={interactionLocked ? true : undefined}
    >
      {previewOpen ? null : (
        <div className="flex shrink-0 items-center pb-3 pt-4">
          <motion.button
            type="button"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: backEnterDurationSec, ease: easeOut }}
            className="flex size-10 items-center justify-center rounded-full border border-zinc-200/90 bg-white shadow-sm transition hover:bg-zinc-50"
            aria-label="Back to gallery"
            tabIndex={interactionLocked ? -1 : undefined}
            onClick={onBack}
          >
            <ChevronLeft className="size-5 text-zinc-900" strokeWidth={1.65} />
          </motion.button>
        </div>
      )}

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          previewOpen ? "overflow-hidden" : "overflow-y-auto overscroll-contain"
        )}
      >
        {previewOpen ? null : (
          <div className="mx-auto my-auto flex w-full min-w-0 max-w-[358px] flex-col">
            <div className="flex min-h-[220px] shrink-0 items-center justify-center pb-6 pt-2">
              <div
                ref={heroRef}
                className={cn("w-full max-w-[358px]", !heroVisible && "pointer-events-none opacity-0")}
                aria-hidden={!heroVisible}
              >
                <ClockCardById
                  id={clockId}
                  now={now}
                  className="w-full"
                  animated={heroAnimated}
                  layoutMode={layoutSelection}
                  fontColor={FONT_COLOR_CSS[fontColorId]}
                />
              </div>
            </div>

            {showControls && (
            <motion.div
              className="w-full pb-4 pt-1"
              initial={controlsInitial}
              animate={{ opacity: 1, y: 0 }}
              transition={controlsTransition}
            >
              <SettingRow
                label="Layout"
                value={layoutSelection}
                onClick={() => {
                  setActiveDrawer("layout")
                }}
                icon={
                  <Image className="size-5 text-zinc-400" strokeWidth={1.75} aria-hidden />
                }
              />
              <SettingRow
                label="Font"
                value={fontColorLabel(fontColorId)}
                onClick={() => {
                  setActiveDrawer("font")
                }}
                icon={
                  <CaseUpper className="size-5 text-zinc-400" strokeWidth={1.75} aria-hidden />
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
        selected={layoutSelection}
        onSelect={(v) => setLayoutSelection(v as ClockLayoutMode)}
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
        <motion.div
          className="w-full shrink-0 bg-white pt-4 pb-[max(12px,env(safe-area-inset-bottom))]"
          initial={controlsInitial}
          animate={{ opacity: 1, y: 0 }}
          transition={controlsTransition}
        >
          <button
            type="button"
            className="flex h-14 min-h-[52px] w-full items-center justify-center rounded-full bg-black px-5 text-base font-semibold text-white"
            onClick={() => setPreviewOpen(true)}
          >
            Preview Clock
          </button>
        </motion.div>
      )}

      {fullscreenPreview && drawerContainer
        ? createPortal(fullscreenPreview, drawerContainer)
        : fullscreenPreview}
    </div>
  )
}
