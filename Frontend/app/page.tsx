import { DashboardLayout } from "@/components/ui/dashboard-layout"
import { SensorOverview } from "@/components/ui/sensor-overview"
import { RealTimeCharts } from "@/components/ui/real-time-charts"
import { AIPredictionPanel } from "@/components/ui/ai-prediction-panel"
import { RiskHeatmap } from "@/components/ui/risk-heatmap"
import { AlertsSection } from "@/components/ui/alert-section"
import { SystemHealthMonitor }  from "@/components/ui/system-health-monitor"

export default function Dashboard() {
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

        {/* Sensor Overview (full width) */}
        <SensorOverview />

        {/* Row 1: AI Prediction (left) + Alerts (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIPredictionPanel />
          <AlertsSection />
        </div>

        {/* Row 2: Real-Time Charts (full width) */}
        {/* <RealTimeCharts /> */}

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 max-h-[900px] h-[900px]">
            <SystemHealthMonitor />
          </div>

          <div className="col-span-2">
            <RiskHeatmap />
          </div>
        </div>
      </div>

    </DashboardLayout>
  )
}
