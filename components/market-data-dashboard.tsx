"use client"

import React, { useState, useEffect } from "react"
import { useDeriv } from "@/hooks/use-deriv"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Activity, TrendingUp, DollarSign, Hash, Zap } from "lucide-react"

interface MarketData {
  symbol: string
  price: number
  lastDigit: number | null
  change: number
  timestamp: Date
}

interface MarketStats {
  totalSymbols: number
  activeMarkets: number
  averagePrice: number
  highestPrice: number
  lowestPrice: number
}

export function MarketDataDashboard() {
  const {
    connectionStatus,
    currentPrice,
    currentDigit,
    tickCount,
    symbol,
    maxTicks,
    availableSymbols,
    changeSymbol,
    changeMaxTicks,
    analysis,
  } = useDeriv()

  const [marketHistory, setMarketHistory] = useState<Map<string, MarketData>>(new Map())
  const [selectedSymbols, setSelectedSymbols] = useState<Set<string>>(new Set([symbol]))
  const [searchSymbol, setSearchSymbol] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    if (symbol && currentPrice !== null) {
      setMarketHistory((prev) => {
        const newHistory = new Map(prev)
        newHistory.set(symbol, {
          symbol,
          price: currentPrice,
          lastDigit: currentDigit,
          change: prev.has(symbol) ? currentPrice - (prev.get(symbol)?.price || 0) : 0,
          timestamp: new Date(),
        })
        return newHistory
      })
    }
  }, [symbol, currentPrice, currentDigit])

  const marketStats: MarketStats = React.useMemo(() => {
    const prices = Array.from(marketHistory.values()).map((m) => m.price)
    return {
      totalSymbols: availableSymbols.length,
      activeMarkets: marketHistory.size,
      averagePrice: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
      highestPrice: prices.length > 0 ? Math.max(...prices) : 0,
      lowestPrice: prices.length > 0 ? Math.min(...prices) : 0,
    }
  }, [marketHistory, availableSymbols])

  const filteredSymbols = availableSymbols.filter(
    (s) =>
      s.display_name.toLowerCase().includes(searchSymbol.toLowerCase()) ||
      s.symbol.toLowerCase().includes(searchSymbol.toLowerCase()),
  )

  return (
    <div className="w-full space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Connection Status */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-200">
              <Activity
                className={`h-4 w-4 ${connectionStatus === "connected" ? "text-green-400" : "text-yellow-400"}`}
              />
              Connection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <Badge
                className={
                  connectionStatus === "connected"
                    ? "bg-green-500/20 text-green-400 border-green-500/50"
                    : connectionStatus === "reconnecting"
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                      : "bg-red-500/20 text-red-400 border-red-500/50"
                }
              >
                {connectionStatus.toUpperCase()}
              </Badge>
              <p className="text-xs text-gray-400 mt-1">
                Live data {connectionStatus === "connected" ? "streaming" : "paused"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Price */}
        <Card className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-200">
              <DollarSign className="h-4 w-4 text-cyan-400" />
              Current Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-cyan-400">{currentPrice?.toFixed(4) || "---"}</p>
              <p className="text-xs text-gray-400">{symbol}</p>
            </div>
          </CardContent>
        </Card>

        {/* Last Digit */}
        <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-200">
              <Hash className="h-4 w-4 text-purple-400" />
              Last Digit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p
                className={`text-2xl font-bold ${
                  currentDigit !== null
                    ? currentDigit % 2 === 0
                      ? "text-blue-400"
                      : "text-orange-400"
                    : "text-gray-500"
                }`}
              >
                {currentDigit !== null ? currentDigit : "-"}
              </p>
              <p className="text-xs text-gray-400">
                {currentDigit !== null ? (currentDigit % 2 === 0 ? "EVEN" : "ODD") : "---"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ticks Count */}
        <Card className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-200">
              <Zap className="h-4 w-4 text-emerald-400" />
              Ticks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-emerald-400">{tickCount}</p>
              <p className="text-xs text-gray-400">Max: {maxTicks}</p>
            </div>
          </CardContent>
        </Card>

        {/* Active Markets */}
        <Card className="bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-200">
              <TrendingUp className="h-4 w-4 text-amber-400" />
              Markets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-amber-400">{marketStats.activeMarkets}</p>
              <p className="text-xs text-gray-400">Active: {marketStats.totalSymbols}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Selector & Settings */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Market Configuration</CardTitle>
          <CardDescription>Select active market and adjust analysis parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Symbol Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Search Symbols</label>
              <Input
                placeholder="Find market..."
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            {/* Active Symbol Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Active Market</label>
              <Select value={symbol} onValueChange={changeSymbol}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select market" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {filteredSymbols.slice(0, 20).map((sym) => (
                    <SelectItem key={sym.symbol} value={sym.symbol}>
                      {sym.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Max Ticks Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Max Ticks History</label>
              <Select value={maxTicks.toString()} onValueChange={(value) => changeMaxTicks(Number(value))}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {[50, 100, 200, 500, 1000].map((tick) => (
                    <SelectItem key={tick} value={tick.toString()}>
                      {tick} Ticks
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Toggle */}
          <Button
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full text-left justify-start text-sm text-gray-300 hover:text-white hover:bg-slate-700/50"
          >
            {showAdvanced ? "▼" : "▶"} Advanced Analysis Settings
          </Button>
        </CardContent>
      </Card>

      {/* Market Prices Overview */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Active Market Prices</CardTitle>
          <CardDescription>Real-time price data for all trading symbols</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {marketHistory.size > 0 ? (
              Array.from(marketHistory.values())
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .slice(0, 15)
                .map((market) => (
                  <div
                    key={market.symbol}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 border border-slate-600/50 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-100">{market.symbol}</p>
                      <p className="text-xs text-gray-400">Updated: {market.timestamp.toLocaleTimeString()}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold text-cyan-400">{market.price.toFixed(4)}</p>
                      <div className="flex items-center gap-2">
                        {market.lastDigit !== null && (
                          <>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                market.lastDigit % 2 === 0
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-orange-500/20 text-orange-400"
                              }`}
                            >
                              {market.lastDigit}
                            </span>
                            <span className="text-xs text-gray-400">{market.lastDigit % 2 === 0 ? "Even" : "Odd"}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="py-8 text-center text-gray-400">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Waiting for market data...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Panel */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Market Statistics</CardTitle>
          <CardDescription>Aggregate statistics across all observed markets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Total Markets</p>
              <p className="text-2xl font-bold text-emerald-400">{marketStats.totalSymbols}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Active Markets</p>
              <p className="text-2xl font-bold text-cyan-400">{marketStats.activeMarkets}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Highest Price</p>
              <p className="text-2xl font-bold text-amber-400">{marketStats.highestPrice.toFixed(4)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Average Price</p>
              <p className="text-2xl font-bold text-purple-400">{marketStats.averagePrice.toFixed(4)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Metrics */}
      {analysis && (
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Analysis Metrics</CardTitle>
            <CardDescription>Digit distribution and pattern analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Even Digits</p>
                <p className="text-xl font-bold text-blue-400">{analysis.evenPercentage.toFixed(1)}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Odd Digits</p>
                <p className="text-xl font-bold text-orange-400">{analysis.oddPercentage.toFixed(1)}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">High (5-9)</p>
                <p className="text-xl font-bold text-emerald-400">{analysis.highPercentage.toFixed(1)}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Low (0-4)</p>
                <p className="text-xl font-bold text-cyan-400">{analysis.lowPercentage.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
