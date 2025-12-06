"use client"
import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react"

interface MoneyMakerAnalysis {
  underPercent: number
  overPercent: number
  underIncreasing: boolean
  overIncreasing: boolean
  volatility: number
  marketPower: number
  strongestUnder: number | null
  strongestOver: number | null
  underPredictions: string[]
  overPredictions: string[]
}

interface SignalState {
  status: "NEUTRAL" | "WAIT" | "READY" | "RUN NOW" | "TRADING" | "EXIT"
  color: string
  type: "UNDER" | "OVER" | null
  confidence: number
  phase: 1 | 2
  confirmedTicks: number
  tradingTicksRemaining: number
}

interface AdvancedOverUnderTabProps {
  theme?: "light" | "dark"
  recentDigits: number[]
}

export function AdvancedOverUnderTab({ theme = "dark", recentDigits = [] }: AdvancedOverUnderTabProps) {
  const analysis = useMemo(() => {
    const safeDigits = recentDigits && Array.isArray(recentDigits) ? recentDigits : []

    if (safeDigits.length < 20) {
      return null
    }

    const last50 = safeDigits.slice(-50)
    const last100 = safeDigits.slice(-100)

    // Under 4 Analysis (digits 0, 1, 2, 3)
    const under4Count50 = last50.filter((d) => d <= 3).length
    const under4Count100 = last100.filter((d) => d <= 3).length
    const under4Percent50 = (under4Count50 / last50.length) * 100
    const under4Percent100 = (under4Count100 / last100.length) * 100
    const under4Increasing = under4Percent50 > under4Percent100

    // Over 5 Analysis (digits 6, 7, 8, 9)
    const over5Count50 = last50.filter((d) => d >= 6).length
    const over5Count100 = last100.filter((d) => d >= 6).length
    const over5Percent50 = (over5Count50 / last50.length) * 100
    const over5Percent100 = (over5Count100 / last100.length) * 100
    const over5Increasing = over5Percent50 > over5Percent100

    // Find highest frequency digits for Under 4 (0-3)
    const under4Digits = [0, 1, 2, 3]
    const under4Frequencies = under4Digits.map((digit) => ({
      digit,
      count: last100.filter((d) => d === digit).length,
      percent: (last100.filter((d) => d === digit).length / last100.length) * 100,
    }))
    const highestUnder4 = under4Frequencies.sort((a, b) => b.count - a.count)[0]

    // Find highest frequency digits for Over 5 (6-9)
    const over5Digits = [6, 7, 8, 9]
    const over5Frequencies = over5Digits.map((digit) => ({
      digit,
      count: last100.filter((d) => d === digit).length,
      percent: (last100.filter((d) => d === digit).length / last100.length) * 100,
    }))
    const highestOver5 = over5Frequencies.sort((a, b) => b.count - a.count)[0]

    // All digit frequencies for distribution
    const allDigitFrequencies = Array.from({ length: 10 }, (_, i) => ({
      digit: i,
      count: last100.filter((d) => d === i).length,
      percent: (last100.filter((d) => d === i).length / last100.length) * 100,
    }))

    // Signal determination
    const getSignal = (percent: number, increasing: boolean) => {
      if (percent >= 60 && increasing) return { status: "STRONG", color: "bg-green-500" }
      if (percent >= 56 && increasing) return { status: "TRADE NOW", color: "bg-emerald-500" }
      if (percent >= 53 && increasing) return { status: "WAIT", color: "bg-blue-500" }
      if (percent >= 50) return { status: "WATCH", color: "bg-yellow-500" }
      return { status: "NEUTRAL", color: "bg-gray-500" }
    }

    return {
      under4: {
        percent50: under4Percent50,
        percent100: under4Percent100,
        increasing: under4Increasing,
        signal: getSignal(under4Percent50, under4Increasing),
        frequencies: under4Frequencies,
        highest: highestUnder4,
      },
      over5: {
        percent50: over5Percent50,
        percent100: over5Percent100,
        increasing: over5Increasing,
        signal: getSignal(over5Percent50, over5Increasing),
        frequencies: over5Frequencies,
        highest: highestOver5,
      },
      allDigits: allDigitFrequencies,
      ticksAnalyzed: last100.length,
    }
  }, [recentDigits])

  if (!analysis) {
    return (
      <div className={`p-6 text-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Collecting data... Need at least 20 ticks for analysis.</p>
        <p className="text-sm mt-2">Current: {recentDigits.length} ticks</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className={`text-2xl sm:text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Advanced Over/Under Analysis
        </h2>
        <p className={`text-sm mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Under 4 (0-3) and Over 5 (6-9) with highest digit signals
        </p>
        <Badge className="mt-2 bg-blue-500/20 text-blue-400 border-blue-500/50">
          {analysis.ticksAnalyzed} Ticks Analyzed
        </Badge>
      </div>

      {/* Main Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Under 4 Analysis */}
        <Card
          className={`border-2 ${
            analysis.under4.signal.status === "STRONG" || analysis.under4.signal.status === "TRADE NOW"
              ? "border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              : theme === "dark"
                ? "border-blue-500/20"
                : "border-gray-200"
          } ${theme === "dark" ? "bg-gradient-to-br from-blue-900/30 to-slate-900/50" : "bg-white"}`}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-blue-400" />
                <span className={theme === "dark" ? "text-white" : "text-gray-900"}>Under 4 (0-3)</span>
              </div>
              <Badge className={`${analysis.under4.signal.color} text-white`}>{analysis.under4.signal.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Percentage Display */}
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-blue-400">
                {analysis.under4.percent50.toFixed(1)}%
              </div>
              <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Last 50 ticks {analysis.under4.increasing ? "↗ Increasing" : "↘ Decreasing"}
              </div>
              <div className={`text-xs mt-1 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                Last 100: {analysis.under4.percent100.toFixed(1)}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${Math.min(analysis.under4.percent50, 100)}%` }}
              />
            </div>

            {/* Digit Frequencies */}
            <div>
              <p className={`text-xs font-semibold mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Digit Distribution (0-3):
              </p>
              <div className="grid grid-cols-4 gap-2">
                {analysis.under4.frequencies.map((f) => (
                  <div
                    key={f.digit}
                    className={`p-2 rounded text-center ${
                      f.digit === analysis.under4.highest.digit
                        ? "bg-blue-500/30 border border-blue-500"
                        : theme === "dark"
                          ? "bg-slate-700/50"
                          : "bg-gray-100"
                    }`}
                  >
                    <div className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {f.digit}
                    </div>
                    <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {f.percent.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Highest Signal */}
            {analysis.under4.signal.status !== "NEUTRAL" && (
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <p className={`text-sm font-semibold ${theme === "dark" ? "text-blue-300" : "text-blue-700"}`}>
                  Strongest Under 4 Digit: {analysis.under4.highest.digit}
                </p>
                <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Appeared {analysis.under4.highest.count} times ({analysis.under4.highest.percent.toFixed(1)}%)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Over 5 Analysis */}
        <Card
          className={`border-2 ${
            analysis.over5.signal.status === "STRONG" || analysis.over5.signal.status === "TRADE NOW"
              ? "border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              : theme === "dark"
                ? "border-green-500/20"
                : "border-gray-200"
          } ${theme === "dark" ? "bg-gradient-to-br from-green-900/30 to-slate-900/50" : "bg-white"}`}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <span className={theme === "dark" ? "text-white" : "text-gray-900"}>Over 5 (6-9)</span>
              </div>
              <Badge className={`${analysis.over5.signal.color} text-white`}>{analysis.over5.signal.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Percentage Display */}
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-green-400">
                {analysis.over5.percent50.toFixed(1)}%
              </div>
              <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Last 50 ticks {analysis.over5.increasing ? "↗ Increasing" : "↘ Decreasing"}
              </div>
              <div className={`text-xs mt-1 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                Last 100: {analysis.over5.percent100.toFixed(1)}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${Math.min(analysis.over5.percent50, 100)}%` }}
              />
            </div>

            {/* Digit Frequencies */}
            <div>
              <p className={`text-xs font-semibold mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Digit Distribution (6-9):
              </p>
              <div className="grid grid-cols-4 gap-2">
                {analysis.over5.frequencies.map((f) => (
                  <div
                    key={f.digit}
                    className={`p-2 rounded text-center ${
                      f.digit === analysis.over5.highest.digit
                        ? "bg-green-500/30 border border-green-500"
                        : theme === "dark"
                          ? "bg-slate-700/50"
                          : "bg-gray-100"
                    }`}
                  >
                    <div className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {f.digit}
                    </div>
                    <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {f.percent.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Highest Signal */}
            {analysis.over5.signal.status !== "NEUTRAL" && (
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                <p className={`text-sm font-semibold ${theme === "dark" ? "text-green-300" : "text-green-700"}`}>
                  Strongest Over 5 Digit: {analysis.over5.highest.digit}
                </p>
                <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Appeared {analysis.over5.highest.count} times ({analysis.over5.highest.percent.toFixed(1)}%)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Digits Distribution */}
      <Card className={theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200"}>
        <CardHeader>
          <CardTitle className={theme === "dark" ? "text-white" : "text-gray-900"}>
            Full Digit Distribution (0-9)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {analysis.allDigits.map((f) => (
              <div
                key={f.digit}
                className={`p-2 sm:p-3 rounded text-center transition-all ${
                  f.digit <= 3
                    ? "bg-blue-500/20 border border-blue-500/30"
                    : f.digit >= 6
                      ? "bg-green-500/20 border border-green-500/30"
                      : theme === "dark"
                        ? "bg-slate-700/50"
                        : "bg-gray-100"
                }`}
              >
                <div
                  className={`text-lg sm:text-xl font-bold ${
                    f.digit <= 3
                      ? "text-blue-400"
                      : f.digit >= 6
                        ? "text-green-400"
                        : theme === "dark"
                          ? "text-white"
                          : "text-gray-900"
                  }`}
                >
                  {f.digit}
                </div>
                <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  {f.percent.toFixed(1)}%
                </div>
                <div className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>({f.count})</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Signal Legend */}
      <Card className={theme === "dark" ? "bg-slate-800/30 border-slate-700" : "bg-gray-50 border-gray-200"}>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>STRONG (60%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                TRADE NOW (56%+)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>WAIT (53%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>WATCH (50%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>NEUTRAL</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdvancedOverUnderTab
