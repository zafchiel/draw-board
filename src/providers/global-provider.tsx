import { ThemeProvider } from "./theme-provider";
import { CanvasStateContextProvider } from "./canvas-state-provider";

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" localStorageKey="board-theme">
      <CanvasStateContextProvider>
        {children}
      </CanvasStateContextProvider>
    </ThemeProvider>
  );
}
