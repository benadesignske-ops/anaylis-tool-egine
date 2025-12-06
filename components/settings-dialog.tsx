"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SettingsPanel } from "@/components/settings-panel"
import { MarketSelector } from "@/components/market-selector"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Label } from "@/components/ui/label"

interface SettingsDialogProps {
  symbols: Array<{ display_name: string; symbol: string }>
  currentSymbol: string
  onSymbolChange: (symbol: string) => void
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
}

export function SettingsDialog({ symbols, currentSymbol, onSymbolChange, theme, setTheme }: SettingsDialogProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-white/10">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Open settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto bg-[#0a0e27]/95 border-blue-500/20 backdrop-blur-md">
        <SheetHeader>
          <SheetTitle className="text-white">Settings</SheetTitle>
          <SheetDescription>Configure your trading preferences and appearance</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {/* Market Selection */}
          <div className="space-y-2">
            <Label className="text-white text-sm font-medium">Market Symbol</Label>
            {symbols.length > 0 ? (
              <MarketSelector
                symbols={symbols}
                currentSymbol={currentSymbol}
                onSymbolChange={onSymbolChange}
                theme={theme}
              />
            ) : (
              <div className="text-yellow-400 text-sm">Loading symbols...</div>
            )}
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <Label className="text-white text-sm font-medium">Theme</Label>
            <div className="flex items-center gap-2">
              <ThemeSwitcher theme={theme} setTheme={setTheme} />
              <span className="text-sm text-gray-400 capitalize">{theme} mode</span>
            </div>
          </div>

          {/* Other Settings */}
          <SettingsPanel />
        </div>
      </SheetContent>
    </Sheet>
  )
}
