import { CanvasStateContext } from "@/providers/canvas-state-provider";
import { useContext } from "react";
import { Button } from "./button";
import { Camera } from "lucide-react";

export function ResetCamera() {
    const { setCanvasState } = useContext(CanvasStateContext);

    return (
        <Button variant="outline" onClick={() => setCanvasState(prev => ({...prev, cameraX: 0, cameraY: 0}))} className="fixed z-10 bottom-3 left-3">
            <Camera />
            <span className="sr-only">Reset Camera</span>
        </Button>
    )
}