"use client"

import { useDeriv } from "@/hooks/use-deriv"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, BarChart3, PieChart, TrendingUp, AlertCircle, Target } from "lucide-react"

export function MarketAnalysisSummary() {
  const { analysis, currentDigit, symbol, connectionStatus } = useDeriv()

  if (!analysis) {
    return (
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-blue-500/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-gray-400">
            <Activity className="h-4 w-4 animate-spin" />
            <span>Analyzing market data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get top and bottom digits
  const sortedDigits = [...analysis.digitFrequencies].sort((a, b) => b.count - a.count)
  const topDigits = sortedDigits.slice(0, 3)
  const bottomDigits = sortedDigits.slice(-3).reverse()

  // Calculate analysis scores
  const entropyScore = Math.min(100, (analysis.entropy / 3.32) * 100) // Max entropy is ~3.32 for 10 digits
  const powerGap = analysis.powerIndex.gap
  const consistencyScore = 100 - entropyScore // Lower entropy = more consistent

  return (
    <div className="w-full space-y-4">
      {/* Main Analysis Overview */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            Market Analysis Summary
          </CardTitle>
          <CardDescription>Comprehensive digit and pattern analysis for {symbol}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overview Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Total Ticks */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400">Total Ticks</p>
              <p className="text-2xl font-bold text-emerald-400">{analysis.totalTicks}</p>
            </div>

            {/* Current Digit */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400">Current Digit</p>
              <div className="flex items-baseline gap-2">
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
                {currentDigit !== null && (
                  <Badge
                    variant="outline"
                    className={
                      currentDigit % 2 === 0
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                        : "bg-orange-500/20 text-orange-400 border-orange-500/50"
                    }
                  >
                    {currentDigit % 2 === 0 ? "E" : "O"}
                  </Badge>
                )}
              </div>
            </div>

            {/* Missing Digits Count */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400">Missing Digits</p>
              <p className="text-2xl font-bold text-purple-400">{analysis.missingDigits.length}</p>
              <p className="text-xs text-gray-500">{analysis.missingDigits.join(", ") || "None"}</p>
            </div>

            {/* Entropy Score */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400">Entropy</p>
              <p className="text-2xl font-bold text-pink-400">{analysis.entropy.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Randomness level</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Digit Patterns & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Even/Odd Distribution */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <PieChart className="h-4 w-4 text-blue-400" />
              Even/Odd Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Even */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Even (0,2,4,6,8)</span>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                  {analysis.evenCount} ({analysis.evenPercentage.toFixed(1)}%)
                </Badge>
              </div>
              <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
                  style={{ width: `${analysis.evenPercentage}%` }}
                />
              </div>
            </div>

            {/* Odd */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Odd (1,3,5,7,9)</span>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">
                  {analysis.oddCount} ({analysis.oddPercentage.toFixed(1)}%)
                </Badge>
              </div>
              <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all"
                  style={{ width: `${analysis.oddPercentage}%` }}
                />
              </div>
            </div>

            {/* Analysis */}
            <div className="pt-2 border-t border-slate-700/50">
              {Math.abs(analysis.evenPercentage - analysis.oddPercentage) > 10 ? (
                <p className="text-xs text-yellow-400 flex items-start gap-2">
                  <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  Strong bias detected - {analysis.evenPercentage > analysis.oddPercentage ? "Even" : "Odd"} dominance
                </p>
              ) : (
                <p className="text-xs text-emerald-400">Balanced distribution</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* High/Low Distribution */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              High/Low Distribution (5-9 vs 0-4)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* High */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">High (5-9)</span>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                  {analysis.highCount} ({analysis.highPercentage.toFixed(1)}%)
                </Badge>
              </div>
              <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-all"
                  style={{ width: `${analysis.highPercentage}%` }}
                />
              </div>
            </div>

            {/* Low */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Low (0-4)</span>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                  {analysis.lowCount} ({analysis.lowPercentage.toFixed(1)}%)
                </Badge>
              </div>
              <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all"
                  style={{ width: `${analysis.lowPercentage}%` }}
                />
              </div>
            </div>

            {/* Analysis */}
            <div className="pt-2 border-t border-slate-700/50">
              {Math.abs(analysis.highPercentage - analysis.lowPercentage) > 10 ? (
                <p className="text-xs text-yellow-400 flex items-start gap-2">
                  <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  Range bias toward {analysis.highPercentage > analysis.lowPercentage ? "High" : "Low"} digits
                </p>
              ) : (
                <p className="text-xs text-emerald-400">Balanced range distribution</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Power Index & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Power Index */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Target className="h-4 w-4 text-emerald-400" />
              Power Index Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Strongest Digit */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Strongest Digit</span>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                  {analysis.powerIndex.strongest}
                </Badge>
              </div>
              <p className="text-xs text-gray-500">Most frequently occurring digit in recent ticks</p>
            </div>

            {/* Weakest Digit */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Weakest Digit</span>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/50">{analysis.powerIndex.weakest}</Badge>
              </div>
              <p className="text-xs text-gray-500">Least frequently occurring digit in recent ticks</p>
            </div>

            {/* Power Gap */}
            <div className="pt-2 border-t border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Power Gap</span>
                <span className="font-bold text-amber-400">{powerGap}</span>
              </div>
              <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (powerGap / analysis.totalTicks) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Gap between strongest and weakest</p>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-amber-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <BarChart3 className="h-4 w-4 text-amber-400" />
              Digit Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Top 3 */}
            <div>
              <p className="text-xs font-medium text-gray-400 mb-2">Top 3 Performers</p>
              <div className="space-y-2">
                {topDigits.map((digit, idx) => (
                  <div key={digit.digit} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-emerald-400">#{idx + 1}</span>
                      <Badge
                        className={`${
                          digit.digit % 2 === 0 ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
                        }`}
                      >
                        {digit.digit}
                      </Badge>
                    </div>
                    <span className="text-sm font-semibold text-gray-300">
                      {digit.count} ({digit.percentage.toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom 3 */}
            <div className="pt-2 border-t border-slate-700/50">
              <p className="text-xs font-medium text-gray-400 mb-2">Least Performers</p>
              <div className="space-y-2">
                {bottomDigits.map((digit) => (
                  <div key={digit.digit} className="flex items-center justify-between">
                    <Badge
                      className={`${
                        digit.digit % 2 === 0 ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
                      }`}
                    >
                      {digit.digit}
                    </Badge>
                    <span className="text-sm font-semibold text-gray-300">
                      {digit.count} ({digit.percentage.toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Streak Analysis */}
      {analysis.streaks && analysis.streaks.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-pink-500/20">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Streak Analysis</CardTitle>
            <CardDescription>Consecutive occurrences of the same digit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {analysis.streaks.slice(0, 8).map((streak) => (
                <div
                  key={streak.digit}
                  className="p-3 rounded-lg bg-slate-700/30 border border-slate-600/50 text-center"
                >
                  <p className="text-xl font-bold text-pink-400">{streak.digit}</p>
                  <p className="text-xs text-gray-400">streak: {streak.count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
