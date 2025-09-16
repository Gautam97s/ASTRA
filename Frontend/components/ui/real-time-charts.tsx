"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Activity, Thermometer, Volume2, Zap } from "lucide-react"

// --- helper: generate mock time-series data ---
const generateTimeSeriesData = (baseValue: number, variance: number, points = 24) => {
  const data = []
  const now = new Date()
  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000) // past N hours
    const value = baseValue + (Math.random() - 0.5) * variance
    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: time.getTime(),
      value: Math.max(0, Number(value.toFixed(2))),
    })
  }
  return data
}

export function RealTimeCharts() {
  const [chartData, setChartData] = useState<any>(null)
  const [updatedTime, setUpdatedTime] = useState<string>("")

  // only run on client to avoid hydration mismatch
  useEffect(() => {
    setChartData({
      vibration: generateTimeSeriesData(2.4, 1.5),
      stress: generateTimeSeriesData(45.7, 8.0),
      temperature: generateTimeSeriesData(28.5, 4.0),
      acoustic: generateTimeSeriesData(67.2, 12.0),
    })
    setUpdatedTime(new Date().toLocaleTimeString())
  }, [])

  if (!chartData) {
    return <div className="text-muted-foreground">Loading charts...</div>
  }

  const chartConfigs = [
    {
      id: "vibration",
      title: "Vibration vs Time",
      data: chartData.vibration,
      color: "#006BFF",
      unit: "mm/s",
      icon: Activity,
      yAxisDomain: [0, 10],
    },
    {
      id: "stress",
      title: "Wall Stress vs Time",
      data: chartData.stress,
      color: "#8b5cf6",
      unit: "MPa",
      icon: Zap,
      yAxisDomain: [0, 80],
    },
    {
      id: "temperature",
      title: "Temperature vs Time",
      data: chartData.temperature,
      color: "#ec4899",
      unit: "°C",
      icon: Thermometer,
      yAxisDomain: [0, 50],
    },
    {
      id: "acoustic",
      title: "Acoustic Activity vs Time",
      data: chartData.acoustic,
      color: "#f59e0b",
      unit: "dB",
      icon: Volume2,
      yAxisDomain: [0, 100],
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {chartConfigs.map(({ id, title, data, color, unit, icon: Icon, yAxisDomain }) => (
        <Card key={id} className="bg-card border border-border/50 shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-foreground">
              {title}
            </CardTitle>
            <Icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="time"
                    stroke="white"
                    tick={{ fill: "white", fontSize: 12 }}
                  />
                  <YAxis
                    stroke="white"
                    domain={yAxisDomain}
                    tick={{ fill: "white", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                    labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                    formatter={(value: any) => [`${value} ${unit}`, ""]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="pt-2 text-xs text-muted-foreground text-right">
              Updated: {updatedTime}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
