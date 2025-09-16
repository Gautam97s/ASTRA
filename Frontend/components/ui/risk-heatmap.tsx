"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock heatmap data representing different zones in the pit
const heatmapData = [
  [
    { zone: "A1", risk: "low", value: 15 },
    { zone: "A2", risk: "medium", value: 45 },
    { zone: "A3", risk: "low", value: 20 },
    { zone: "A4", risk: "low", value: 12 },
    { zone: "A5", risk: "medium", value: 38 },
  ],
  [
    { zone: "B1", risk: "medium", value: 52 },
    { zone: "B2", risk: "high", value: 78 },
    { zone: "B3", risk: "high", value: 82 },
    { zone: "B4", risk: "medium", value: 41 },
    { zone: "B5", risk: "low", value: 25 },
  ],
  [
    { zone: "C1", risk: "low", value: 18 },
    { zone: "C2", risk: "medium", value: 48 },
    { zone: "C3", risk: "high", value: 85 },
    { zone: "C4", risk: "high", value: 73 },
    { zone: "C5", risk: "medium", value: 44 },
  ],
  [
    { zone: "D1", risk: "low", value: 22 },
    { zone: "D2", risk: "low", value: 31 },
    { zone: "D3", risk: "medium", value: 56 },
    { zone: "D4", risk: "medium", value: 49 },
    { zone: "D5", risk: "low", value: 28 },
  ],
]

function getRiskColor(risk: string) {
  switch (risk) {
    case "low":
      return "bg-green-600"
    case "medium":
      return "bg-yellow-500"
    case "high":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

function getRiskIntensity(value: number) {
  if (value >= 70) return "opacity-100"
  if (value >= 50) return "opacity-100"
  if (value >= 30) return "opacity-100"
  return "opacity-100"
}

export function RiskHeatmap() {
  const totalZones = heatmapData.flat().length
  const highRiskZones = heatmapData.flat().filter((zone) => zone.risk === "high").length
  const mediumRiskZones = heatmapData.flat().filter((zone) => zone.risk === "medium").length
  const lowRiskZones = heatmapData.flat().filter((zone) => zone.risk === "low").length

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold font-[family-name:var(--font-space-grotesk)]">
            Risk Heatmap - Pit Wall Zones
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-[family-name:var(--font-dm-sans)]">
            {totalZones} zones monitored
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Zone Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 font-[family-name:var(--font-space-grotesk)]">
              {highRiskZones}
            </div>
            <p className="text-xs text-muted-foreground font-[family-name:var(--font-dm-sans)]">High Risk</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 font-[family-name:var(--font-space-grotesk)]">
              {mediumRiskZones}
            </div>
            <p className="text-xs text-muted-foreground font-[family-name:var(--font-dm-sans)]">Medium Risk</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 font-[family-name:var(--font-space-grotesk)]">
              {lowRiskZones}
            </div>
            <p className="text-xs text-muted-foreground font-[family-name:var(--font-dm-sans)]">Low Risk</p>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-foreground font-[family-name:var(--font-space-grotesk)]">
              Zone Risk Levels
            </h4>
            <div className="text-xs text-muted-foreground font-[family-name:var(--font-dm-sans)]">
              Updated: {new Date().toLocaleTimeString()}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 p-4 bg-muted/30 rounded-lg">
            {heatmapData.map((row, rowIndex) =>
              row.map((zone, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "relative aspect-square rounded-md border-2 border-white/20 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:border-white/40",
                    getRiskColor(zone.risk),
                    getRiskIntensity(zone.value),
                  )}
                  title={`Zone ${zone.zone}: ${zone.risk} risk (${zone.value}%)`}
                >
                  <div className="text-center">
                    <div className="text-xs font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                      {zone.zone}
                    </div>
                    <div className="text-xs text-white/90 font-[family-name:var(--font-dm-sans)]">{zone.value}%</div>
                  </div>
                </div>
              )),
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-xs text-muted-foreground font-[family-name:var(--font-dm-sans)]">Low (0-39%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span className="text-xs text-muted-foreground font-[family-name:var(--font-dm-sans)]">
              Medium (40-69%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span className="text-xs text-muted-foreground font-[family-name:var(--font-dm-sans)]">High (70%+)</span>
          </div>
        </div>

        {/* Critical Zones Alert */}
        {highRiskZones > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-red-800 font-[family-name:var(--font-space-grotesk)]">
                Critical Alert: {highRiskZones} high-risk zones detected
              </span>
            </div>
            <p className="text-xs text-red-700 mt-1 font-[family-name:var(--font-dm-sans)]">
              Immediate attention required for zones with elevated rockfall probability
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
