import {
  ALargeSmall,
  Circle,
  Hand,
  Minus,
  MousePointer2,
  MoveRight,
  Pencil,
  Square,
} from "lucide-react";
import { ToolbarButton } from "../ui/toolbar-button";
import { useContext } from "react";
import { CanvasStateContext } from "@/providers/canvas-state-provider";
import { CanvasMode, LayerType } from "@/lib/types";

export function Toolbar() {
  const { canvasState, setCanvasState } = useContext(CanvasStateContext);
  return (
    <section className="fixed z-10 top-3 left-1/2 -translate-x-1/2 flex gap-2 p-1.5 border rounded-sm bg-background">
      <ToolbarButton
        name="Move"
        selected={
          (canvasState.mode === CanvasMode.None &&
            canvasState.selectedLayerType === null) ||
          canvasState.mode === CanvasMode.Panning
        }
        onClick={() => {
          setCanvasState({
            ...canvasState,
            mode: CanvasMode.None,
            selectedLayerType: null,
          });
        }}
      >
        <Hand size={18} />
      </ToolbarButton>

      <ToolbarButton
        name="Text"
        selected={canvasState.selectedLayerType === LayerType.Text}
        onClick={() => {
          setCanvasState({
            ...canvasState,
            mode: CanvasMode.None,
            selectedLayerType: LayerType.Text,
          });
        }}
      >
        <ALargeSmall size={18} />
      </ToolbarButton>

      <ToolbarButton
        name="Select"
        selected={canvasState.mode === CanvasMode.Selecting || canvasState.mode === CanvasMode.Resizing}
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
        name="Pencil"
        selected={canvasState.mode === CanvasMode.Pencil}
        onClick={() => {
          setCanvasState({
            ...canvasState,
            mode: CanvasMode.Pencil,
            selectedLayerType: LayerType.Path,
          });
        }}
      >
        <Pencil size={18} />
      </ToolbarButton>

      <ToolbarButton
        name="Arrow"
        selected={canvasState.selectedLayerType === LayerType.Arrow}
        onClick={() => {
          setCanvasState({
            ...canvasState,
            mode: CanvasMode.None,
            selectedLayerType: LayerType.Arrow,
          });
        }}
      >
        <MoveRight size={18} />
      </ToolbarButton>

      <ToolbarButton
        name="Line"
        selected={canvasState.selectedLayerType === LayerType.Line}
        onClick={() => {
          setCanvasState({
            ...canvasState,
            mode: CanvasMode.None,
            selectedLayerType: LayerType.Line,
          });
        }}
      >
        <Minus size={18} />
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
