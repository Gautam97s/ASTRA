"use client"

import { AIPredictionPanel } from "@/components/ui/ai-prediction-panel"
import { DashboardLayout } from "@/components/ui/dashboard-layout"

export default function Page() {
  return (
    <DashboardLayout>
      <main className="min-h-screen bg-background p-8">
        {/* Page Header */}
        <header className="mb-10 border-b pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground font-[family-name:var(--font-space-grotesk)]">
            Rockfall Risk Assessment
          </h1>
          <p className="text-lg text-muted-foreground font-[family-name:var(--font-dm-sans)] mt-2">
            AI-powered probability estimation and contributing factor insights
          </p>
        </header>

        {/* AI Risk Assessment Panel */}
        <section className="max-w-5xl mx-auto">
          <AIPredictionPanel />
        </section>
      </main>
    </DashboardLayout>
  )
}
