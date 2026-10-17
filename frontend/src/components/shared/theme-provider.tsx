import {
  useEffect,
  useState,
  type ReactNode,
} from "react"
import {
  ThemeProviderContext,
  type Theme,
} from "@/components/shared/theme-context"

type ThemeProviderProps = {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

function isTheme(value: string | null): value is Theme {
  return value === "dark" || value === "light" || value === "system"
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const storedTheme = window.localStorage.getItem(storageKey)
    return isTheme(storedTheme) ? storedTheme : defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")

    const applyTheme = () => {
      root.classList.remove("light", "dark")

      const activeTheme =
        theme === "system" ? (systemTheme.matches ? "dark" : "light") : theme

      root.classList.add(activeTheme)
    }

    applyTheme()

    if (theme !== "system") return

    systemTheme.addEventListener("change", applyTheme)
    return () => systemTheme.removeEventListener("change", applyTheme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      window.localStorage.setItem(storageKey, theme)
      setThemeState(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}