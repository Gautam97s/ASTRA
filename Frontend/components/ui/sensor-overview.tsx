"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Thermometer, Volume2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for sensors - replace with real API calls later
const sensorData = [
  {
    id: "vibration",
    name: "Vibration",
    value: 2.4,
    unit: "mm/s",
    status: "normal",
    icon: Activity,
    trend: "+0.2",
    lastUpdate: "2 min ago",
    threshold: { warning: 5.0, critical: 8.0 },
  },
  {
    id: "stress",
    name: "Wall Stress",
    value: 45.7,
    unit: "MPa",
    status: "warning",
    icon: Zap,
    trend: "+2.1",
    lastUpdate: "1 min ago",
    threshold: { warning: 40.0, critical: 60.0 },
  },
  {
    id: "temperature",
    name: "Temperature",
    value: 28.5,
    unit: "°C",
    status: "normal",
    icon: Thermometer,
    trend: "-0.5",
    lastUpdate: "3 min ago",
    threshold: { warning: 35.0, critical: 45.0 },
  },
  {
    id: "acoustic",
    name: "Acoustic Activity",
    value: 67.2,
    unit: "dB",
    status: "critical",
    icon: Volume2,
    trend: "+5.8",
    lastUpdate: "30 sec ago",
    threshold: { warning: 60.0, critical: 70.0 },
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case "normal":
      return "bg-green-500"
    case "warning":
      return "bg-yellow-500"
    case "critical":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "normal":
      return "default"
    case "warning":
      return "secondary"
    case "critical":
      return "destructive"
    default:
      return "outline"
  }
}

export function SensorOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {sensorData.map((sensor) => {
        const Icon = sensor.icon
        const isIncreasing = sensor.trend.startsWith("+")

        return (
          <Card key={sensor.id} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground font-[family-name:var(--font-dm-sans)]">
                {sensor.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full", getStatusColor(sensor.status))} />
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)]">{sensor.value}</div>
                  <p className="text-xs text-muted-foreground font-[family-name:var(--font-dm-sans)]">{sensor.unit}</p>
                </div>
                <div className="text-right">
                  <div className={cn("text-xs font-medium", isIncreasing ? "text-red-600" : "text-green-600")}>
                    {sensor.trend}
                  </div>
                  <p className="text-xs text-muted-foreground font-[family-name:var(--font-dm-sans)]">
                    {sensor.lastUpdate}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Badge variant={getStatusBadgeVariant(sensor.status)} className="text-xs">
                  {sensor.status.toUpperCase()}
                </Badge>
                <div className="text-xs text-muted-foreground font-[family-name:var(--font-dm-sans)]">
                  Warn: {sensor.threshold.warning} | Crit: {sensor.threshold.critical}
                </div>
              </div>

              {/* Progress bar showing current value relative to thresholds */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>0</span>
                  <span>{sensor.threshold.critical}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      sensor.status === "normal" && "bg-green-500",
                      sensor.status === "warning" && "bg-yellow-500",
                      sensor.status === "critical" && "bg-red-500",
                    )}
                    style={{
                      width: `${Math.min((sensor.value / sensor.threshold.critical) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
