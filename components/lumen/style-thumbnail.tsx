"use client"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import type { ClockStyleId } from "@/lib/lumen/types"
import { CLOCK_STYLES } from "@/lib/lumen/clock-styles"
import { StyleBackground } from "@/components/lumen/style-background"

type StyleThumbnailProps = {
  styleId: ClockStyleId
  selected: boolean
  onSelect: (id: ClockStyleId) => void
  className?: string
}

export function StyleThumbnail({
  styleId,
  selected,
  onSelect,
  className,
}: StyleThumbnailProps) {
  const meta = CLOCK_STYLES.find((s) => s.id === styleId)

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(styleId)}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group relative flex w-[4.5rem] shrink-0 flex-col overflow-hidden rounded-2xl border text-left outline-none transition-colors",
        selected
          ? "border-white/50 ring-2 ring-cyan-400/40"
          : "border-white/10 hover:border-white/25",
        className
      )}
    >
      <div className="relative aspect-[10/14] w-full overflow-hidden">
        <StyleBackground compact variant={styleId} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
        <div className="absolute bottom-1.5 left-2 right-2">
          <p className="text-[9px] font-semibold leading-tight tracking-wide text-white/95">
            {meta?.label}
          </p>
        </div>
      </div>
    </motion.button>
  )
}
