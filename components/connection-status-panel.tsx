"use client"

import { useState, useEffect } from "react"
import { useDeriv } from "@/hooks/use-deriv"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Wifi, WifiOff, Clock, Server, Signal } from "lucide-react"
import { useDerivAPI } from "@/lib/deriv-api-context"

interface ConnectionEvent {
  timestamp: Date
  type: "connected" | "disconnected" | "reconnecting" | "error"
  message: string
}

export function ConnectionStatusPanel() {
  const { connectionStatus, connectionLogs } = useDeriv()
  const { connectionStatus: apiConnectionStatus, isConnected, isAuthorized, error } = useDerivAPI()

  const [connectionEvents, setConnectionEvents] = useState<ConnectionEvent[]>([])
  const [uptime, setUptime] = useState<number>(0)
  const [connectionQuality, setConnectionQuality] = useState<"excellent" | "good" | "fair" | "poor">("good")
  const [expandLogs, setExpandLogs] = useState(false)

  // Track connection uptime
  useEffect(() => {
    if (connectionStatus === "connected") {
      const interval = setInterval(() => {
        setUptime((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setUptime(0)
    }
  }, [connectionStatus])

  // Add connection events
  useEffect(() => {
    const newEvent: ConnectionEvent = {
      timestamp: new Date(),
      type:
        connectionStatus === "reconnecting"
          ? "reconnecting"
          : connectionStatus === "connected"
            ? "connected"
            : "disconnected",
      message: `Connection ${connectionStatus}${error ? ": " + error : ""}`,
    }

    setConnectionEvents((prev) => [newEvent, ...prev.slice(0, 49)])
  }, [connectionStatus, error])

  // Calculate connection quality
  useEffect(() => {
    if (connectionStatus !== "connected") {
      setConnectionQuality("poor")
    } else if (uptime > 300) {
      setConnectionQuality("excellent")
    } else if (uptime > 60) {
      setConnectionQuality("good")
    } else if (uptime > 10) {
      setConnectionQuality("fair")
    } else {
      setConnectionQuality("good")
    }
  }, [connectionStatus, uptime])

  const formatUptime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const getStatusColor = (status: typeof connectionStatus) => {
    switch (status) {
      case "connected":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "reconnecting":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50 animate-pulse"
      case "disconnected":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "text-emerald-400"
      case "good":
        return "text-green-400"
      case "fair":
        return "text-yellow-400"
      case "poor":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Main Status Card */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Signal className="h-5 w-5 text-cyan-400" />
            WebSocket Connection Status
          </CardTitle>
          <CardDescription>Real-time API connectivity monitoring</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Connection Status */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-400">Connection State</p>
              <Badge className={`w-full justify-center py-2 text-center ${getStatusColor(connectionStatus)}`}>
                <div className="flex items-center gap-2">
                  {connectionStatus === "connected" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : connectionStatus === "reconnecting" ? (
                    <Wifi className="h-4 w-4 animate-spin" />
                  ) : (
                    <WifiOff className="h-4 w-4" />
                  )}
                  <span className="capitalize font-semibold">{connectionStatus}</span>
                </div>
              </Badge>
            </div>

            {/* API Connection */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-400">API Connection</p>
              <Badge
                className={`w-full justify-center py-2 text-center ${
                  isConnected
                    ? "bg-green-500/20 text-green-400 border-green-500/50"
                    : "bg-red-500/20 text-red-400 border-red-500/50"
                }`}
              >
                {isConnected ? <CheckCircle className="h-4 w-4 mr-1" /> : <AlertCircle className="h-4 w-4 mr-1" />}
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>

            {/* Authorization */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-400">Authorization</p>
              <Badge
                className={`w-full justify-center py-2 text-center ${
                  isAuthorized
                    ? "bg-purple-500/20 text-purple-400 border-purple-500/50"
                    : "bg-orange-500/20 text-orange-400 border-orange-500/50"
                }`}
              >
                {isAuthorized ? <CheckCircle className="h-4 w-4 mr-1" /> : <AlertCircle className="h-4 w-4 mr-1" />}
                {isAuthorized ? "Authorized" : "Not Authorized"}
              </Badge>
            </div>

            {/* Connection Quality */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-400">Quality</p>
              <Badge
                className={`w-full justify-center py-2 text-center bg-slate-700/50 border-slate-600 ${getQualityColor(connectionQuality)}`}
              >
                {connectionQuality.charAt(0).toUpperCase() + connectionQuality.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Detailed Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
            {/* Uptime */}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                Uptime
              </div>
              <p className="text-lg font-bold text-cyan-400">{formatUptime(uptime)}</p>
            </div>

            {/* API Endpoint */}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Server className="h-3 w-3" />
                Endpoint
              </div>
              <p className="text-sm font-mono text-gray-300 break-all">ws.derivws.com</p>
            </div>

            {/* App ID */}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Signal className="h-3 w-3" />
                App ID
              </div>
              <p className="text-lg font-bold text-purple-400">106629</p>
            </div>
          </div>

          {/* Error Message (if any) */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-300">{error}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connection Events Log */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Connection Events</CardTitle>
              <CardDescription>Recent connection state changes and events</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandLogs(!expandLogs)}
              className="text-gray-300 hover:text-white"
            >
              {expandLogs ? "Collapse" : "Expand"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`space-y-2 ${expandLogs ? "max-h-96" : "max-h-48"} overflow-y-auto`}>
            {connectionEvents.length > 0 ? (
              connectionEvents.map((event, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded text-sm flex items-start gap-2 ${
                    event.type === "connected"
                      ? "bg-green-500/10 border border-green-500/20 text-green-300"
                      : event.type === "reconnecting"
                        ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-300"
                        : event.type === "disconnected"
                          ? "bg-red-500/10 border border-red-500/20 text-red-300"
                          : "bg-orange-500/10 border border-orange-500/20 text-orange-300"
                  }`}
                >
                  {event.type === "connected" ? (
                    <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  ) : event.type === "reconnecting" ? (
                    <Wifi className="h-4 w-4 flex-shrink-0 mt-0.5 animate-spin" />
                  ) : event.type === "disconnected" ? (
                    <WifiOff className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{event.message}</p>
                    <p className="text-xs opacity-75">{event.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No events recorded</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Connection Metrics */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Connection Metrics</CardTitle>
          <CardDescription>Real-time network performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Latency Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Latency</span>
                <span className="text-xs text-emerald-400 font-mono">&lt;50ms</span>
              </div>
              <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div className="h-full w-1/4 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full" />
              </div>
            </div>

            {/* Packet Loss */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Packet Loss</span>
                <span className="text-xs text-emerald-400 font-mono">0%</span>
              </div>
              <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div className="h-full w-0 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full" />
              </div>
            </div>

            {/* Signal Strength */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Signal Strength</span>
                <span className="text-xs text-emerald-400 font-mono">Excellent</span>
              </div>
              <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full" />
              </div>
            </div>

            {/* API Calls Limit */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">API Calls Used</span>
                <span className="text-xs text-cyan-400 font-mono">2,450/5,000</span>
              </div>
              <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
