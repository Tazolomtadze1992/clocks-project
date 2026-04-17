"use client"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { CLOCK_STYLES } from "@/lib/lumen/clock-styles"
import type {
  ClockLayoutId,
  ClockStyleId,
  GlassLevel,
  GrainLevel,
} from "@/lib/lumen/types"

const layouts: { id: ClockLayoutId; label: string }[] = [
  { id: "stack", label: "Stack" },
  { id: "split", label: "Split" },
  { id: "ribbon", label: "Ribbon" },
]

const grains: { id: GrainLevel; label: string }[] = [
  { id: "off", label: "Off" },
  { id: "low", label: "Low" },
  { id: "high", label: "High" },
]

const glasses: { id: GlassLevel; label: string }[] = [
  { id: "off", label: "Off" },
  { id: "soft", label: "Soft" },
  { id: "heavy", label: "Heavy" },
]

type CustomizationPanelProps = {
  styleId: ClockStyleId
  layout: ClockLayoutId
  grain: GrainLevel
  glass: GlassLevel
  onStyleChange: (value: ClockStyleId) => void
  onLayoutChange: (value: ClockLayoutId) => void
  onGrainChange: (value: GrainLevel) => void
  onGlassChange: (value: GlassLevel) => void
  className?: string
}

function SelectRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
        {label}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

const selectClassName = cn(
  "w-full max-w-[11.5rem] rounded-xl border border-white/12 bg-zinc-950/80 px-2.5 py-1.5 text-right text-[12px] font-medium text-white outline-none",
  "focus-visible:ring-2 focus-visible:ring-cyan-400/40"
)

export function CustomizationPanel({
  styleId,
  layout,
  grain,
  glass,
  onStyleChange,
  onLayoutChange,
  onGrainChange,
  onGlassChange,
  className,
}: CustomizationPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-zinc-950/55 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl",
        className
      )}
    >
      <div className="flex flex-col gap-2.5">
        <SelectRow label="Style">
          <select
            aria-label="Clock style"
            className={selectClassName}
            value={styleId}
            onChange={(e) => onStyleChange(e.target.value as ClockStyleId)}
          >
            {CLOCK_STYLES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </SelectRow>
        <SelectRow label="Layout">
          <select
            aria-label="Clock layout"
            className={selectClassName}
            value={layout}
            onChange={(e) => onLayoutChange(e.target.value as ClockLayoutId)}
          >
            {layouts.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </SelectRow>
        <SelectRow label="Grain">
          <select
            aria-label="Film grain"
            className={selectClassName}
            value={grain}
            onChange={(e) => onGrainChange(e.target.value as GrainLevel)}
          >
            {grains.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </SelectRow>
        <SelectRow label="Glass">
          <select
            aria-label="Glass strength"
            className={selectClassName}
            value={glass}
            onChange={(e) => onGlassChange(e.target.value as GlassLevel)}
          >
            {glasses.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </SelectRow>
      </div>
    </div>
  )
}
