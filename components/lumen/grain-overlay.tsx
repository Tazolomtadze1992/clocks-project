import { cn } from "@/lib/utils"
import type { GrainLevel } from "@/lib/lumen/types"

const noiseSvg =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")"

type GrainOverlayProps = {
  level: GrainLevel
  className?: string
}

export function GrainOverlay({ level, className }: GrainOverlayProps) {
  if (level === "off") {
    return null
  }

  const opacity = level === "low" ? 0.045 : 0.1

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 mix-blend-overlay",
        className
      )}
      style={{
        opacity,
        backgroundImage: noiseSvg,
        backgroundSize: "220px 220px",
      }}
    />
  )
}
