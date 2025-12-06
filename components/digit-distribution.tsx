"use client"
import { Badge } from "@/components/ui/badge"
import type { DigitFrequency } from "@/lib/analysis-engine"

interface DigitDistributionProps {
  frequencies: DigitFrequency[]
  currentDigit?: number | null
  theme?: "light" | "dark"
}

export function DigitDistribution({ frequencies, currentDigit = null, theme = "dark" }: DigitDistributionProps) {
  // Sort frequencies for display
  const sortedFrequencies = [...frequencies].sort((a, b) => b.count - a.count)

  // Calculate max count for scaling
  const maxCount = Math.max(...frequencies.map((f) => f.count), 1)

  // Group digits into even/odd for summary
  const evenDigits = frequencies.filter((f) => f.digit % 2 === 0)
  const oddDigits = frequencies.filter((f) => f.digit % 2 !== 0)
  const evenTotal = evenDigits.reduce((sum, f) => sum + f.count, 0)
  const oddTotal = oddDigits.reduce((sum, f) => sum + f.count, 0)
  const totalCount = evenTotal + oddTotal

  return (
    <div className="w-full space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className={`p-3 rounded-lg ${theme === "dark" ? "bg-slate-700/30 border border-blue-500/30" : "bg-blue-50 border border-blue-200"}`}
        >
          <p className={`text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Even Digits</p>
          <p className={`text-lg font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
            {evenTotal} {totalCount > 0 && `(${((evenTotal / totalCount) * 100).toFixed(1)}%)`}
          </p>
        </div>
        <div
          className={`p-3 rounded-lg ${theme === "dark" ? "bg-slate-700/30 border border-orange-500/30" : "bg-orange-50 border border-orange-200"}`}
        >
          <p className={`text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Odd Digits</p>
          <p className={`text-lg font-bold ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`}>
            {oddTotal} {totalCount > 0 && `(${((oddTotal / totalCount) * 100).toFixed(1)}%)`}
          </p>
        </div>
      </div>

      {/* Digit Distribution Bars */}
      <div className="space-y-2">
        <p className={`text-sm font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
          Digit Frequency Distribution
        </p>
        <div className="grid grid-cols-5 gap-2">
          {sortedFrequencies.map((freq) => (
            <div
              key={freq.digit}
              className={`space-y-2 p-2 rounded-lg ${
                currentDigit === freq.digit
                  ? theme === "dark"
                    ? "bg-cyan-500/20 border border-cyan-500/50"
                    : "bg-cyan-50 border border-cyan-200"
                  : theme === "dark"
                    ? "bg-slate-700/30 border border-slate-600/30"
                    : "bg-gray-50 border border-gray-200"
              }`}
            >
              {/* Bar */}
              <div className="relative h-16 bg-slate-700/50 rounded overflow-hidden">
                <div
                  className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
                    freq.digit % 2 === 0
                      ? "bg-gradient-to-t from-blue-500 to-blue-400"
                      : "bg-gradient-to-t from-orange-500 to-orange-400"
                  }`}
                  style={{ height: `${(freq.count / maxCount) * 100}%` }}
                />
              </div>

              {/* Digit Label */}
              <div className="text-center">
                <Badge
                  className={`${
                    freq.digit % 2 === 0
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                      : "bg-orange-500/20 text-orange-400 border-orange-500/50"
                  }`}
                >
                  {freq.digit}
                </Badge>
              </div>

              {/* Count */}
              <div className="text-center">
                <p className={`text-xs font-bold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  {freq.count}
                </p>
                <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
                  {freq.percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="space-y-3">
        <p className={`text-sm font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
          Frequency Ranking
        </p>
        <div className="space-y-2">
          {sortedFrequencies.slice(0, 5).map((freq, idx) => (
            <div key={freq.digit} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    #{idx + 1}
                  </span>
                  <Badge
                    className={`${
                      freq.digit % 2 === 0
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                        : "bg-orange-500/20 text-orange-400 border-orange-500/50"
                    }`}
                  >
                    {freq.digit}
                  </Badge>
                </div>
                <span className={`text-sm font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  {freq.count}x ({freq.percentage.toFixed(1)}%)
                </span>
              </div>
              <div
                className={`h-2 rounded-full overflow-hidden ${theme === "dark" ? "bg-slate-700/50" : "bg-gray-200"}`}
              >
                <div
                  className={`h-full ${
                    freq.digit % 2 === 0 ? "bg-blue-500" : "bg-orange-500"
                  } transition-all duration-300`}
                  style={{ width: `${(freq.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
