"use client"

import * as React from "react"

import type { ClockCardId } from "@/lib/lumen/clock-card-ids"
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
  return (
    <div className={cn("absolute inset-0 overflow-hidden rounded-[inherit]", className)} aria-hidden>
      {clockId === "1" && <SurfaceCard1 />}
      {clockId === "2" && <SurfaceCard2 />}
      {clockId === "3" && <SurfaceCard3 />}
      {clockId === "4" && <SurfaceCard4 />}
      {clockId === "5" && <SurfaceCard5 />}
      {clockId === "6" && <SurfaceCard6 />}
      {clockId === "7" && <SurfaceCard7 />}
      {clockId === "8" && <SurfaceCard8 />}
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

/** Card 2 — Liquid metal on #AAAAAC: bright sheen, cool contour. */
function SurfaceCard2() {
  return (
    <>
      <div className="absolute inset-0 bg-[#8e8e92]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(128deg, rgba(255,255,255,0.55) 0%, rgba(180,180,186,0.15) 22%, rgba(70,70,78,0.35) 48%, rgba(240,240,242,0.35) 72%, rgba(120,120,128,0.5) 100%)",
        }}
      />
      <div
        className="absolute -left-[20%] top-0 h-full w-[70%] opacity-70"
        style={{
          background:
            "linear-gradient(100deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.08) 45%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.9) 0%, transparent 45%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.35) 0%, transparent 50%)",
        }}
      />
    </>
  )
}

/** Card 3 — SimplexNoise: orange / white / black. */
function SurfaceCard3() {
  return (
    <>
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      <div
        className="absolute -bottom-1/4 -right-1/4 h-[120%] w-[85%]"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 72% 38%, rgba(255,123,0,0.92) 0%, rgba(255,123,0,0.25) 52%, transparent 68%)",
        }}
      />
      <div
        className="absolute -left-[15%] -top-[20%] h-[90%] w-[55%] opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 40% 45%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.08) 48%, transparent 62%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(160deg, transparent 40%, rgba(0,0,0,0.85) 100%)",
        }}
      />
    </>
  )
}

/** Card 4 — Voronoi on zinc: white / lime / cyan accents. */
function SurfaceCard4() {
  return (
    <>
      <div className="absolute inset-0 bg-[#e8e8ea]" />
      <div
        className="absolute -right-[25%] -top-[30%] h-[110%] w-[70%] opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 65% 35%, rgba(187,255,0,0.45) 0%, transparent 58%)",
        }}
      />
      <div
        className="absolute -bottom-[35%] -left-[20%] h-[100%] w-[65%] opacity-75"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 35% 60%, rgba(0,255,255,0.38) 0%, transparent 58%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-zinc-300/30" />
    </>
  )
}

/** Card 5 — Voronoi warm palette. */
function SurfaceCard5() {
  return (
    <>
      <div className="absolute inset-0 bg-[#eae8e4]" />
      <div
        className="absolute -left-[30%] -top-[25%] h-[115%] w-[75%] opacity-85"
        style={{
          background:
            "radial-gradient(ellipse 58% 52% at 38% 40%, rgba(255,130,71,0.55) 0%, transparent 58%)",
        }}
      />
      <div
        className="absolute -bottom-[28%] -right-[22%] h-[105%] w-[68%] opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 58% 52% at 62% 58%, rgba(213,118,178,0.42) 0%, transparent 58%), radial-gradient(ellipse 45% 40% at 80% 30%, rgba(255,229,61,0.35) 0%, transparent 55%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tl from-[#494000]/15 via-transparent to-transparent" />
    </>
  )
}

/** Card 6 — Mesh gradient (same family as card 1), slightly different composition. */
function SurfaceCard6() {
  return (
    <>
      <div className="absolute inset-0 bg-[#060a14]" />
      <div
        className="absolute inset-0 opacity-95"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 22% 65%, rgba(11,27,255,0.45) 0%, transparent 55%), radial-gradient(ellipse 55% 48% at 75% 30%, rgba(255,242,184,0.22) 0%, transparent 52%), radial-gradient(ellipse 50% 45% at 48% 48%, rgba(255,122,0,0.3) 0%, transparent 54%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(18deg, rgba(46,230,255,0.25) 0%, transparent 35%, transparent 65%, rgba(255,45,170,0.2) 100%)",
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

/** Card 8 — Dithering: black + green front tint. */
function SurfaceCard8() {
  return (
    <>
      <div className="absolute inset-0 bg-[#030303]" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,128,0,0.2) 1px, rgba(0,128,0,0.2) 2px),
            repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,160,80,0.12) 1px, rgba(0,160,80,0.12) 2px)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(0,96,48,0.45) 0%, transparent 60%)",
        }}
      />
    </>
  )
}
