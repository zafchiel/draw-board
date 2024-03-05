import { ThemeProvider } from "./theme-provider";

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider localStorageKey="themeKey">
      {children}
    </ThemeProvider>
  )
}