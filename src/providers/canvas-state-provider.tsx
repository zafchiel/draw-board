import { createContext } from "react";
import { CanvasState, CanvasMode } from "@/lib/types";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";

type CanvasStateProviderProps = {
    children: React.ReactNode;
}

const initCanvasState: CanvasState = {
    mode: CanvasMode.Selecting,
    currentLayer: null,
    currentFillColor: {
         h: 0, s: 0, l: 0, a: 0
    },
    currentStrokeColor: {
        h: 0, s: 0, l: 100, a: 1
    },
    currentX: 0,
    currentY: 0,
    originX: 0,
    originY: 0,
    selectedLayerType: null
}

const initContextValue = {
    canvasState: initCanvasState,
    updateState: (newState: CanvasState) => {}
}

export const CanvasStateContext = createContext(initContextValue)

export function CanvasStateContextProvider({ children }: CanvasStateProviderProps) {
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