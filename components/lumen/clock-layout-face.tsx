"use client"

import * as React from "react"

import type { ClockLayoutMode } from "@/lib/lumen/clock-layout-modes"
import { useFormattedTimes } from "@/lib/lumen/use-formatted-times"
import { cn } from "@/lib/utils"

type ClockLayoutFaceProps = {
  mode: ClockLayoutMode
  now: Date
  /** Hero card, drawer thumb, or full-screen lock-style preview */
  variant: "hero" | "thumb" | "fullscreen"
  /** CSS color for face text only (not glass panels / backgrounds). */
  fontColor?: string
}

export function ClockLayoutFace({
  mode,
  now,
  variant,
  fontColor = "#ffffff",
}: ClockLayoutFaceProps) {
  const t = useFormattedTimes(now)
  const compact = variant === "thumb"
  const fs = variant === "fullscreen"
  const fg: React.CSSProperties = { color: fontColor }

  if (mode === "Default") {
    if (compact) {
      return (
        <div className="flex h-full w-full flex-col justify-between p-1.5" style={fg}>
          <p className="flex flex-row items-center justify-end gap-1 text-right text-[6px] font-medium leading-tight opacity-75">
            <span>11°</span>
            <span>{t.monthDayShort}</span>
          </p>
          <p className="text-right text-[8px] font-medium tabular-nums opacity-95">{t.shortTime}</p>
        </div>
      )
    }
    if (fs) {
      return (
        <div className="flex h-full min-h-0 w-full flex-1 flex-col justify-between py-1 pr-1" style={fg}>
          <p className="flex flex-row items-center justify-end gap-6 text-right text-[12px] font-normal leading-relaxed tracking-wide opacity-80">
            <span>11°</span>
            <span>{t.monthDayShort}</span>
            <span>{t.weekdayUpper}</span>
          </p>
          <p className="translate-y-10 text-right font-medium tabular-nums tracking-tight opacity-95 [font-size:clamp(2rem,10vw,3.25rem)]">
            {t.shortTime}
          </p>
        </div>
      )
    }
    return (
      <div className="flex h-full min-h-[164px] w-full flex-col justify-between p-4" style={fg}>
        <p className="flex flex-row items-center justify-end gap-4 text-right text-[9px] font-medium leading-relaxed tracking-wide opacity-75">
          <span>11°</span>
          <span>{t.monthDayShort}</span>
          <span>{t.weekdayUpper}</span>
        </p>
        <p className="text-right font-medium tabular-nums tracking-tight text-[22px] opacity-95">{t.shortTime}</p>
      </div>
    )
  }

  const digit = compact
    ? "text-[20px] font-black leading-none tracking-[0em] tabular-nums"
    : fs
      ? "font-black leading-none tracking-[0em] tabular-nums [font-size:clamp(3rem,16vw,6.5rem)]"
      : "text-[80px] font-black leading-none tracking-[0em] tabular-nums"
  const corner = compact ? "text-[6px]" : fs ? "text-lg" : "text-[9px]"

  switch (mode) {
    case "Centered":
      return (
        <div
          className={cn(
            "flex w-full items-center justify-center",
            compact ? "h-full px-1 py-0.5" : fs ? "min-h-0 flex-1 px-6" : "min-h-[164px] px-6"
          )}
          style={fg}
        >
          <p
            className={cn(
              "max-w-[min(280px,92%)] text-center font-medium leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]",
              compact ? "line-clamp-3 text-[4px] leading-tight" : fs ? "text-lg sm:text-xl" : "text-[15px]"
            )}
          >
            {t.longSentence}
          </p>
        </div>
      )

    case "Glass Container":
      return (
        <div className={cn("relative h-full w-full", compact ? "min-h-0" : fs ? "min-h-0 flex-1" : "min-h-[164px]")}>
          <div
            className={cn(
              "absolute flex flex-col justify-between border border-white/25 bg-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-xl backdrop-saturate-150",
              compact
                ? "bottom-4 left-1/2 top-3 w-[52%] -translate-x-1/2 rounded-[8px] p-1.5"
                : fs
                  ? "bottom-0 left-1/2 h-[34%] w-[min(100%,320px)] -translate-x-1/2 translate-y-3 rounded-[32px] p-5"
                  : "bottom-4 left-1/2 top-4 w-[52%] -translate-x-1/2 rounded-[20px] p-3"
            )}
          >
            <div className="relative h-full w-full" style={fg}>
              <span
                className={cn(
                  "absolute left-0 top-0 font-medium leading-tight",
                  compact ? "text-[4px]" : fs ? "text-sm" : "text-[10px]"
                )}
              >
                11°
              </span>
              <span
                className={cn(
                  "absolute right-0 top-0 text-right font-medium leading-tight",
                  compact ? "text-[4px]" : fs ? "text-sm" : "text-[10px]"
                )}
              >
                {t.weekday}
              </span>
              <span
                className={cn(
                  "absolute bottom-0 right-0 text-right font-medium leading-tight opacity-90",
                  compact ? "text-[4px]" : fs ? "text-sm" : "text-[10px]"
                )}
              >
                {t.monthDayLong}
              </span>
              <p
                className={cn(
                  "absolute bottom-0 left-0 font-tanker font-normal leading-none tracking-tight tabular-nums",
                  compact ? "translate-y-0 text-[10px]" : fs ? "translate-y-5 text-[clamp(2.5rem,12vw,4rem)]" : "translate-y-3.5 text-[40px]"
                )}
              >
                {t.hh}:{t.mm}
              </p>
            </div>
          </div>
        </div>
      )

    case "Analog": {
      const h12 = now.getHours() % 12
      const mins = now.getMinutes()
      const hourDeg = (h12 + mins / 60) * 30
      const minuteDeg = mins * 6
      return (
        <div className="flex h-full w-full flex-1 items-center justify-center py-8">
          <div
            className={cn(
              "relative shrink-0 rounded-full border-2 border-white/55 bg-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]",
              compact ? "size-12" : fs ? "size-[min(72vw,280px)]" : "size-28 sm:size-32"
            )}
          >
            <div
              className="absolute bottom-1/2 left-1/2 h-[42%] w-0.5 origin-bottom rounded-full"
              style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)`, backgroundColor: fontColor }}
            />
            <div
              className="absolute bottom-1/2 left-1/2 h-[32%] w-px origin-bottom rounded-full"
              style={{
                transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
                backgroundColor: fontColor,
                opacity: 0.85,
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ backgroundColor: fontColor }}
            />
          </div>
        </div>
      )
    }

    case "Bottom Row":
      return (
        <div
          className={cn(
            "flex h-full w-full flex-col justify-end",
            compact ? "pb-1" : fs ? "flex-1 pb-10" : "pb-1"
          )}
          style={fg}
        >
          <div
            className={cn(
              "flex items-baseline justify-center gap-1 font-semibold tabular-nums drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]",
              compact ? "text-[10px]" : fs ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"
            )}
          >
            <span>{t.hh}</span>
            <span className="opacity-70">:</span>
            <span>{t.mm}</span>
            <span className={cn("font-medium opacity-80", compact ? "text-[7px]" : fs ? "text-lg" : "text-sm")}>{t.ampm}</span>
          </div>
        </div>
      )

    case "Small Corners":
      return (
        <div className="relative h-full w-full flex-1 font-medium drop-shadow-sm" style={fg}>
          <span className={cn("absolute", compact ? "left-1 top-1" : fs ? "left-6 top-8" : "left-4 top-4", corner)}>{t.hh}</span>
          <span className={cn("absolute", compact ? "right-1 top-1" : fs ? "right-6 top-8" : "right-4 top-4", corner)}>{t.mm}</span>
          <span className={cn("absolute", compact ? "bottom-1 left-1" : fs ? "bottom-10 left-6" : "bottom-4 left-4", corner)}>
            {t.ampm}
          </span>
          <span
            className={cn(
              "absolute max-w-[40%] truncate",
              compact ? "bottom-1 right-1" : fs ? "bottom-10 right-6" : "bottom-4 right-4",
              corner
            )}
          >
            {t.monthDayShort}
          </span>
        </div>
      )

    case "Thunder":
      return (
        <div
          className={cn(
            "flex h-full w-full flex-1 items-center justify-center",
            compact ? "gap-0.5 px-1" : fs ? "gap-2 px-2" : "gap-1 px-1"
          )}
          style={fg}
        >
          <span
            className={cn(
              compact
                ? "font-tanker rounded bg-white/20 px-2 py-0.5 font-black tracking-[0em] tabular-nums shadow-inner backdrop-blur-[2px]"
                : fs
                  ? "font-tanker rounded-xl bg-white/20 px-4 py-2 font-black tracking-[0em] tabular-nums shadow-inner backdrop-blur-[2px]"
                  : "font-tanker rounded-md bg-white/20 px-3 py-0.5 font-black tracking-[0em] tabular-nums shadow-inner backdrop-blur-[2px]",
              digit
            )}
          >
            {t.hh}
          </span>
          <span className={cn("font-bold opacity-90", compact ? "text-[9px]" : fs ? "text-3xl" : "text-2xl")}> </span>
          <span
            className={cn(
              compact
                ? "font-tanker rounded bg-white/20 px-2 py-0.5 font-black tracking-[0em] tabular-nums shadow-inner backdrop-blur-[2px]"
                : fs
                  ? "font-tanker rounded-xl bg-white/20 px-4 py-2 font-black tracking-[0em] tabular-nums shadow-inner backdrop-blur-[2px]"
                  : "font-tanker rounded-md bg-white/20 px-3 py-0.5 font-black tracking-[0em] tabular-nums shadow-inner backdrop-blur-[2px]",
              digit
            )}
          >
            {t.mm}
          </span>
        </div>
      )

    default:
      return null
  }
}
