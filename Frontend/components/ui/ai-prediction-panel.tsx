"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingDown, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type AIPredictionProps = {
  initialData?: any; // Allow initial data to be passed as a prop
};

// ... (keep getRiskLevel, getTrendIcon, getImpactColor functions here)
function getRiskLevel(probability: number) {
  if (probability >= 80)
    return { level: "Critical", color: "text-red-600", bgColor: "bg-red-100", borderColor: "border-red-200" }
  if (probability >= 60)
    return { level: "High", color: "text-orange-600", bgColor: "bg-orange-100", borderColor: "border-orange-200" }
  if (probability >= 40)
    return { level: "Medium", color: "text-yellow-600", bgColor: "bg-yellow-100", borderColor: "border-yellow-200" }
  return { level: "Low", color: "text-green-600", bgColor: "bg-green-100", borderColor: "border-green-200" }
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case "increasing":
      return <TrendingUp className="h-4 w-4 text-red-600" />
    case "decreasing":
      return <TrendingDown className="h-4 w-4 text-green-600" />
    default:
      return <CheckCircle className="h-4 w-4 text-blue-600" />
  }
}

function getImpactColor(impact: string) {
  switch (impact) {
    case "high":
      return "text-red-600"
    case "medium":
      return "text-orange-600"
    case "low":
      return "text-green-600"
    default:
      return "text-gray-600"
  }
}


export function AIPredictionPanel({ initialData }: AIPredictionProps) {
  const [data, setData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If no initial data is provided, fetch it.
    // This allows the component to be reused on its own dedicated page.
    if (!initialData) {
      const fetchData = async () => {
        setIsLoading(true)
        try {
          const response = await fetch("http://localhost:5000/api/predictions")
          if (!response.ok) throw new Error("Failed to fetch AI predictions.")
          const jsonData = await response.json()
          setData(jsonData)
          setError(null)
        } catch (err: any) {
          setError(err.message)
        } finally {
          setIsLoading(false)
        }
      }
      fetchData()
      const interval = setInterval(fetchData, 15000) // Update prediction every 15s
      return () => clearInterval(interval)
    } else {
       // If initialData is provided, we can still set up an interval to refresh it
       const interval = setInterval(async () => {
          try {
            const response = await fetch("http://localhost:5000/api/predictions");
            const newData = await response.json();
            setData(newData);
          } catch (error) {
            console.error("Failed to refresh AI prediction data:", error);
          }
       }, 15000);
       return () => clearInterval(interval);
    }
  }, [initialData])

  if (isLoading) return <Card className="h-fit"><CardHeader><CardTitle>Loading AI Assessment...</CardTitle></CardHeader></Card>
  if (error) return <Card className="h-fit"><CardHeader><CardTitle className="text-red-500">Error: {error}</CardTitle></CardHeader></Card>
  if (!data) return null;

  const riskLevel = getRiskLevel(data.riskProbability)

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold font-[family-name:var(--font-space-grotesk)]">
            AI Risk Assessment
          </CardTitle>
        </div>
        <Badge variant="outline" className="text-xs">
          Model v2.1
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Probability Gauge */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="text-4xl font-bold font-[family-name:var(--font-space-grotesk)] text-foreground">
              {data.riskProbability}%
            </div>
            <p className="text-sm text-muted-foreground font-[family-name:var(--font-dm-sans)]">
              Rockfall Risk Probability
            </p>
          </div>

          {/* Circular Progress Indicator */}
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
              <circle
                cx="60" cy="60" r="50"
                stroke={
                  data.riskProbability >= 80 ? "#dc2626" :
                  data.riskProbability >= 60 ? "#ea580c" :
                  data.riskProbability >= 40 ? "#ca8a04" : "#16a34a"
                }
                strokeWidth="8" fill="none"
                strokeDasharray={`${(data.riskProbability / 100) * 314} 314`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={cn("text-xs font-medium px-2 py-1 rounded-full", riskLevel.bgColor, riskLevel.color)}>
                {riskLevel.level}
              </div>
            </div>
          </div>

          {/* Trend Indicator */}
          <div className="flex items-center justify-center gap-2">
            {getTrendIcon(data.trend)}
            <span className="text-sm font-medium capitalize font-[family-name:var(--font-dm-sans)]">
              {data.trend} Risk
            </span>
          </div>
        </div>

        {/* Confidence Level */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-[family-name:var(--font-dm-sans)]">Model Confidence</span>
            <span className="font-medium font-[family-name:var(--font-space-grotesk)]">
              {data.confidence}%
            </span>
          </div>
          <Progress value={data.confidence} className="h-2" />
        </div>

        {/* Contributing Factors */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground font-[family-name:var(--font-space-grotesk)]">
            Contributing Factors
          </h4>
          <div className="space-y-2">
            {data.factors.map((factor: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-[family-name:var(--font-dm-sans)]">{factor.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn("text-xs", getImpactColor(factor.impact))}>
                    {factor.impact}
                  </Badge>
                  <span className={cn("font-medium", factor.value.startsWith("+") ? "text-red-600" : "text-green-600")}>
                    {factor.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground font-[family-name:var(--font-space-grotesk)]">
            AI Recommendations
          </h4>
          <div className="space-y-2">
            {data.recommendations.map((recommendation: string, index: number) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground font-[family-name:var(--font-dm-sans)]">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Model Status */}
        <div className="pt-4 border-t border-border">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Last updated: {data.lastModelRun}</span>
            <span>Next run: {data.nextPrediction}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
