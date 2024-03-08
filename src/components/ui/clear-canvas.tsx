import { CanvasStateContext } from "@/providers/canvas-state-provider";
import { useContext } from "react";
import { Button } from "./button";
import { Trash2 } from "lucide-react";

export function ClearCanvas() {
    const { setLayers } = useContext(CanvasStateContext);

    return (
        <Button variant="outline" onClick={() => setLayers([])} className="fixed z-10 bottom-3 right-3">
            <Trash2 />
            <span className="sr-only">Clear Canvas</span>
        </Button>
    )
}