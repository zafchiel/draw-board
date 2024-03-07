import { createContext, ReactNode, Dispatch, SetStateAction } from "react";
import { CanvasState, CanvasMode, Layer } from "@/lib/types";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";

type CanvasStateProviderProps = {
    children: ReactNode;
}

type ContextValue = {
    canvasState: CanvasState;
    layers: Layer[];
    setCanvasState: Dispatch<SetStateAction<CanvasState>>;
    setLayers: Dispatch<SetStateAction<Layer[]>>;
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
    currentX: 0,
    currentY: 0,
    originX: 0,
    originY: 0,
    selectedLayerType: null
}

const initContextValue: ContextValue = {
    canvasState: initCanvasState,
    layers: [],
    setCanvasState: () => {},
    setLayers: () => {},
}

export const CanvasStateContext = createContext<ContextValue>(initContextValue)

export function CanvasStateContextProvider({ children }: CanvasStateProviderProps) {
    const [canvasState, setCanvasState] = useLocalStorage<CanvasState>("canvas-state", initCanvasState)
    const [layers, setLayers] = useLocalStorage<Layer[]>("layers", [])

    const contextValue = {
        canvasState,
        layers,
        setCanvasState,
        setLayers
    }
    
    return (
        <CanvasStateContext.Provider value={contextValue}>
            {children}
        </CanvasStateContext.Provider>
    )
}