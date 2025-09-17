"use client"

import { useState, useEffect } from "react" // 1. Import hooks
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Thermometer, Volume2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

// Define the type for a single sensor object
type Sensor = {
  id: string
  name: string
  value: number
  unit: string
  status: "normal" | "warning" | "critical"
  icon: React.ElementType // Store the component itself
  trend: string
  lastUpdate: string
  threshold: { warning: number; critical: number }
}

// Map icon names from backend to Lucide components
const iconMap: { [key: string]: React.ElementType } = {
  vibration: Activity,
  stress: Zap,
  temperature: Thermometer,
  acoustic: Volume2,
};


function getStatusColor(status: string) {
  switch (status) {
    case "normal": return "bg-green-500"
    case "warning": return "bg-yellow-500"
    case "critical": return "bg-red-500"
    default: return "bg-gray-500"
  }
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "normal": return "default"
    case "warning": return "secondary"
    case "critical": return "destructive"
    default: return "outline"
  }
}

export function SensorOverview() {
  // 2. Add state for sensor data, loading, and errors
  const [sensorData, setSensorData] = useState<Sensor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 3. Fetch data from the backend when the component mounts and then periodically
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard")
        if (!response.ok) {
          throw new Error("Failed to connect to the ASTRA backend.")
        }
        const data = await response.json()
        
        // Map the backend data to include the Icon component
        const formattedData = data.sensorOverview.map((sensor: any) => ({
            ...sensor,
            icon: iconMap[sensor.id] || Activity, // Use the map, default to Activity icon
        }));

        setSensorData(formattedData)
        setError(null)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData() // Fetch data immediately
    const interval = setInterval(fetchData, 5000) // Refetch every 5 seconds

    return () => clearInterval(interval) // Cleanup on unmount
  }, [])

  // 4. Handle loading and error states
  if (isLoading) {
    return <div className="text-muted-foreground">Connecting to sensor network...</div>
  }
  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  // 5. Render the live data from the state
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
          _      </Badge>
                <div className="text-xs text-muted-foreground font-[family-name:var(--font-dm-sans)]">
                  Warn: {sensor.threshold.warning} | Crit: {sensor.threshold.critical}
                </div>
              </div>
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
