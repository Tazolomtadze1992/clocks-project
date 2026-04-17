"use client"

import * as React from "react"

function ordinalDay(d: number) {
  const j = d % 10
  const k = d % 100
  if (j === 1 && k !== 11) return "st"
  if (j === 2 && k !== 12) return "nd"
  if (j === 3 && k !== 13) return "rd"
  return "th"
}

export function useFormattedTimes(now: Date) {
  return React.useMemo(() => {
    const hours12 = now.getHours() % 12 || 12
    const minutes = now.getMinutes()
    const isPm = now.getHours() >= 12
    const hh = String(hours12).padStart(2, "0")
    const mm = String(minutes).padStart(2, "0")
    const ampm = isPm ? "PM" : "AM"
    const shortTime = `${hours12}:${mm} ${ampm}`
    const shortTimeLower = `${hours12}:${mm}${ampm.toLowerCase()}`

    const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(now)
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(now)
    const day = now.getDate()
    const monthShort = new Intl.DateTimeFormat("en-US", { month: "short" }).format(now).toUpperCase()

    const longSentence = `${weekday}, ${month} ${day}${ordinalDay(day)} at ${shortTimeLower}`
    const monthDayLong = `${month} ${day}${ordinalDay(day)}`

    return {
      hh,
      mm,
      ampm,
      shortTime,
      shortTimeDigital: `${hh}:${mm}`,
      weekday,
      weekdayUpper: weekday.toUpperCase(),
      monthDayShort: `${monthShort} ${day}`,
      monthDayLong,
      metaLine: `11°  ${monthShort} ${day}  ${weekday.toUpperCase()}`,
      longSentence,
    }
  }, [now])
}
