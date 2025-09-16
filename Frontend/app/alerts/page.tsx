import { DashboardLayout } from "@/components/ui/dashboard-layout"
import { AlertsSection } from "@/components/ui/alert-section"

export default function AlertsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-[family-name:var(--font-space-grotesk)]">
              Alerts & Notifications
            </h1>
            <p className="text-muted-foreground font-[family-name:var(--font-dm-sans)]">
              Review and acknowledge real-time system alerts for proactive safety management
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground font-[family-name:var(--font-dm-sans)]">
              Last Updated: {new Date().toLocaleString()}
            </p>
          </div>
        </header>

        {/* Alerts Section */}
        <section>
          <AlertsSection />
        </section>
      </div>
    </DashboardLayout>
  )
}
