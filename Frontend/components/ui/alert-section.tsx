"use client"

import React, { useEffect, useState } from "react"
import { AlertTriangle, Bell, Clock as ClockIcon, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ---------------- Types ----------------
type AlertType = "critical" | "high" | "medium" | "info"

type Alert = {
  id: string
  timestamp: string // ISO string
  sensorType: string
  severity: AlertType
  zone: string
  message: string
  recommendedAction: string
  acknowledged: boolean
}

type AlertsSectionProps = {
  initialData?: Alert[]
}

// ----------------- Helpers -----------------
function getSeverityColor(severity: AlertType) {
  switch (severity) {
    case "critical":
      return {
        bg: "bg-[#1E1E1E]",
        text: "text-red-700",
        badge: "destructive",
        icon: "text-red-700",
      }
    case "high":
      return {
        bg: "bg-[#1E1E1E]",
        text: "text-orange-900",
        badge: "secondary",
        icon: "text-orange-700",
      }
    case "medium":
      return {
        bg: "bg-[#1E1E1E]",
        text: "text-yellow-900",
        badge: "outline",
        icon: "text-yellow-700",
      }
    default:
      return {
        bg: "bg-gray-50 border-gray-200",
        text: "text-gray-800",
        badge: "outline",
        icon: "text-gray-600",
      }
  }
}

// ---------------- TimeAgo child component (safe) ----------------
function TimeAgo({ timestamp }: { timestamp: string }) {
  const [text, setText] = useState<string>("")

  useEffect(() => {
    function compute() {
      const date = new Date(timestamp)
      const now = new Date()
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

      if (diffInMinutes < 1) setText("Just now")
      else if (diffInMinutes < 60) setText(`${diffInMinutes}m ago`)
      else if (diffInMinutes < 1440) setText(`${Math.floor(diffInMinutes / 60)}h ago`)
      else setText(`${Math.floor(diffInMinutes / 1440)}d ago`)
    }

    compute()
    const interval = setInterval(compute, 60_000) // update every minute
    return () => clearInterval(interval)
  }, [timestamp])

  return <span>{text}</span>
}

// ---------------- Main AlertsSection ----------------
export function AlertsSection({ initialData }: AlertsSectionProps) {
  const [alerts, setAlerts] = useState<Alert[]>(initialData ?? [])
  const [isLoading, setIsLoading] = useState<boolean>(!initialData)
  const [error, setError] = useState<string | null>(null)

  // Fetch function (adjust URL to your backend)
  async function fetchAlerts() {
    try {
      const res = await fetch("http://localhost:5000/api/alerts")
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setAlerts(data)
      setError(null)
    } catch (err: any) {
      console.error("Fetch alerts error:", err)
      setError(err?.message ?? "Failed to fetch alerts")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (initialData) {
      setIsLoading(false)
      const interval = setInterval(fetchAlerts, 10_000)
      return () => clearInterval(interval)
    } else {
      fetchAlerts()
      const interval = setInterval(fetchAlerts, 10_000)
      return () => clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)))
    // TODO: POST `/api/alerts/{id}/acknowledge`
  }

  const activeAlerts = alerts.filter((a) => !a.acknowledged)
  const criticalCount = activeAlerts.filter((a) => a.severity === "critical").length
  const highCount = activeAlerts.filter((a) => a.severity === "high").length

  if (isLoading)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Alerts...</CardTitle>
        </CardHeader>
        <CardContent>Loading...</CardContent>
      </Card>
    )

  if (error)
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>{error}</CardContent>
      </Card>
    )

  return (
    <Card>
      <CardHeader className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold">Active Alerts</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {activeAlerts.length > 0 && <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
          <Badge variant="outline" className="text-xs">
            {activeAlerts.length} active
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {activeAlerts.length > 0 && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{criticalCount}</div>
              <p className="text-xs text-muted-foreground">Critical</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{highCount}</div>
              <p className="text-xs text-muted-foreground">High Priority</p>
            </div>
          </div>
        )}

        <div className="space-y-3 max-h-[500px] overflow-y-auto no-scrollbar">
          {activeAlerts.map((alert, index) => {
            const style = getSeverityColor(alert.severity)
            return (
              <div
                key={`${alert.id}-${alert.timestamp}-${index}`} // ✅ unique key fix
                className={cn(
                  "p-3 rounded-lg border transition-all duration-200",
                  alert.acknowledged ? "opacity-60 bg-muted/20 border-border" : style.bg,
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <AlertTriangle className={cn("h-4 w-4 mt-0.5 flex-shrink-0", style.icon)} />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={alert.acknowledged ? "outline" : (style.badge as any)} className="text-xs">
                          {alert.severity.toUpperCase()}
                        </Badge>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          Zone {alert.zone}
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <ClockIcon className="h-3 w-3" />
                          <TimeAgo timestamp={alert.timestamp} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            alert.acknowledged ? "text-muted-foreground" : style.text,
                          )}
                        >
                          {alert.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <strong>Action:</strong> {alert.recommendedAction}
                        </p>
                      </div>

                      {!alert.acknowledged && (
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" className="text-xs" onClick={() => acknowledgeAlert(alert.id)}>
                            Acknowledge
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {alert.acknowledged && (
                    <Badge variant="outline" className="text-xs bg-green-600 text-white">
                      Acknowledged
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {alerts.length === 0 && (
          <div className="text-center py-8">
            <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No alerts at this time</p>
          </div>
        )}

        {activeAlerts.length > 0 && (
          <div className="pt-4 border-t border-border">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                Acknowledge All
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                Export Report
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AlertsSection
