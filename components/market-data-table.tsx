"use client"

import { useState, useEffect, useMemo } from "react"
import { useDeriv } from "@/hooks/use-deriv"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, TrendingUp, TrendingDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MarketMetrics {
  symbol: string
  displayName: string
  price: number
  previousPrice: number
  change: number
  changePercent: number
  lastDigit: number | null
  digitType: "EVEN" | "ODD" | "UNKNOWN"
  digitCategory: "HIGH" | "LOW" | "UNKNOWN" // 5-9 vs 0-4
  updateTime: Date
  volatility: number
}

type SortColumn = "symbol" | "price" | "change" | "changePercent" | "digit"
type SortDirection = "asc" | "desc"

export function MarketDataTable() {
  const { connectionStatus, currentPrice, currentDigit, symbol, availableSymbols, changeSymbol, analysis } = useDeriv()

  const [allMetrics, setAllMetrics] = useState<Map<string, MarketMetrics>>(new Map())
  const [sortColumn, setSortColumn] = useState<SortColumn>("symbol")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterByType, setFilterByType] = useState<"ALL" | "EVEN" | "ODD">("ALL")
  const [itemsPerPage, setItemsPerPage] = useState(20)

  // Update metrics when price changes
  useEffect(() => {
    if (currentPrice !== null && currentDigit !== null) {
      setAllMetrics((prev) => {
        const newMap = new Map(prev)
        const existing = newMap.get(symbol)
        const previousPrice = existing?.price || currentPrice
        const change = currentPrice - previousPrice
        const changePercent = previousPrice !== 0 ? (change / previousPrice) * 100 : 0

        const digitType = currentDigit % 2 === 0 ? "EVEN" : "ODD"
        const digitCategory = currentDigit >= 5 ? "HIGH" : "LOW"

        newMap.set(symbol, {
          symbol,
          displayName: availableSymbols.find((s) => s.symbol === symbol)?.display_name || symbol,
          price: currentPrice,
          previousPrice,
          change,
          changePercent,
          lastDigit: currentDigit,
          digitType,
          digitCategory,
          updateTime: new Date(),
          volatility: Math.abs(change),
        })

        return newMap
      })
    }
  }, [symbol, currentPrice, currentDigit, availableSymbols])

  // Filter and sort data
  const filteredAndSorted = useMemo(() => {
    let data = Array.from(allMetrics.values())

    // Filter by search query
    if (searchQuery) {
      data = data.filter(
        (m) =>
          m.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by digit type
    if (filterByType !== "ALL") {
      data = data.filter((m) => m.digitType === filterByType)
    }

    // Sort
    data.sort((a, b) => {
      let compareValue = 0

      switch (sortColumn) {
        case "symbol":
          compareValue = a.symbol.localeCompare(b.symbol)
          break
        case "price":
          compareValue = a.price - b.price
          break
        case "change":
          compareValue = a.change - b.change
          break
        case "changePercent":
          compareValue = a.changePercent - b.changePercent
          break
        case "digit":
          compareValue = (a.lastDigit || 0) - (b.lastDigit || 0)
          break
      }

      return sortDirection === "asc" ? compareValue : -compareValue
    })

    return data
  }, [allMetrics, sortColumn, sortDirection, searchQuery, filterByType])

  const paginatedData = filteredAndSorted.slice(0, itemsPerPage)
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage)

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return <span className="text-gray-500">⇅</span>
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 text-cyan-400" />
    ) : (
      <ChevronDown className="h-4 w-4 text-cyan-400" />
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-blue-500/20">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Search */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1 block">Search Markets</label>
                <Input
                  placeholder="Search symbol or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white text-sm h-8"
                />
              </div>

              {/* Filter by Type */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1 block">Filter Digit Type</label>
                <Select value={filterByType} onValueChange={(v) => setFilterByType(v as any)}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white text-sm h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="ALL">All Digits</SelectItem>
                    <SelectItem value="EVEN">Even Only</SelectItem>
                    <SelectItem value="ODD">Odd Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Items Per Page */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1 block">Show Per Page</label>
                <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(Number(v))}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white text-sm h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {[10, 20, 50, 100].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} markets
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-xs text-gray-400">
              Showing {paginatedData.length} of {filteredAndSorted.length} markets
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-cyan-500/20 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Advanced Market Data</CardTitle>
          <CardDescription>Real-time metrics for all traded symbols</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600/50">
                  <th className="px-4 py-2 text-left">
                    <button
                      onClick={() => handleSort("symbol")}
                      className="flex items-center gap-2 font-semibold text-gray-300 hover:text-cyan-400 transition-colors"
                    >
                      Symbol <SortIcon column="symbol" />
                    </button>
                  </th>
                  <th className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleSort("price")}
                      className="flex items-center justify-end gap-2 font-semibold text-gray-300 hover:text-cyan-400 transition-colors ml-auto"
                    >
                      Price <SortIcon column="price" />
                    </button>
                  </th>
                  <th className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleSort("change")}
                      className="flex items-center justify-end gap-2 font-semibold text-gray-300 hover:text-cyan-400 transition-colors ml-auto"
                    >
                      Change <SortIcon column="change" />
                    </button>
                  </th>
                  <th className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleSort("changePercent")}
                      className="flex items-center justify-end gap-2 font-semibold text-gray-300 hover:text-cyan-400 transition-colors ml-auto"
                    >
                      % <SortIcon column="changePercent" />
                    </button>
                  </th>
                  <th className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleSort("digit")}
                      className="flex items-center justify-center gap-2 font-semibold text-gray-300 hover:text-cyan-400 transition-colors mx-auto"
                    >
                      Last Digit <SortIcon column="digit" />
                    </button>
                  </th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-300">Category</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-300">Time</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((market, idx) => (
                    <tr
                      key={market.symbol}
                      className={`border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors cursor-pointer ${
                        symbol === market.symbol ? "bg-cyan-500/10" : idx % 2 === 0 ? "bg-slate-800/30" : ""
                      }`}
                      onClick={() => changeSymbol(market.symbol)}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-white">{market.symbol}</p>
                          <p className="text-xs text-gray-400">{market.displayName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="font-bold text-cyan-400">{market.price.toFixed(4)}</p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div
                          className={`flex items-center justify-end gap-1 ${market.change >= 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          {market.change >= 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span className="font-semibold">{Math.abs(market.change).toFixed(4)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge
                          className={
                            market.changePercent > 0
                              ? "bg-green-500/20 text-green-400 border-green-500/50"
                              : market.changePercent < 0
                                ? "bg-red-500/20 text-red-400 border-red-500/50"
                                : "bg-gray-500/20 text-gray-400 border-gray-500/50"
                          }
                        >
                          {market.changePercent > 0 ? "+" : ""}
                          {market.changePercent.toFixed(2)}%
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {market.lastDigit !== null ? (
                          <Badge
                            className={`${
                              market.digitType === "EVEN"
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                                : "bg-orange-500/20 text-orange-400 border-orange-500/50"
                            }`}
                          >
                            {market.lastDigit}
                          </Badge>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          className={`${
                            market.digitCategory === "HIGH"
                              ? "bg-purple-500/20 text-purple-400 border-purple-500/50"
                              : "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                          }`}
                        >
                          {market.digitCategory === "HIGH" ? "5-9" : "0-4"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-gray-500">
                        {market.updateTime.toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      No market data available yet. Check connection status.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
              <span>Page info</span>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${page === 1 ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400 hover:text-white"}`}
                    onClick={() => {
                      setItemsPerPage((page - 1) * itemsPerPage + itemsPerPage)
                    }}
                  >
                    {page}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
