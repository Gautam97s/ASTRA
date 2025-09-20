"use client"

import { useState, useEffect } from "react"
import { Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import { DashboardLayout } from "@/components/ui/dashboard-layout"

const cameras = [
  { id: "north", name: "North Wall Camera", status: "active", url: "http://10.144.16.65:8080/video" },
  { id: "east", name: "East Wall Camera", status: "active", url: "http://10.144.16.121:8080/video" },
  { id: "south", name: "South Wall Camera", status: "maintenance", url: "" },
  { id: "west", name: "West Wall Camera", status: "active", url: "http://192.168.1.8:8080/video" },
]

// ✅ Client-only last updated timestamp
function LastUpdated() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      )
    }
    updateTime() // set immediately
    const timer = setInterval(updateTime, 1000) // refresh every second
    return () => clearInterval(timer)
  }, [])

  return <span>Last updated: {time}</span>
}

export default function CameraDashboard() {
  const [selected, setSelected] = useState("north")

  const activeCamera = cameras.find((c) => c.id === selected)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Camera Tabs */}
        <div className="flex gap-4">
          {cameras.map((cam) => (
            <button
              key={cam.id}
              onClick={() => setSelected(cam.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border transition",
                selected === cam.id
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-gray-700 bg-gray-900 text-gray-300"
              )}
            >
              <Camera className="h-4 w-4" />
              <span>{cam.name}</span>
              <span
                className={cn(
                  "ml-2 px-2 py-0.5 text-xs rounded-full",
                  cam.status === "active" && "bg-green-600 text-white",
                  cam.status === "maintenance" && "bg-gray-500 text-white"
                )}
              >
                {cam.status}
              </span>
            </button>
          ))}
        </div>

        {/* Live Feed Panel */}
        <div className="rounded-xl border bg-gray-900 p-4">
          <h2 className="text-lg font-semibold text-white mb-4">
            Live Camera Feed - {activeCamera?.name}
          </h2>

          <div className="rounded-lg overflow-hidden border border-gray-700 bg-black h-[600px] flex items-center justify-center">
            {activeCamera?.status === "active" && activeCamera.url ? (
              <img
                src={activeCamera.url}
                className="w-full h-full object-contain" // zoomed out effect
                alt={`${activeCamera.name} feed`}
              />
            ) : (
              <p className="text-gray-400">Camera not available</p>
            )}
          </div>

          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <LastUpdated />
            <span>3 crack(s) detected</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
