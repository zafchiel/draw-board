import { CanvasStateContext } from "@/providers/canvas-state-provider";
import { useContext } from "react";
import { Button } from "./button";
import { Camera } from "lucide-react";
import { Hint } from "./hint";

export function ResetCamera() {
  const { setCanvasState } = useContext(CanvasStateContext);

  return (
    <Hint name="Reset Camera" side="left">
      <Button
        variant="outline"
        onClick={() =>
          setCanvasState((prev) => ({ ...prev, cameraX: 0, cameraY: 0 }))
        }
        className="fixed z-10 bottom-16 right-3"
      >
        <Camera />
        <span className="sr-only">Reset Camera</span>
      </Button>
    </Hint>
  );
}
