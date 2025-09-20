export function formatTime(timestamp: string) {
  if (!timestamp) return ""
  const date = new Date(timestamp)
  return date.toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "short",
  })
}
