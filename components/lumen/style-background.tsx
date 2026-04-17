import { cn } from "@/lib/utils"
import type { ClockStyleId } from "@/lib/lumen/types"

type StyleBackgroundProps = {
  variant: ClockStyleId
  /** Smaller blur radii for thumbnails */
  compact?: boolean
  className?: string
}

const blur = (compact: boolean, lg: string, sm: string) => (compact ? sm : lg)

export function StyleBackground({
  variant,
  compact = false,
  className,
}: StyleBackgroundProps) {
  const b = (lg: string, sm: string) => blur(compact, lg, sm)

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {variant === "aurora" && (
        <>
          <div className="absolute inset-0 bg-[#070b14]" />
          <div
            className={cn(
              "absolute rounded-full bg-cyan-400/35 mix-blend-screen",
              b("-left-1/4 top-[-10%] h-[85%] w-[55%] blur-[100px]", "h-[70%] w-[60%] blur-[40px]")
            )}
          />
          <div
            className={cn(
              "absolute rounded-full bg-fuchsia-500/30 mix-blend-screen",
              b("bottom-[-15%] -right-1/4 h-[75%] w-[50%] blur-[110px]", "h-[55%] w-[55%] blur-[36px]")
            )}
          />
          <div
            className={cn(
              "absolute rounded-full bg-indigo-600/25 mix-blend-overlay",
              b("left-[20%] top-[25%] h-[45%] w-[55%] blur-[90px]", "h-[40%] w-[50%] blur-[32px]")
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220]/20 via-transparent to-[#020408]/60" />
        </>
      )}

      {variant === "solar" && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                "conic-gradient(from 200deg at 50% 55%, #fff7e6 0deg, #93c5fd 85deg, #e0f2fe 200deg, #fde68a 300deg, #fff7ed 360deg)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/25 via-transparent to-sky-100/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_30%,rgba(15,23,42,0.12)_100%)]" />
        </>
      )}

      {variant === "noir" && (
        <>
          <div className="absolute inset-0 bg-[#030303]" />
          <div
            className="absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  105deg,
                  rgba(255,255,255,0.04) 0px,
                  rgba(255,255,255,0.04) 1px,
                  transparent 1px,
                  transparent 14px
                ),
                repeating-linear-gradient(
                  -15deg,
                  rgba(255,255,255,0.03) 0px,
                  rgba(255,255,255,0.03) 1px,
                  transparent 1px,
                  transparent 18px
                )
              `,
            }}
          />
          <div
            className={cn(
              "absolute left-[-20%] top-[10%] h-[120%] w-[70%] rounded-full bg-white/[0.03]",
              b("blur-[90px]", "blur-[36px]")
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />
        </>
      )}

      {variant === "plasma" && (
        <>
          <div className="absolute inset-0 bg-[#0a0512]" />
          <div
            className={cn(
              "absolute rounded-full bg-orange-500/45 mix-blend-screen",
              b("-right-[20%] top-[-10%] h-[70%] w-[65%] blur-[100px]", "h-[55%] w-[60%] blur-[34px]")
            )}
          />
          <div
            className={cn(
              "absolute rounded-full bg-fuchsia-500/40 mix-blend-screen",
              b("bottom-[-25%] left-[-15%] h-[80%] w-[55%] blur-[110px]", "h-[60%] w-[55%] blur-[36px]")
            )}
          />
          <div
            className={cn(
              "absolute rounded-full bg-cyan-400/35 mix-blend-overlay",
              b("left-[15%] top-[30%] h-[50%] w-[60%] blur-[95px]", "h-[45%] w-[55%] blur-[32px]")
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0520]/80 via-transparent to-[#020617]/90" />
        </>
      )}

      {variant === "mist" && (
        <>
          <div className="absolute inset-0 bg-[#020617]" />
          <div
            className={cn(
              "absolute inset-[-20%] rounded-full bg-sky-500/25",
              b("blur-[120px]", "blur-[48px]")
            )}
          />
          <div
            className={cn(
              "absolute inset-0 translate-x-[10%] bg-cyan-300/15",
              b("blur-[100px]", "blur-[40px]")
            )}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(56,189,248,0.25),transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-black/80" />
        </>
      )}

      {variant === "ascii" && (
        <>
          <div className="absolute inset-0 bg-black" />
          <div
            className="absolute inset-0 opacity-[0.35] mix-blend-screen"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.5) 0.6px, transparent 0.7px)`,
              backgroundSize: compact ? "5px 5px" : "6px 6px",
            }}
          />
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage: `linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.06) 45%, transparent 100%)`,
            }}
          />
          <div
            className={cn(
              "absolute left-1/4 top-1/4 h-1/2 w-1/2 rounded-full bg-white/[0.04]",
              b("blur-[80px]", "blur-[28px]")
            )}
          />
        </>
      )}
    </div>
  )
}
