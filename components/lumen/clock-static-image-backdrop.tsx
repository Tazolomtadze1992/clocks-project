"use client"

import { cn } from "@/lib/utils"

type ClockStaticImageBackdropProps = {
  src: string
  className?: string
}

/**
 * Full-bleed static raster background for clock cards (no WebGL).
 * Parent should be `relative` with clipping; image uses cover like shader layers.
 */
export function ClockStaticImageBackdrop({ src, className }: ClockStaticImageBackdropProps) {
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      className={cn(
        "absolute inset-0 h-full w-full min-h-full min-w-full object-cover",
        className
      )}
    />
  )
}
