import { Circle, Hand, MousePointer2, Square } from "lucide-react";
import { ToolbarButton } from "./toolbar-button";
import { useContext } from "react";
import { CanvasStateContext } from "@/providers/canvas-state-provider";
import { CanvasMode, LayerType } from "@/lib/types";

export function Toolbar() {
  const { canvasState, setCanvasState } = useContext(CanvasStateContext);
  return (
    <section className="fixed top-3 left-1/2 -translate-x-1/2 flex gap-2 p-1 border rounded-sm">
      <ToolbarButton
        name="Move"
        selected={canvasState.mode === CanvasMode.Moving}
        onClick={() => {
          setCanvasState({
            ...canvasState,
            mode: CanvasMode.Moving,
            selectedLayerType: null,
          });
        }}
      >
        <Hand size={18} />
      </ToolbarButton>
      <ToolbarButton
        name="Select"
        selected={canvasState.mode === CanvasMode.Selecting}
        onClick={() => {
          setCanvasState({
            ...canvasState,
            mode: CanvasMode.Selecting,
            selectedLayerType: null,
          });
        }}
      >
        <MousePointer2 size={18} />
      </ToolbarButton>
      <ToolbarButton
        name="Rectangle"
        selected={canvasState.selectedLayerType === LayerType.Rectangle}
        onClick={() => {
          setCanvasState({
            ...canvasState,
            mode: CanvasMode.None,
            selectedLayerType: LayerType.Rectangle,
          });
        }}
      >
        <Square size={18} />
      </ToolbarButton>
      <ToolbarButton
        name="Ellipse"
        selected={canvasState.selectedLayerType === LayerType.Ellipse}
        onClick={() => {
          setCanvasState({
            ...canvasState,
            mode: CanvasMode.None,
            selectedLayerType: LayerType.Ellipse,
          });
        }}
      >
        <Circle size={18} />
      </ToolbarButton>
    </section>
  );
}
