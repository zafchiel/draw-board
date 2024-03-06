import { Circle, Hand, MousePointer2, Square } from "lucide-react";
import { ToolbarButton } from "./toolbar-button";
import { useContext } from "react";
import { CanvasStateContext } from "@/providers/canvas-state-provider";
import { CanvasMode } from "@/lib/types";

export function Toolbar() {
  const canvasContext = useContext(CanvasStateContext);
  return (
    <section className="fixed top-3 left-1/2 -translate-x-1/2 flex gap-2 p-1 border rounded-sm">
      <ToolbarButton name="Move" onClick={() => {
        canvasContext.updateState({
          ...canvasContext.canvasState,
          mode: CanvasMode.None
        });
      }}>
        <Hand size={18} />
      </ToolbarButton>
      <ToolbarButton name="Select" onClick={() => {
        canvasContext.updateState({
          ...canvasContext.canvasState,
          mode: CanvasMode.Pressing
        });
      }}>
        <MousePointer2 size={18} />
      </ToolbarButton>
      <ToolbarButton name="Rectangle" onClick={() => {
        canvasContext.updateState({
          ...canvasContext.canvasState,
          mode: CanvasMode.Inserting
        });
      }}>
        <Square size={18} />
      </ToolbarButton>
      <ToolbarButton name="Ellipse" onClick={() => {}}>
        <Circle size={18} />
      </ToolbarButton>
    </section>
  );
}