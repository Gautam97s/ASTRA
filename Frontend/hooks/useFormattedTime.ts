"use client"

import { useEffect, useState } from "react"

export function useFormattedTime(timestamp: string) {
  const [formatted, setFormatted] = useState("")

  useEffect(() => {
    if (!timestamp) return
    const date = new Date(timestamp)
    setFormatted(
      date.toLocaleString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "short",
      })
    )
  }, [timestamp])

  return formatted
}
