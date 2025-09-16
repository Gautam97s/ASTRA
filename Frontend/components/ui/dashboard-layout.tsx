"use client"

import * as React from "react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Activity,
  BarChart3,
  Bell,
  Home,
  Map,
  Settings,
  Shield,
  Menu,
  X,
  Cpu,
} from "lucide-react"
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
  const [alertsOpen, setAlertsOpen] = useState(false)
  const pathname = usePathname()

  // Fake alerts (replace with your backend data)
  const alerts = [
    { id: 1, type: "Critical", message: "Rockfall detected near Zone A.", time: "2 mins ago" },
    { id: 2, type: "Warning", message: "High vibration levels recorded.", time: "10 mins ago" },
    { id: 3, type: "Info", message: "System maintenance scheduled at 11 PM.", time: "1 hr ago" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className={cn("fixed inset-0 z-50", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-sidebar-foreground font-[family-name:var(--font-space-grotesk)]">
                ASTRA
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="px-4 py-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-green-500 hover:text-white"
                      )}
                    >
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

      {/* Main content */}
      <div>
        {/* Top navbar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>

          {/* Navbar right */}
          <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-muted-foreground font-[family-name:var(--font-dm-sans)]">
                System Online
              </span>
            </div>
          </div>
        </div>

        {/* Alerts Popup */}
        <Dialog open={alertsOpen} onOpenChange={setAlertsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>System Alerts</DialogTitle>
              <DialogDescription>
                Real-time alerts and notifications from the mining system.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "rounded-lg border p-3 text-sm shadow-sm",
                    alert.type === "Critical" && "border-red-500 bg-red-50",
                    alert.type === "Warning" && "border-yellow-500 bg-yellow-50",
                    alert.type === "Info" && "border-blue-500 bg-blue-50"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{alert.type}</span>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                  <p className="mt-1">{alert.message}</p>
                </div>
              ))}
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
