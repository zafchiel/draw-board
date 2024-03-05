import { ThemeProvider } from "./theme-provider";

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" localStorageKey="vite-theme">
      {children}
    </ThemeProvider>
  )
}