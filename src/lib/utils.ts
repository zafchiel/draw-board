import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useContext } from "react";
import { ThemeProviderContext } from "@/providers/theme-provider";
import { type Layer } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useTheme() {
  const themeContext = useContext(ThemeProviderContext);

  if(themeContext === undefined) {
      throw new Error("useTheme must be used within a ThemeProvider");
  }

  return themeContext;
}

export function isPointInLayer(x: number, y: number, layer: Layer): boolean {
  return x >= layer.x && x <= layer.x + layer.width && y >= layer.y && y <= layer.y + layer.height;
}