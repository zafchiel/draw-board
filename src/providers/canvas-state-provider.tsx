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
    },
    mouseX: 0,
    mouseY: 0,
}

const initContextValue = {
    canvasState: initCanvasState,
    updateState: (newState: CanvasState) => {}
}

export const CanvasStateContext = createContext(initContextValue)

export function CanvasStateProvider({ children }: CanvasStateProviderProps) {
    const [canvasState, setCanvasState] = useLocalStorage<CanvasState>("canvas-state", initCanvasState)

    const updateState = (newState: CanvasState) => {
        setCanvasState(newState)
    }

    const contextValue = {
        canvasState,
        updateState
    }
    
    return (
        <CanvasStateContext.Provider value={contextValue}>
            {children}
        </CanvasStateContext.Provider>
    )
}