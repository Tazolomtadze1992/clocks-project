"use client"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import type {
  ClockLayoutId,
  ClockStyleId,
  GlassLevel,
  GrainLevel,
} from "@/lib/lumen/types"
import { GrainOverlay } from "@/components/lumen/grain-overlay"
import { StyleBackground } from "@/components/lumen/style-background"

type ClockPreviewProps = {
  now: Date
  styleId: ClockStyleId
  layout: ClockLayoutId
  grain: GrainLevel
  glass: GlassLevel
  className?: string
}

function glassClasses(glass: GlassLevel) {
  if (glass === "off") {
    return "border-transparent bg-transparent shadow-none backdrop-blur-none"
  }
  if (glass === "soft") {
    return "border border-white/15 bg-white/[0.06] shadow-[0_12px_40px_-20px_rgba(0,0,0,0.65)] backdrop-blur-md"
  }
  return "border border-white/25 bg-white/[0.12] shadow-[0_20px_60px_-24px_rgba(0,0,0,0.75)] backdrop-blur-xl"
}

export function ClockPreview({
  now,
  styleId,
  layout,
  grain,
  glass,
  className,
}: ClockPreviewProps) {
  const hours12 = now.getHours() % 12 || 12
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  const isPm = now.getHours() >= 12

  const hh = String(hours12).padStart(2, "0")
  const mm = String(minutes).padStart(2, "0")
  const ss = String(seconds).padStart(2, "0")

  const dayFmt = new Intl.DateTimeFormat("en-US", { weekday: "long" })
  const monthDay = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  })

  const glassWrap = cn(
    "relative rounded-3xl px-4 py-3 transition-[background,backdrop-filter,border-color] duration-300",
    glassClasses(glass)
  )

  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/20 shadow-inner",
        className
      )}
    >
      <StyleBackground variant={styleId} />
      <GrainOverlay level={grain} />

      <div className="relative z-10 flex flex-1 flex-col justify-between p-5">
        <div className="flex items-start justify-between text-[10px] font-medium uppercase tracking-[0.2em] text-white/55">
          <span>{dayFmt.format(now)}</span>
          <span className="tabular-nums">{monthDay.format(now)}</span>
        </div>

        <motion.div
          key={`${styleId}-${layout}`}
          className="flex flex-1 flex-col items-center justify-center gap-3"
          initial={{ opacity: 0.85, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {layout === "stack" && (
            <div className={cn(glassWrap, "px-6 py-5")}>
              <div className="relative font-[family-name:var(--font-display)] text-[3.35rem] font-semibold leading-none tracking-[-0.04em] text-white drop-shadow-[0_0_28px_rgba(255,255,255,0.12)]">
                <span className="tabular-nums">
                  {hh}:{mm}
                </span>
                <span className="ml-1 align-top text-[0.65rem] font-medium tracking-[0.15em] text-white/60">
                  {isPm ? "PM" : "AM"}
                </span>
              </div>
              <div className="mt-2 text-center text-[11px] font-medium tabular-nums tracking-wide text-white/35">
                {ss}s
              </div>
            </div>
          )}

          {layout === "split" && (
            <div className="flex items-stretch gap-2">
              <div
                className={cn(
                  glassWrap,
                  "flex min-w-[6.5rem] items-center justify-center py-6 pl-5 pr-4"
                )}
              >
                <span className="font-[family-name:var(--font-display)] text-[3rem] font-semibold tabular-nums tracking-[-0.04em] text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.1)]">
                  {hh}
                </span>
              </div>
              <div
                className={cn(
                  glassWrap,
                  "relative flex min-w-[6.5rem] items-center justify-center py-6 pl-4 pr-5"
                )}
              >
                <span className="absolute right-3 top-2 text-[9px] font-medium tracking-[0.12em] text-white/50">
                  {isPm ? "PM" : "AM"}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[3rem] font-semibold tabular-nums tracking-[-0.04em] text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.1)]">
                  {mm}
                </span>
              </div>
            </div>
          )}

          {layout === "ribbon" && (
            <div className={cn(glassWrap, "w-full max-w-[17rem] px-5 py-4")}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-[family-name:var(--font-display)] text-[2.75rem] font-semibold tabular-nums tracking-[-0.04em] text-white drop-shadow-[0_0_22px_rgba(255,255,255,0.1)]">
                  {hh}:{mm}
                </span>
                <span className="text-[10px] font-medium tracking-[0.2em] text-white/55">
                  {isPm ? "PM" : "AM"}
                </span>
              </div>
              <div className="mt-1 text-[11px] tabular-nums text-white/35">{ss}s</div>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  )
}
