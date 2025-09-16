import { DashboardLayout } from "@/components/ui/dashboard-layout"
import { RealTimeCharts } from "@/components/ui/real-time-charts"

// Instead of showing all charts at once, we can reuse the configs from RealTimeCharts
// by splitting them into separate sections if needed later.

export default function RealTimeDataPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-[family-name:var(--font-space-grotesk)]">
              Real-Time Data
            </h1>
            <p className="text-muted-foreground font-[family-name:var(--font-dm-sans)]">
              Live monitoring of vibration, stress, temperature, and acoustic activity
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground font-[family-name:var(--font-dm-sans)]">
              Last Updated: {new Date().toLocaleString()}
            </p>
          </div>
        </header>

        {/* Real-Time Charts */}
        <section className="space-y-8">
          {/* Render each chart card separately */}
          <RealTimeCharts />
        </section>
      </div>
    </DashboardLayout>
  )
}
