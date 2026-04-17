"use client"

import { Bookmark, Clock3, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import type { DockTabId } from "@/lib/lumen/types"

const tabs: { id: DockTabId; label: string; icon: typeof Clock3 }[] = [
  { id: "clocks", label: "Clocks", icon: Clock3 },
  { id: "studio", label: "Studio", icon: Sparkles },
  { id: "saved", label: "Saved", icon: Bookmark },
]

type BottomDockProps = {
  active: DockTabId
  onChange?: (id: DockTabId) => void
  className?: string
}

export function BottomDock({ active, onChange, className }: BottomDockProps) {
  return (
    <nav
      className={cn(
        "flex items-center justify-between gap-1 rounded-2xl border border-white/10 bg-zinc-950/50 px-2 py-2 backdrop-blur-xl",
        className
      )}
    >
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = active === id

        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange?.(id)}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-medium transition-colors",
              isActive
                ? "bg-white/10 text-white"
                : "text-white/45 hover:bg-white/[0.06] hover:text-white/75"
            )}
          >
            <Icon className="size-4" strokeWidth={isActive ? 2.1 : 1.6} />
            <span className="tracking-wide">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
