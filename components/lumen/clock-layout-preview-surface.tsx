"use client"

import * as React from "react"

import type { ClockCardId } from "@/lib/lumen/clock-card-ids"
import { getStaticClockImageSrc } from "@/lib/lumen/clock-card-ids"
import { cn } from "@/lib/utils"

/** SVG fractal noise tile — static grain, no WebGL. */
const NOISE_DATA_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

type ClockLayoutPreviewSurfaceProps = {
  clockId: ClockCardId
  className?: string
}

/**
 * CSS-only layered backgrounds that echo each gallery card’s shader palette
 * (see `card-*-paper-*.tsx` color props). Does not mount Paper/WebGL.
 */
export function ClockLayoutPreviewSurface({ clockId, className }: ClockLayoutPreviewSurfaceProps) {
  const staticSrc = getStaticClockImageSrc(clockId)
  if (staticSrc) {
    return (
      <div className={cn("absolute inset-0 overflow-hidden rounded-[inherit]", className)} aria-hidden>
        <img
          src={staticSrc}
          alt=""
          draggable={false}
          className="absolute inset-0 size-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-14px_24px_rgba(0,0,0,0.2)]"
          aria-hidden
        />
      </div>
    )
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden rounded-[inherit]", className)} aria-hidden>
      {clockId === "1" && <SurfaceCard1 />}
      {clockId === "7" && <SurfaceCard7 />}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
        style={{ backgroundImage: NOISE_DATA_URI }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-18px_28px_rgba(0,0,0,0.22)]"
        aria-hidden
      />
    </div>
  )
}

/** Card 1 — MeshGradient palette (cyan / ink / orange / magenta / cream). */
function SurfaceCard1() {
  return (
    <>
      <div className="absolute inset-0 bg-[#030712]" />
      <div
        className="absolute -left-1/4 -top-1/3 h-[140%] w-[90%] opacity-95"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 18% 28%, rgba(46,230,255,0.42) 0%, transparent 58%), radial-gradient(ellipse 65% 55% at 78% 72%, rgba(255,45,170,0.35) 0%, transparent 55%), radial-gradient(ellipse 50% 45% at 55% 18%, rgba(255,122,0,0.28) 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          background:
            "linear-gradient(125deg, rgba(255,255,255,0.35) 0%, transparent 38%, transparent 62%, rgba(11,27,255,0.2) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(105deg, transparent, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 3px)",
        }}
      />
    </>
  )
}

/** Card 7 — MeshGradient earth + teal. */
function SurfaceCard7() {
  return (
    <>
      <div className="absolute inset-0 bg-[#2a1a20]" />
      <div
        className="absolute inset-0 opacity-95"
        style={{
          background:
            "radial-gradient(ellipse 65% 58% at 28% 38%, rgba(210,204,201,0.55) 0%, transparent 56%), radial-gradient(ellipse 55% 50% at 72% 42%, rgba(132,184,206,0.42) 0%, transparent 55%), radial-gradient(ellipse 48% 42% at 52% 78%, rgba(250,73,27,0.35) 0%, transparent 52%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-40 mix-blend-soft-light"
        style={{
          background:
            "linear-gradient(200deg, rgba(75,84,114,0.55) 0%, transparent 45%, rgba(255,198,50,0.25) 100%)",
        }}
      />
    </>
  )
}
