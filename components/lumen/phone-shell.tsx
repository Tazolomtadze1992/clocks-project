import * as React from "react"

import { cn } from "@/lib/utils"

type PhoneShellProps = {
  children: React.ReactNode
  className?: string
}

export const PhoneShell = React.forwardRef<HTMLDivElement, PhoneShellProps>(function PhoneShell(
  { children, className },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-[390px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[2.75rem] border-6 border-zinc-950/80 bg-white text-zinc-900 shadow-[0_40px_100px_-36px_rgba(15,23,42,0.2),0_24px_56px_-28px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.04]",
        "h-[844px] max-h-[min(844px,calc(100svh-3rem))]",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[2.75rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]"
      />
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-1/2 z-50 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-zinc-950"
      />
    </div>
  )
})
