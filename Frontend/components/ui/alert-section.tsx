"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Bell, Clock, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

type Alert = {
  id: string
  timestamp: Date
  sensorType: string
  severity: "critical" | "high" | "medium"
  zone: string
  message: string
  recommendedAction: string
  acknowledged: boolean
}

function generateAlerts(): Alert[] {
  return [
    {
      id: "ALT-001",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      sensorType: "Acoustic",
      severity: "critical",
      zone: "B3",
      message: "Acoustic activity exceeds critical threshold (85.2 dB)",
      recommendedAction: "Evacuate personnel from Zone B3 immediately",
      acknowledged: false,
    },
    {
      id: "ALT-002",
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      sensorType: "Wall Stress",
      severity: "high",
      zone: "C4",
      message: "Wall stress levels approaching warning threshold (58.7 MPa)",
      recommendedAction: "Increase monitoring frequency and prepare evacuation protocols",
      acknowledged: false,
    },
    {
      id: "ALT-003",
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      sensorType: "Vibration",
      severity: "medium",
      zone: "A2",
      message: "Unusual vibration pattern detected (4.2 mm/s)",
      recommendedAction: "Deploy additional sensors for pattern analysis",
      acknowledged: true,
    },
    {
      id: "ALT-004",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      sensorType: "Temperature",
      severity: "medium",
      zone: "D3",
      message: "Temperature spike detected (42.1°C)",
      recommendedAction: "Check for equipment malfunction or environmental factors",
      acknowledged: true,
    },
    {
      id: "ALT-005",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      sensorType: "AI Model",
      severity: "high",
      zone: "B2",
      message: "AI model predicts 78% rockfall probability in next 6 hours",
      recommendedAction: "Implement enhanced monitoring and safety protocols",
      acknowledged: true,
    },
  ]
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "critical":
      return {
        bg: "bg-[#1E1E1E]",
        text: "text-red-700",
        badge: "destructive",
        icon: "text-red-700",
        shadow: "0 0 4px rgba(255,255,255,0.8)",
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

function formatTimeAgo(timestamp: Date) {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "Just now"
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

export function AlertsSection() {
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    // Load alerts only on client
    setAlerts(generateAlerts())
  }, [])

  const activeAlerts = alerts.filter((alert) => !alert.acknowledged)
  const criticalAlerts = activeAlerts.filter((alert) => alert.severity === "critical")
  const highAlerts = activeAlerts.filter((alert) => alert.severity === "high")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold font-[family-name:var(--font-space-grotesk)]">
            Active Alerts
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {activeAlerts.length > 0 && <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
          <Badge variant="outline" className="text-xs">
            {activeAlerts.length} active
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Alert Summary */}
        {activeAlerts.length > 0 && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-red-600 font-[family-name:var(--font-space-grotesk)]">
                {criticalAlerts.length}
              </div>
              <p className="text-xs text-muted-foreground font-[family-name:var(--font-dm-sans)]">Critical</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600 font-[family-name:var(--font-space-grotesk)]">
                {highAlerts.length}
              </div>
              <p className="text-xs text-muted-foreground font-[family-name:var(--font-dm-sans)]">High Priority</p>
            </div>
          </div>
        )}

        {/* Alerts List */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto no-scrollbar">
          {alerts.map((alert) => {
            const severityStyle = getSeverityColor(alert.severity)

            return (
              <div
                key={alert.id}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-200",
                  alert.acknowledged ? "opacity-60 bg-muted/20 border-border" : severityStyle.bg,
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <AlertTriangle className={cn("h-4 w-4 mt-0.5 flex-shrink-0", severityStyle.icon)} />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant={alert.acknowledged ? "outline" : (severityStyle.badge as any)}
                          className="text-xs"
                        >
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          Zone {alert.zone}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(alert.timestamp)}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p
                          className={cn(
                            "text-sm font-medium font-[family-name:var(--font-space-grotesk)]",
                            alert.acknowledged ? "text-muted-foreground" : severityStyle.text,
                          )}
                        >
                          {alert.message}
                        </p>
                        <p className="text-xs text-muted-foreground font-[family-name:var(--font-dm-sans)]">
                          <strong>Action:</strong> {alert.recommendedAction}
                        </p>
                      </div>

                      {!alert.acknowledged && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs bg-transparent">
                            Acknowledge
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs bg-transparent">
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {alert.acknowledged && (
                    <Badge variant="outline" className="text-xs bg-green-600 text-white hover:bg-green-700">
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
            <p className="text-sm text-muted-foreground font-[family-name:var(--font-dm-sans)]">
              No alerts at this time
            </p>
          </div>
        )}

        {/* Quick Actions */}
        {activeAlerts.length > 0 && (
          <div className="pt-4 border-t border-border">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                Acknowledge All
              </Button>
              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                Export Report
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
