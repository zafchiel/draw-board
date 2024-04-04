import { Layer } from "@/lib/types";
import { createContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  localStorageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => {},
};

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initState);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  localStorageKey = "draw-board-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(localStorageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const documentElement = window.document.documentElement;

    documentElement.classList.remove("light", "dark");

    // if (theme === "system") {
    //     const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    //         ? "dark"
    //         : "light";

    //     documentElement.classList.add(systemTheme);
    //     return;
    // }

    documentElement.classList.add(theme);

    const layers = localStorage.getItem("layers");
    if (layers) {
        console.log("change layers")
      const layersArray: Layer[] = JSON.parse(layers);
      localStorage.setItem(
        "layers",
        JSON.stringify(
          layersArray.map((e) => ({
            ...e,
            stroke: theme === "dark" ? "white" : "black",
          }))
        )
      );
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(localStorageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
