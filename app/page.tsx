import { LumenApp } from "@/components/lumen/lumen-app"
import { ArrowUpRight } from "lucide-react"

const creditNameLinkClass =
  "group relative inline-flex items-center gap-1 text-[13px] font-semibold text-zinc-600 no-underline transition-colors duration-200 hover:text-zinc-900"

export default function Page() {
  return (
    <main className="relative flex min-h-svh items-center justify-center bg-white p-6">
      <LumenApp />

      <aside
        className="absolute bottom-6 left-6 z-10 max-w-[min(100%-3rem,28rem)] text-left leading-snug"
        aria-label="Gradient credits"
      >
        <p className="text-[11px] font-normal text-zinc-400">Gradient credits</p>
        <p className="mt-2 flex flex-col items-start gap-y-0.5">
          <a
            href="https://x.com/FonsMans"
            target="_blank"
            rel="noopener noreferrer"
            className={creditNameLinkClass}
          >
            <span className="relative inline-flex items-center gap-0.5 after:absolute after:bottom-[-1px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:ease-out group-hover:after:scale-x-100">
              <span>Fons Mans</span>
              <ArrowUpRight aria-hidden="true" className="size-3 text-zinc-600 transition-colors duration-200 group-hover:text-zinc-900" strokeWidth={3} />
            </span>
          </a>
          <a
            href="https://x.com/MaxDrekker"
            target="_blank"
            rel="noopener noreferrer"
            className={creditNameLinkClass}
          >
            <span className="relative inline-flex items-center gap-0.5 after:absolute after:bottom-[-1px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:ease-out group-hover:after:scale-x-100">
              <span>Max Drekker</span>
              <ArrowUpRight aria-hidden="true" className="size-3 text-zinc-600 transition-colors duration-200 group-hover:text-zinc-900" strokeWidth={3} />
            </span>
          </a>
          <a
            href="https://x.com/RikOostenbroek"
            target="_blank"
            rel="noopener noreferrer"
            className={creditNameLinkClass}
          >
            <span className="relative inline-flex items-center gap-0.5 after:absolute after:bottom-[-1px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:ease-out group-hover:after:scale-x-100">
              <span>Rik Oostenbroek</span>
              <ArrowUpRight aria-hidden="true" className="size-3 text-zinc-600 transition-colors duration-200 group-hover:text-zinc-900" strokeWidth={3} />
            </span>
          </a>
        </p>
      </aside>
    </main>
  )
}
