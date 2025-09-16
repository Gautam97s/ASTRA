"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock system health data - replace with real system monitoring API calls later
const systemHealthData = {
  sensors: [
    { id: "VIB-001", name: "Vibration Sensor A1", status: "online", lastPing: "2s ago", battery: 87 },
    { id: "VIB-002", name: "Vibration Sensor B2", status: "online", lastPing: "1s ago", battery: 92 },
    { id: "STR-001", name: "Stress Sensor C3", status: "warning", lastPing: "45s ago", battery: 23 },
    { id: "STR-002", name: "Stress Sensor D1", status: "online", lastPing: "3s ago", battery: 78 },
    { id: "TMP-001", name: "Temperature Sensor A4", status: "online", lastPing: "1s ago", battery: 95 },
    { id: "TMP-002", name: "Temperature Sensor B5", status: "offline", lastPing: "5m ago", battery: 0 },
    { id: "ACS-001", name: "Acoustic Sensor C2", status: "online", lastPing: "2s ago", battery: 68 },
    { id: "ACS-002", name: "Acoustic Sensor D4", status: "online", lastPing: "1s ago", battery: 84 },
  ],
  systemComponents: [
    { name: "Data Processing Server", status: "online", uptime: "99.8%", load: 45 },
    { name: "AI Model Server", status: "online", uptime: "99.9%", load: 72 },
    { name: "Database Cluster", status: "online", uptime: "100%", load: 28 },
    { name: "Network Gateway", status: "warning", uptime: "98.2%", load: 89 },
    { name: "Backup Systems", status: "online", uptime: "100%", load: 12 },
  ],
  networkStatus: {
    connectivity: "stable",
    bandwidth: 85,
    latency: 12,
    packetsLost: 0.02,
  },
}

function getStatusBadge(status: string) {
  switch (status) {
    case "online":
      return "default"
    case "warning":
      return "secondary"
    case "offline":
      return "destructive"
    default:
      return "outline"
  }
}

function getStatusDot(status: string) {
  switch (status) {
    case "online":
      return "bg-green-500"
    case "warning":
      return "bg-yellow-500"
    case "offline":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

function getBatteryColor(battery: number) {
  if (battery > 50) return "text-green-600"
  if (battery > 20) return "text-yellow-600"
  return "text-red-600"
}

export function SystemHealthMonitor() {
  const [lastCheck, setLastCheck] = useState("")

  useEffect(() => {
    const updateTime = () => {
      setLastCheck(new Date().toLocaleTimeString())
    }

    updateTime() // set immediately on mount
    const interval = setInterval(updateTime, 1000) // update every second

    return () => clearInterval(interval)
  }, [])

  const onlineSensors = systemHealthData.sensors.filter((sensor) => sensor.status === "online").length
  const warningSensors = systemHealthData.sensors.filter((sensor) => sensor.status === "warning").length
  const offlineSensors = systemHealthData.sensors.filter((sensor) => sensor.status === "offline").length

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold font-[family-name:var(--font-space-grotesk)]">
            System Health
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm text-muted-foreground font-[family-name:var(--font-dm-sans)]">All Systems</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Overview */}
        <div className="grid grid-cols-3 gap-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600 font-[family-name:var(--font-space-grotesk)]">
              {onlineSensors}
            </div>
            <p className="text-xs text-muted-foreground font-[family-name:var(--font-dm-sans)]">Online</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600 font-[family-name:var(--font-space-grotesk)]">
              {warningSensors}
            </div>
            <p className="text-xs text-muted-foreground font-[family-name:var(--font-dm-sans)]">Warning</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600 font-[family-name:var(--font-space-grotesk)]">
              {offlineSensors}
            </div>
            <p className="text-xs text-muted-foreground font-[family-name:var(--font-dm-sans)]">Offline</p>
          </div>
        </div>

        {/* Sensor Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground font-[family-name:var(--font-space-grotesk)]">
            Sensor Network ({systemHealthData.sensors.length} devices)
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
            {systemHealthData.sensors.map((sensor) => (
              <div key={sensor.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className={cn("h-2 w-2 rounded-full", getStatusDot(sensor.status))} />
                  <div>
                    <p className="text-sm font-medium font-[family-name:var(--font-space-grotesk)]">{sensor.name}</p>
                    <p className="text-xs text-muted-foreground font-[family-name:var(--font-dm-sans)]">
                      {sensor.id} • {sensor.lastPing}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {sensor.status !== "offline" && (
                    <div className="text-right">
                      <p className={cn("text-xs font-medium", getBatteryColor(sensor.battery))}>{sensor.battery}%</p>
                      <p className="text-xs text-muted-foreground">Battery</p>
                    </div>
                  )}
                  <Badge variant={getStatusBadge(sensor.status) as any} className="text-xs">
                    {sensor.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Components */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground font-[family-name:var(--font-space-grotesk)]">
            System Components
          </h4>
          <div className="space-y-2">
            {systemHealthData.systemComponents.map((component, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className={cn("h-2 w-2 rounded-full", getStatusDot(component.status))} />
                  <div>
                    <p className="text-sm font-medium font-[family-name:var(--font-space-grotesk)]">{component.name}</p>
                    <p className="text-xs text-muted-foreground font-[family-name:var(--font-dm-sans)]">
                      Uptime: {component.uptime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs font-medium">{component.load}%</p>
                    <p className="text-xs text-muted-foreground">Load</p>
                  </div>
                  <Badge variant={getStatusBadge(component.status) as any} className="text-xs">
                    {component.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground font-[family-name:var(--font-space-grotesk)]">
            Network Status
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-[family-name:var(--font-dm-sans)]">Bandwidth</span>
                <span className="font-medium font-[family-name:var(--font-space-grotesk)]">
                  {systemHealthData.networkStatus.bandwidth}%
                </span>
              </div>
              <Progress value={systemHealthData.networkStatus.bandwidth} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-[family-name:var(--font-dm-sans)]">Latency</span>
                <span className="font-medium font-[family-name:var(--font-space-grotesk)]">
                  {systemHealthData.networkStatus.latency}ms
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Packet Loss: {systemHealthData.networkStatus.packetsLost}%
              </div>
            </div>
          </div>
        </div>

        {/* System Actions */}
        <div className="pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center font-[family-name:var(--font-dm-sans)]">
            Last system check: {lastCheck || "—"} • Next check in 30s
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
