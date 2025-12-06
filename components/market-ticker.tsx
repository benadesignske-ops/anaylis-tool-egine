"use client"

import { useState, useEffect } from "react"
import { useDeriv } from "@/hooks/use-deriv"
import { Card } from "@/components/ui/card"
import { Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TickerSymbol {
  symbol: string
  displayName: string
  price: number
  previousPrice: number
  change: number
  changePercent: number
  lastDigit: number | null
  updateTime: Date
}

export function MarketTicker() {
  const { connectionStatus, currentPrice, currentDigit, symbol, availableSymbols, changeSymbol, tickCount } = useDeriv()

  const [tickerSymbols, setTickerSymbols] = useState<Map<string, TickerSymbol>>(new Map())
  const [isPaused, setIsPaused] = useState(false)
  const [displaySymbols, setDisplaySymbols] = useState<string[]>([])

  // Initialize ticker with popular symbols
  useEffect(() => {
    if (availableSymbols.length > 0) {
      const popularSymbols = ["R_100", "R_50", "EURUSD", "GBPUSD", "AUDUSD", "1HZ100V", "1HZ50V", "1HZ10V"]

      const toDisplay = popularSymbols.filter((sym) => availableSymbols.some((s) => s.symbol === sym))

      setDisplaySymbols(toDisplay.slice(0, 8))

      toDisplay.forEach((sym) => {
        if (!tickerSymbols.has(sym)) {
          setTickerSymbols((prev) => {
            const newMap = new Map(prev)
            newMap.set(sym, {
              symbol: sym,
              displayName: availableSymbols.find((s) => s.symbol === sym)?.display_name || sym,
              price: 0,
              previousPrice: 0,
              change: 0,
              changePercent: 0,
              lastDigit: null,
              updateTime: new Date(),
            })
            return newMap
          })
        }
      })
    }
  }, [availableSymbols])

  // Update ticker with current price when symbol changes
  useEffect(() => {
    if (currentPrice !== null && !isPaused) {
      setTickerSymbols((prev) => {
        const newMap = new Map(prev)
        const existing = newMap.get(symbol)
        const previousPrice = existing?.price || currentPrice
        const change = currentPrice - previousPrice
        const changePercent = previousPrice !== 0 ? (change / previousPrice) * 100 : 0

        newMap.set(symbol, {
          symbol,
          displayName: availableSymbols.find((s) => s.symbol === symbol)?.display_name || symbol,
          price: currentPrice,
          previousPrice,
          change,
          changePercent,
          lastDigit: currentDigit,
          updateTime: new Date(),
        })

        return newMap
      })
    }
  }, [symbol, currentPrice, currentDigit, availableSymbols, isPaused])

  const getChangeColor = (changePercent: number) => {
    if (changePercent > 0) return "text-green-400"
    if (changePercent < 0) return "text-red-400"
    return "text-gray-400"
  }

  const getDigitColor = (digit: number | null) => {
    if (digit === null) return "bg-gray-500/20 text-gray-400"
    return digit % 2 === 0 ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
  }

  return (
    <div className="w-full space-y-4">
      {/* Ticker Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${connectionStatus === "connected" ? "bg-green-400 animate-pulse" : "bg-gray-500"}`}
          />
          <span className="text-sm font-medium text-gray-300">
            {connectionStatus === "connected" ? "Live Ticker - " + tickCount + " ticks" : "Ticker Paused"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPaused(!isPaused)}
          className="text-gray-300 hover:text-white hover:bg-slate-700/50"
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </Button>
      </div>

      {/* Horizontal Scrolling Ticker */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          {displaySymbols.map((sym) => {
            const tickerData = tickerSymbols.get(sym)
            if (!tickerData) return null

            return (
              <Card
                key={sym}
                className={`flex-shrink-0 w-48 bg-gradient-to-br border cursor-pointer transition-all hover:shadow-lg ${
                  symbol === sym
                    ? "from-cyan-900/50 to-blue-900/50 border-cyan-500/50 shadow-lg"
                    : "from-slate-800/50 to-slate-900/50 border-slate-600/50 hover:border-cyan-500/30"
                }`}
                onClick={() => changeSymbol(sym)}
              >
                <div className="p-3 space-y-2">
                  {/* Symbol & Time */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-white text-sm">{sym}</p>
                      <p className="text-xs text-gray-400">{tickerData.displayName}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-semibold ${getChangeColor(tickerData.changePercent)}`}>
                        {tickerData.changePercent > 0 ? "+" : ""}
                        {tickerData.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-lg font-bold text-cyan-400">{tickerData.price.toFixed(4)}</p>
                    <p className={`text-xs font-semibold ${getChangeColor(tickerData.change)}`}>
                      {tickerData.change > 0 ? "+" : ""}
                      {tickerData.change.toFixed(4)}
                    </p>
                  </div>

                  {/* Last Digit Badge */}
                  {tickerData.lastDigit !== null && (
                    <div className={`px-2 py-1 rounded text-center ${getDigitColor(tickerData.lastDigit)}`}>
                      <p className="text-xs font-bold">
                        Digit: {tickerData.lastDigit} {tickerData.lastDigit % 2 === 0 ? "(E)" : "(O)"}
                      </p>
                    </div>
                  )}

                  {/* Update Time */}
                  <p className="text-xs text-gray-500 text-center">{tickerData.updateTime.toLocaleTimeString()}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-purple-500/20 p-3">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Symbols Tracking: {displaySymbols.length}</span>
          <span>Status: {connectionStatus}</span>
          <span>Last Update: {new Date().toLocaleTimeString()}</span>
        </div>
      </Card>
    </div>
  )
}
