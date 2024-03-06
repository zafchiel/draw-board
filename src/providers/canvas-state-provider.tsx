import { createContext, useState, useEffect } from "react";
import { CanvasState, CanvasMode } from "@/lib/types";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";

type CanvasStateProviderProps = {
    children: React.ReactNode;
}

const initCanvasState: CanvasState = {
    mode: CanvasMode.None,
    currentLayer: null,
    currentFillColor: {
         h: 0, s: 0, l: 0, a: 0
    },
    currentStrokeColor: {
        h: 0, s: 0, l: 100, a: 1
    }
}

export const CanvasStateContext = createContext<CanvasState>(initCanvasState)

export function CanvasStateProvider({ children }: CanvasStateProviderProps) {
    const [canvasState, setCanvasState] = useLocalStorage<CanvasState>("canvas-state", initCanvasState)

    const contextValue = canvasState
    
    return (
        <CanvasStateContext.Provider value={contextValue}>
            {children}
        </CanvasStateContext.Provider>
    )
}