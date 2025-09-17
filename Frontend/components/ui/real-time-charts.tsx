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

type ChartData = {
  time: string;
  timestamp: number;
  value: number;
}

type RealTimeChartsProps = {
  initialData?: {
    vibration: ChartData[];
    stress: ChartData[];
    temperature: ChartData[];
    acoustic: ChartData[];
  };
};

export function RealTimeCharts({ initialData }: RealTimeChartsProps) {
  const [chartData, setChartData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)
  const [updatedTime, setUpdatedTime] = useState<string>("")

  useEffect(() => {
    // If no initial data is provided, fetch it.
    // This allows the component to be reused on its own dedicated page.
    if (!initialData) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch("http://localhost:5000/api/real-time-data")
          if (!response.ok) throw new Error("Failed to fetch real-time chart data.")
          const data = await response.json()
          setChartData(data)
          setUpdatedTime(new Date().toLocaleTimeString())
          setError(null)
        } catch (err: any) {
          setError(err.message)
        } finally {
          setIsLoading(false);
        }
      }
      fetchData()
      const interval = setInterval(fetchData, 30000) // Refresh charts every 30s
      return () => clearInterval(interval)
    } else {
        // We can assume if initialData is provided, a parent component handles updates.
        setUpdatedTime(new Date().toLocaleTimeString())
    }
  }, [initialData])

  if (isLoading) return <div className="text-muted-foreground">Loading charts...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>
  if (!chartData) return null;

  const chartConfigs = [
    { id: "vibration", title: "Vibration vs Time", data: chartData.vibration, color: "#006BFF", unit: "mm/s", icon: Activity, yAxisDomain: [0, 10] },
    { id: "stress", title: "Wall Stress vs Time", data: chartData.stress, color: "#8b5cf6", unit: "MPa", icon: Zap, yAxisDomain: [0, 80] },
    { id: "temperature", title: "Temperature vs Time", data: chartData.temperature, color: "#ec4899", unit: "°C", icon: Thermometer, yAxisDomain: [0, 50] },
    { id: "acoustic", title: "Acoustic Activity vs Time", data: chartData.acoustic, color: "#f59e0b", unit: "dB", icon: Volume2, yAxisDomain: [0, 100] },
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
                  <XAxis dataKey="time" stroke="white" tick={{ fill: "white", fontSize: 12 }} />
                  <YAxis stroke="white" domain={yAxisDomain} tick={{ fill: "white", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                    labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                    formatter={(value: any) => [`${value} ${unit}`, ""]}
                  />
                  <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
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
