"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ThemeSwitcherProps {
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
}

export function ThemeSwitcher({ theme, setTheme }: ThemeSwitcherProps) {
  return (
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-lg hover:bg-slate-800/50"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon className="h-5 w-5 text-gray-600" /> : <Sun className="h-5 w-5 text-yellow-400" />}
    </Button>
  )
}
