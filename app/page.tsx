"use client"

import { useState, useEffect } from "react"
import { useDeriv } from "@/hooks/use-deriv"
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Rocket, Activity } from "lucide-react"
import { DigitDistribution } from "@/components/digit-distribution"
import { SignalsTab } from "@/components/tabs/signals-tab"
import { ProSignalsTab } from "@/components/tabs/pro-signals-tab"
import { EvenOddTab } from "@/components/tabs/even-odd-tab"
import { OverUnderTab } from "@/components/tabs/over-under-tab"
import { MatchesTab } from "@/components/tabs/matches-tab"
import { DiffersTab } from "@/components/tabs/differs-tab"
import { RiseFallTab } from "@/components/tabs/rise-fall-tab"
import { TradingViewTab } from "@/components/tabs/trading-view-tab"
import { StatisticalAnalysis } from "@/components/statistical-analysis"
import { LastDigitsChart } from "@/components/charts/last-digits-chart"
import { LastDigitsLineChart } from "@/components/charts/last-digits-line-chart"
import { AIAnalysisTab } from "@/components/tabs/ai-analysis-tab"
import { SuperSignalsTab } from "@/components/tabs/super-signals-tab"
import { AutoBotTab } from "@/components/tabs/autobot-tab"
import { AutomatedTab } from "@/components/tabs/automated-tab"
import { SmartAuto24Tab } from "@/components/tabs/smartauto24-tab"
import { useGlobalTradingContext } from "@/hooks/use-global-trading-context"
import { LiveTicker } from "@/components/live-ticker"
import { TradeNowTab } from "@/components/tabs/trade-now-tab"
import { ToolsInfoTab } from "@/components/tabs/tools-info-tab"
import TradingBotSlider from "@/components/tabs/Slider"
import { AdvancedOverUnderTab } from "@/components/tabs/advanced-over-under-tab"
import { SettingsDialog } from "@/components/settings-dialog"

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [isLoading, setIsLoading] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)
  const [isSliderOpen, setIsSliderOpen] = useState(false)
  const globalContext = useGlobalTradingContext()

  const { marketData, symbols, selectedSymbol, setSelectedSymbol, connectionStatus, analysisData, currentPrice } =
    useDeriv()

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const [isTrading, setIsTrading] = useState(false)

  useEffect(() => {
    try {
      document.documentElement.classList.add("dark")
      console.log("[v0] App initialized")
    } catch (error) {
      console.error("[v0] Initialization error:", error)
      setInitError(error instanceof Error ? error.message : "Unknown error")
    }
  }, [])

  const getRecentDigits = (count: number) => (marketData || []).slice(-count)

  const recentDigits = getRecentDigits(20)
  const recent40Digits = getRecentDigits(40)
  const recent50Digits = getRecentDigits(50)
  const recent100Digits = getRecentDigits(100)

  const activeSignals = (analysisData.signals || []).filter((s) => s.status !== "NEUTRAL")
  const powerfulSignalsCount = activeSignals.filter((s) => s.status === "TRADE NOW").length

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-red-950">
        <div className="text-center p-8 bg-red-800/50 rounded-xl border border-red-500 max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Initialization Error</h2>
          <p className="text-red-200 mb-6">{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-br from-[#0a0e27] via-[#0f1629] to-[#1a1f3a]" : "bg-gradient-to-br from-gray-50 via-white to-gray-100"}`}
    >
      {isSliderOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-6xl max-h-[90vh] overflow-auto">
            <button
              onClick={() => setIsSliderOpen(false)}
              className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <TradingBotSlider dashboardSymbol={selectedSymbol} dashboardPrice={currentPrice} dashboardDigit={null} />
          </div>
        </div>
      )}

      <header
        className={`border-b ${
          globalContext.accountType === "Real"
            ? "border-green-500/30 bg-gradient-to-r from-green-900/60 to-green-800/60 backdrop-blur-md"
            : globalContext.accountType === "Demo"
              ? "border-yellow-500/30 bg-gradient-to-r from-yellow-900/60 to-yellow-800/60 backdrop-blur-md"
              : "border-blue-500/20 bg-[#0a0e27]/80 backdrop-blur-md"
        } sticky top-0 z-50 shadow-lg`}
      >
        <div className="w-full px-3 sm:px-4 md:px-6 py-2">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
              <span className="text-base sm:text-lg md:text-xl font-black bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent whitespace-nowrap">
                Profit Hub
              </span>
            </div>

            {/* Center: Market Price, Last Digit, Connection Status */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-center">
              {/* Market Price */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400 hidden sm:inline">Price:</span>
                <span className="text-sm sm:text-base font-bold text-cyan-400">
                  {currentPrice?.toFixed(4) || "---"}
                </span>
              </div>

              {/* Divider */}
              <div className="h-4 w-px bg-gray-600 hidden sm:block" />

              {/* Last Digit */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400 hidden sm:inline">Digit:</span>
                <span
                  className={`text-base sm:text-lg font-bold ${
                    marketData.length > 0 && marketData[marketData.length - 1] % 2 === 0
                      ? "text-blue-400"
                      : "text-orange-400"
                  }`}
                >
                  {marketData.length > 0 ? marketData[marketData.length - 1] : "-"}
                </span>
              </div>

              {/* Divider */}
              <div className="h-4 w-px bg-gray-600 hidden sm:block" />

              {/* Connection Status */}
              <Badge
                className={`text-xs px-2 py-0.5 ${
                  connectionStatus === "connected"
                    ? "bg-green-500/20 text-green-400 border-green-500/50"
                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50 animate-pulse"
                }`}
              >
                <Activity className="h-3 w-3 mr-1 inline" />
                {connectionStatus === "connected" ? "LIVE" : "Connecting..."}
              </Badge>
            </div>

            {/* Right: Settings */}
            <div className="flex items-center">
              <SettingsDialog
                symbols={symbols}
                currentSymbol={selectedSymbol}
                onSymbolChange={setSelectedSymbol}
                theme={theme}
                setTheme={setTheme}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Live Ticker */}
      <LiveTicker theme={theme} />

      {/* Main Content */}
      <main className="container-responsive py-4 sm:py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div
            className={`p-3 sm:p-4 rounded-xl border ${
              theme === "dark"
                ? "bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border-blue-500/20"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Current Price</div>
            <div className={`text-lg sm:text-xl font-bold ${theme === "dark" ? "text-cyan-400" : "text-blue-600"}`}>
              {currentPrice?.toFixed(4) || "---"}
            </div>
          </div>
          <div
            className={`p-3 sm:p-4 rounded-xl border ${
              theme === "dark"
                ? "bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/20"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Last Digit</div>
            <div
              className={`text-2xl sm:text-3xl font-bold ${
                marketData.length > 0 && marketData[marketData.length - 1] % 2 === 0
                  ? "text-blue-400"
                  : "text-orange-400"
              }`}
            >
              {marketData.length > 0 ? marketData[marketData.length - 1] : "-"}
            </div>
          </div>
          <div
            className={`p-3 sm:p-4 rounded-xl border ${
              theme === "dark"
                ? "bg-gradient-to-br from-emerald-900/30 to-green-900/20 border-emerald-500/20"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Ticks</div>
            <div className={`text-lg sm:text-xl font-bold ${theme === "dark" ? "text-emerald-400" : "text-green-600"}`}>
              {marketData.length}
            </div>
          </div>
          <div
            className={`p-3 sm:p-4 rounded-xl border ${
              theme === "dark"
                ? "bg-gradient-to-br from-amber-900/30 to-yellow-900/20 border-amber-500/20"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Active Signals</div>
            <div className={`text-lg sm:text-xl font-bold ${theme === "dark" ? "text-amber-400" : "text-amber-600"}`}>
              {powerfulSignalsCount}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="smart-analysis" className="space-y-4">
          <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
            <TabsList
              className={`inline-flex gap-1 sm:gap-2 p-1 rounded-xl w-max min-w-full sm:min-w-0 ${
                theme === "dark" ? "bg-slate-800/50 backdrop-blur-sm" : "bg-gray-100"
              }`}
            >
              {[
                "smart-analysis",
                "signals",
                "pro-signals",
                "super-signals",
                "even-odd",
                "over-under",
                "advanced-over-under",
                "matches",
                "differs",
                "rise-fall",
                "ai-analysis",
                "autobot",
                "automated",
                "slider",
                "trading-view",
                "trade-now",
                "smartauto24",
                "tools-info",
              ].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className={`flex-shrink-0 rounded-lg border border-transparent text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap transition-all capitalize font-medium ${
                    tab === "smartauto24"
                      ? "data-[state=active]:border-yellow-500 data-[state=active]:bg-yellow-500/10 data-[state=active]:text-yellow-400 data-[state=active]:shadow-[0_2px_10px_rgba(234,179,8,0.25)]"
                      : tab === "autobot" || tab === "automated" || tab === "slider"
                        ? "data-[state=active]:border-cyan-500 data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 data-[state=active]:shadow-[0_2px_10px_rgba(34,211,238,0.25)]"
                        : tab === "tools-info"
                          ? "data-[state=active]:border-purple-500 data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400 data-[state=active]:shadow-[0_2px_10px_rgba(168,85,247,0.25)]"
                          : tab === "trade-now"
                            ? "data-[state=active]:border-emerald-500 data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 data-[state=active]:shadow-[0_2px_10px_rgba(34,197,94,0.25)]"
                            : "data-[state=active]:border-emerald-400 data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 data-[state=active]:shadow-[0_2px_10px_rgba(34,211,238,0.25)]"
                  } data-[state=active]:bg-transparent ${theme === "dark" ? "text-gray-400 hover:text-white hover:bg-slate-800/50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"}`}
                >
                  {tab.replace(/-/g, " ")}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="smart-analysis" className="mt-0">
            <div className="space-y-6 sm:space-y-8">
              {/* Digit Distribution */}
              <div
                className={`p-3 sm:p-4 md:p-6 rounded-xl border ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-blue-500/20"
                    : "bg-white border-gray-200 shadow-sm"
                }`}
              >
                <h3
                  className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Digit Distribution
                </h3>
                <DigitDistribution
                  frequencies={analysisData.digitFrequencies || []}
                  currentDigit={marketData.length > 0 ? marketData[marketData.length - 1] : null}
                  theme={theme}
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div
                  className={`p-3 sm:p-4 md:p-6 rounded-xl border ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-purple-500/20"
                      : "bg-white border-gray-200 shadow-sm"
                  }`}
                >
                  <h3
                    className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    Digit Frequency Chart
                  </h3>
                  <LastDigitsChart digits={recentDigits} theme={theme} />
                </div>
                <div
                  className={`p-3 sm:p-4 md:p-6 rounded-xl border ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-cyan-500/20"
                      : "bg-white border-gray-200 shadow-sm"
                  }`}
                >
                  <h3
                    className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    Digit Timeline
                  </h3>
                  <LastDigitsLineChart digits={recent40Digits} theme={theme} />
                </div>
              </div>

              {/* Statistical Analysis */}
              <StatisticalAnalysis analysis={analysisData} recentDigits={recent50Digits} theme={theme} />
            </div>
          </TabsContent>

          <TabsContent value="signals" className="mt-0">
            <SignalsTab signals={analysisData.signals} theme={theme} />
          </TabsContent>

          <TabsContent value="pro-signals" className="mt-0">
            <ProSignalsTab signals={analysisData.proSignals} theme={theme} />
          </TabsContent>

          <TabsContent value="super-signals" className="mt-0">
            {/* SuperSignalsTab doesn't accept props, it manages its own state */}
            <SuperSignalsTab />
          </TabsContent>

          <TabsContent value="even-odd" className="mt-0">
            <EvenOddTab analysis={analysisData} recentDigits={recent50Digits} theme={theme} />
          </TabsContent>

          <TabsContent value="over-under" className="mt-0">
            <OverUnderTab analysis={analysisData} recentDigits={recent50Digits} theme={theme} />
          </TabsContent>

          <TabsContent value="advanced-over-under" className="mt-0">
            <AdvancedOverUnderTab theme={theme} recentDigits={recent100Digits} />
          </TabsContent>

          <TabsContent value="matches" className="mt-0">
            <MatchesTab analysis={analysisData} recentDigits={recentDigits} theme={theme} />
          </TabsContent>

          <TabsContent value="differs" className="mt-0">
            <DiffersTab analysis={analysisData} recentDigits={recentDigits} theme={theme} />
          </TabsContent>

          <TabsContent value="rise-fall" className="mt-0">
            <RiseFallTab analysis={analysisData} theme={theme} />
          </TabsContent>

          <TabsContent value="ai-analysis" className="mt-0">
            <AIAnalysisTab recentDigits={recent100Digits} theme={theme} />
          </TabsContent>

          <TabsContent value="autobot" className="mt-0">
            <AutoBotTab
              theme={theme}
              symbol={selectedSymbol}
              currentDigit={marketData.length > 0 ? marketData[marketData.length - 1] : null}
              currentPrice={currentPrice}
            />
          </TabsContent>

          <TabsContent value="automated" className="mt-0">
            <AutomatedTab
              theme={theme}
              symbol={selectedSymbol}
              currentDigit={marketData.length > 0 ? marketData[marketData.length - 1] : null}
              currentPrice={currentPrice}
            />
          </TabsContent>

          <TabsContent value="slider">
            <div className="p-3 sm:p-4 md:p-6">
              <div className="flex justify-end mb-4">
                <Button
                  onClick={() => setIsSliderOpen(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Open Trading Bot
                </Button>
              </div>
              {/* Inline Trading Bot with all parameters */}
              <TradingBotSlider dashboardSymbol={selectedSymbol} dashboardPrice={currentPrice} dashboardDigit={null} />
            </div>
          </TabsContent>

          <TabsContent value="trading-view" className="mt-0">
            <TradingViewTab symbol={selectedSymbol} theme={theme} />
          </TabsContent>

          <TabsContent value="trade-now" className="mt-0">
            <TradeNowTab
              theme={theme}
              symbol={selectedSymbol}
              currentPrice={currentPrice}
              currentDigit={marketData.length > 0 ? marketData[marketData.length - 1] : null}
            />
          </TabsContent>

          <TabsContent value="smartauto24" className="mt-0">
            <SmartAuto24Tab theme={theme} symbol={selectedSymbol} recentDigits={recent100Digits} />
          </TabsContent>

          <TabsContent value="tools-info" className="mt-0">
            <ToolsInfoTab theme={theme} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
