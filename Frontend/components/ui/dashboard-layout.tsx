"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Activity, Bell, Home, Map, Shield, Menu, X, Cpu } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "Real-time Data", href: "/real-time-data", icon: Activity },
  { name: "Risk Assessment", href: "/risk-assessment", icon: Shield },
  { name: "Site Map", href: "/site-map", icon: Map },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [alertsOpen, setAlertsOpen] = useState(false) // You can control this via a global state or prop later
  const [alerts, setAlerts] = useState([])
  const pathname = usePathname()

  // Fetch alerts data for the popup dialog
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/alerts")
        const data = await response.json()
        setAlerts(data)
      } catch (error) {
        console.error("Failed to fetch alerts:", error)
        // Optionally set a disconnected status
      }
    }
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 10000) // Check for new alerts every 10 seconds
    return () => clearInterval(interval)
  }, [])
  
  const hasCriticalAlert = alerts.some((alert: any) => alert.type === "Critical");

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-sidebar-foreground font-[family-name:var(--font-space-grotesk)]">
                ASTRA
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="px-4 py-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <a href={item.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors", isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-green-500 hover:text-white")}>
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Static sidebar for larger screens */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
         <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar border-r border-sidebar-border px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center gap-2">
               <Cpu className="h-5 w-5 text-green-600" />
               <h2 className="text-lg font-semibold text-sidebar-foreground font-[family-name:var(--font-space-grotesk)]">
                  ASTRA
               </h2>
            </div>
            <nav className="flex flex-1 flex-col">
               <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                     <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => {
                           const isActive = pathname === item.href;
                           return (
                              <li key={item.name}>
                                 <a href={item.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors", isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-green-500 hover:text-white")}>
                                    <item.icon className="h-4 w-4" />
                                    {item.name}
                                 </a>
                              </li>
                           );
                        })}
                     </ul>
                  </li>
               </ul>
            </nav>
         </div>
      </div>


      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navbar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
               <Button variant="ghost" size="sm" onClick={() => setAlertsOpen(true)} className="relative">
                  <Bell className="h-5 w-5" />
                  {hasCriticalAlert && <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>}
               </Button>
               <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-muted-foreground font-[family-name:var(--font-dm-sans)]">System Online</span>
               </div>
            </div>
          </div>
        </div>

        {/* Alerts Popup */}
        <Dialog open={alertsOpen} onOpenChange={setAlertsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>System Alerts</DialogTitle>
              <DialogDescription>Real-time alerts and notifications from the mining system.</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {alerts.length > 0 ? alerts.map((alert: any) => (
                <div key={alert.id} className={cn("rounded-lg border p-3 text-sm shadow-sm", alert.type === "Critical" && "border-red-500 bg-red-50", alert.type === "Warning" && "border-yellow-500 bg-yellow-50", alert.type === "Info" && "border-blue-500 bg-blue-50")}>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{alert.type}</span>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                  <p className="mt-1">{alert.message}</p>
                </div>
              )) : <p className="text-muted-foreground text-sm">No new alerts.</p>}
            </div>
            <DialogFooter>
              <Button onClick={() => setAlertsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Page content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
