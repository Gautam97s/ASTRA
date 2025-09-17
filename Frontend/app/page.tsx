"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/ui/dashboard-layout"
import { SensorOverview } from "@/components/ui/sensor-overview"
import { RealTimeCharts } from "@/components/ui/real-time-charts"
import { AIPredictionPanel } from "@/components/ui/ai-prediction-panel"
import { RiskHeatmap } from "@/components/ui/risk-heatmap"
import { AlertsSection } from "@/components/ui/alert-section"
import { SystemHealthMonitor } from "@/components/ui/system-health-monitor"

// Define a type for the consolidated dashboard data
type DashboardData = {
  sensorOverview: any[]
  aiPrediction: any
  latestAlerts: any[]
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard")
        if (!response.ok) {
          throw new Error("Failed to connect to ASTRA backend. Is the server running?")
        }
        const jsonData = await response.json()
        setData(jsonData)
        setError(null)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData() // Fetch initial data
    const interval = setInterval(fetchData, 5000) // Refetch every 5 seconds

    return () => clearInterval(interval) // Cleanup on unmount
  }, [])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <p className="text-muted-foreground">Connecting to ASTRA Network...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex h-[80vh] items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-2">Connection Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">Please ensure the Python backend is running on http://localhost:5000.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-[family-name:var(--font-space-grotesk)]">
              Rockfall Prediction Dashboard
            </h1>
            <p className="text-muted-foreground font-[family-name:var(--font-dm-sans)]">
              Real-time monitoring and AI-powered risk assessment for open-pit mining operations
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground font-[family-name:var(--font-dm-sans)]">
              Last Updated: {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        {/* Pass fetched data down as props */}
        {data && (
          <>
            <SensorOverview initialData={data.sensorOverview} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIPredictionPanel initialData={data.aiPrediction} />
              <AlertsSection initialData={data.latestAlerts} />
            </div>
            {/* These components can be updated to fetch their own detailed data or receive it here */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-1 max-h-[900px] h-[900px]">
                <SystemHealthMonitor />
              </div>
              <div className="col-span-2">
                <RiskHeatmap />
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
