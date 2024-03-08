import { CanvasStateContext } from "@/providers/canvas-state-provider";
import { useContext } from "react";
import { Button } from "./button";
import { Trash2 } from "lucide-react";
import { Hint } from "./hint";

export function ClearCanvas() {
    const { setLayers } = useContext(CanvasStateContext);

    return (
        <Hint name="Clear Canvas" side="left">
        <Button name="Clear Canvas" variant="outline" onClick={() => setLayers([])} className="fixed z-10 bottom-3 right-3">
            <Trash2 />
            <span className="sr-only">Clear Canvas</span>
        </Button>

        </Hint>
    )
}