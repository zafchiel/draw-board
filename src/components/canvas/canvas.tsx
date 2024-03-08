import { draw, reDraw } from "@/lib/drawings";
import { CanvasMode, LayerType } from "@/lib/types";
import { CanvasStateContext } from "@/providers/canvas-state-provider";
import { useContext, useEffect, useRef } from "react";
import rough from "roughjs";

const gen = rough.generator();

export function Canvas() {
  const { canvasState, setCanvasState, layers, setLayers } = useContext(CanvasStateContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement>(null);

  // Resize canvas on window resize
  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   const resizeCanvas = () => {
  //     canvas.width = window.innerWidth;
  //     canvas.height = window.innerHeight;
  //   }

  //   window.addEventListener("resize", resizeCanvas);

  //   return () => {
  //     window.removeEventListener("resize", resizeCanvas);
  //   }
  // }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    reDraw(layers, canvasRef.current);
  }, [layers])

  const onPointerDown = (event: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const startingX = event.pageX;
    const startingY = event.pageY;

    if (canvasState.selectedLayerType === "rectangle" || canvasState.selectedLayerType === "ellipse") {
      setCanvasState({
        ...canvasState,
        mode: CanvasMode.Inserting,
        originX: startingX,
        originY: startingY,
      });
    }
  };

  const onPointerMove = (event: React.MouseEvent) => {
    if (canvasState.mode === CanvasMode.Inserting) {
      if (canvasState.selectedLayerType === LayerType.Rectangle) {
        const tempCanvas = tempCanvasRef.current;
        if (!tempCanvas) return;

        const ctx = tempCanvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height); // Clear the temporary canvas

        const width = event.pageX - canvasState.originX;
        const height = event.pageY - canvasState.originY;

        draw(
          canvasState.originX,
          canvasState.originY,
          width,
          height,
          "black",
          "transparent",
          tempCanvas,
          LayerType.Rectangle
        )
      }

      if (canvasState.selectedLayerType === LayerType.Ellipse) {
        const tempCanvas = tempCanvasRef.current;
        if (!tempCanvas) return;

        const ctx = tempCanvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height); // Clear the temporary canvas

        const width = event.pageX - canvasState.originX;
        const height = event.pageY - canvasState.originY;

        draw(
          canvasState.originX,
          canvasState.originY,
          width,
          height,
          "black",
          "transparent",
          tempCanvas,
          LayerType.Ellipse
        )
      }
    }
  };

  const onPointerUp = (event: React.MouseEvent) => {
    const canvas = canvasRef.current;
    const tempCanvas = tempCanvasRef.current;
    if (!canvas || !tempCanvas) return;

    const ctx = canvas.getContext("2d");
    const tempCtx = tempCanvas.getContext("2d");
    if (!ctx || !tempCtx) return;

    // Draw the final rectangle on the main canvas
    ctx.drawImage(tempCanvas, 0, 0);

    // Clear the temporary canvas
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

    setLayers([...layers, {
      id: (Math.random()).toString(16),
      type: canvasState.selectedLayerType!,
      fill: canvasState.currentFillColor,
      stroke: canvasState.currentStrokeColor,
      x: canvasState.originX,
      y: canvasState.originY,
      width: event.pageX - canvasState.originX,
      height: event.pageY - canvasState.originY,
    }])
    
    setCanvasState({
      ...canvasState,
      mode: CanvasMode.None,
    });
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
      {/* Canvas for preview layer */}
      <canvas
        ref={tempCanvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none"}}
      />
    </>
  );
}
