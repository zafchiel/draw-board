import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useContext } from "react";
import { ThemeProviderContext } from "@/providers/theme-provider";
import { LayerType, type Layer } from "./types";

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
  const dx = x - layer.x + layer.width / 2;
  const dy = y - layer.y + layer.height / 2;
  return x >= layer.x && x <= layer.x + layer.width && y >= layer.y && y <= layer.y + layer.height;
  
  switch(layer.type) {
    case LayerType.Rectangle:
      return x >= layer.x && x <= layer.x + layer.width && y >= layer.y && y <= layer.y + layer.height;
    case LayerType.Ellipse:
      return dx ** 2 + dy ** 2 <= (layer.width / 2) ** 2;
    default:
      return false;
  }
}

export function pointsToSvgPathWithHandDrawnEffect(points: number[][]) {
  const path = points.reduce((path, point, index) => {
    const [x, y] = point;
    return path + (index === 0 ? `M${x},${y}` : ` L${x},${y}`);
  }, '');
  
  return path;
}

export function getBoundingBox(points: number[][]) {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}