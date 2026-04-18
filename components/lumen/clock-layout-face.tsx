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
        <p className="translate-y-2 text-right font-medium tabular-nums tracking-tight text-[22px] opacity-95">{t.shortTime}</p>
      </div>
    )
  }

  const digit = compact
    ? "text-[20px] font-black leading-none tracking-[0.02em] tabular-nums"
    : fs
      ? "font-black leading-none tracking-[0.02em] tabular-nums [font-size:clamp(5rem,18vw,7rem)]"
      : "text-[80px] font-black leading-none tracking-[0.02em] tabular-nums"
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
              "absolute flex flex-col justify-between border border-white/18 bg-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_0_12px_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.08)]",
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
                  compact ? "translate-y-0 text-[10px]" : fs ? "translate-y-5 text-[clamp(2.5rem,12vw,4rem)]" : "translate-y-3 text-[40px]"
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
              "relative shrink-0 rounded-full border-white/55 bg-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]",
              compact ? "size-12 border" : fs ? "size-[min(72vw,280px)] border-2" : "size-28 sm:size-32 border-2"
            )}
          >
            {Array.from({ length: 12 }).map((_, i) => {
              const deg = i * 30
              const rad = ((deg - 90) * Math.PI) / 180
              const radius = compact ? 36 : fs ? 44 : 38
              const x = 50 + Math.cos(rad) * radius
              const y = 50 + Math.sin(rad) * radius
              const major = i % 3 === 0
              return (
                <div
                  key={i}
                  className={cn(
                    "absolute rounded-full",
                    compact
                      ? major
                        ? "h-1.5 w-0.5"
                        : "h-1 w-px"
                      : fs
                        ? major
                          ? "h-4 w-0.5"
                          : "h-3 w-px"
                        : major
                          ? "h-3 w-0.5"
                          : "h-2.5 w-px"
                  )}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    backgroundColor: "rgba(255,255,255,0.55)",
                    transform: `translate(-50%, -50%) rotate(${deg}deg)`,
                    transformOrigin: "center center",
                  }}
                />
              )
            })}
            <div
              className={cn(
                "absolute bottom-1/2 left-1/2 h-[28%] origin-bottom rounded-full",
                compact ? "w-0.5" : "w-1"
              )}
              style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)`, backgroundColor: fontColor }}
            />
            <div
              className="absolute bottom-1/2 left-1/2 h-[44%] w-0.5 origin-bottom rounded-full"
              style={{
                transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
                backgroundColor: fontColor,
                opacity: 0.85,
              }}
            />
            <div
              className={cn(
                "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
                compact ? "size-1.5" : "size-3"
              )}
              style={{ backgroundColor: "#d1d5db" }}
            />
          </div>
        </div>
      )
    }

    case "Top Clock":
      return (
        <div
          className={cn(
            "relative flex h-full w-full flex-col",
            compact ? "justify-start pt-2" : fs ? "flex-1 justify-start pt-10" : "justify-start pt-4"
          )}
          style={fg}
        >
          <span
            className={cn(
              "absolute font-sans font-medium leading-none opacity-80",
              compact ? "bottom-1.5 left-2 text-[3px]" : fs ? "bottom-0 left-0 translate-y-4 text-[12px]" : "bottom-2.5 left-4 text-[10px]"
            )}
          >
            {t.monthDayLong}
          </span>
          <span
            className={cn(
              "absolute text-right font-sans font-medium leading-none opacity-80",
              compact ? "bottom-1.5 right-2 text-[3px]" : fs ? "bottom-0 right-0 translate-y-4 text-[12px]" : "bottom-2 right-4 text-[10px]"
            )}
          >
            11°
          </span>

          <div
            className={cn(
              "flex items-baseline justify-center font-semibold tabular-nums drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]",
              compact ? "gap-0.5 text-[10px]" : fs ? "gap-0.5" : "gap-1",
              fs ? "text-5xl sm:text-6xl" : compact ? "" : "text-2xl sm:text-3xl"
            )}
          >
            <span>{t.hh}</span>
            <span className="opacity-70">:</span>
            <span>{t.mm}</span>
            <span className={cn("font-medium leading-none opacity-80", compact ? "ml-0.5 text-[7px]" : fs ? "self-start pt-1 text-sm" : "text-sm")}>{t.ampm}</span>
          </div>
        </div>
      )

    case "Thunder":
      return (
        <div className="relative flex h-full w-full flex-1 items-center justify-center" style={fg}>
          <span
            className={cn(
              "absolute font-sans font-medium leading-none opacity-80",
              compact ? "left-2 top-1.5 text-[4px]" : fs ? "left-1 top-1 text-[12px]" : "left-3 top-3 text-[12px]"
            )}
          >
            {t.monthDayLong}
          </span>
          <span
            className={cn(
              "absolute text-right font-sans font-medium leading-none opacity-80",
              compact ? "right-2 top-1.5 text-[4px]" : fs ? "right-1 top-1 text-[12px]" : "right-3 top-3 text-[12px]"
            )}
          >
            11°
          </span>

          <div
            className={cn(
              "flex items-center justify-center",
              compact ? "mx-auto gap-0.5 px-0.5" : fs ? "w-full gap-2 px-1" : "mx-auto gap-1 px-3"
            )}
          >
            <span
              className={cn(
                compact
                  ? "inline-flex w-[28px] shrink-0 items-center justify-center rounded bg-black/30 px-0 py-0.5 font-tanker font-black tracking-[0em] tabular-nums"
                  : fs
                    ? "inline-flex min-w-0 flex-1 items-center justify-center rounded-xl bg-black/30 px-0 py-2 font-tanker font-black tracking-[0em] tabular-nums"
                    : "inline-flex w-[92px] shrink-0 items-center justify-center rounded-md bg-black/30 px-0 py-0.5 font-tanker font-black tracking-[0em] tabular-nums",
                digit
              )}
            >
              {t.hh}
            </span>
            <span className={cn("font-bold opacity-90", compact ? "text-[9px]" : fs ? "text-3xl" : "text-2xl")}> </span>
            <span
              className={cn(
                compact
                  ? "inline-flex w-[28px] shrink-0 items-center justify-center rounded bg-black/30 px-0 py-0.5 font-tanker font-black tracking-[0em] tabular-nums"
                  : fs
                    ? "inline-flex min-w-0 flex-1 items-center justify-center rounded-xl bg-black/30 px-0 py-2 font-tanker font-black tracking-[0em] tabular-nums"
                    : "inline-flex w-[92px] shrink-0 items-center justify-center rounded-md bg-black/30 px-0 py-0.5 font-tanker font-black tracking-[0em] tabular-nums",
                digit
              )}
            >
              {t.mm}
            </span>
          </div>
        </div>
      )

    default:
      return null
  }
}
