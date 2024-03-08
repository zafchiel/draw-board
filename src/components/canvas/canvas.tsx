import { draw, reDraw } from "@/lib/drawings";
import { CanvasMode, LayerType } from "@/lib/types";
import { isPointInLayer, useTheme } from "@/lib/utils";
import { CanvasStateContext } from "@/providers/canvas-state-provider";
import { useContext, useEffect, useRef } from "react";

// import rough from "roughjs";
// const gen = rough.generator();

export function Canvas() {
  const { canvasState, setCanvasState, layers, setLayers } = useContext(CanvasStateContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  // Paint canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    reDraw({
      cameraX: canvasState.cameraX,
      cameraY: canvasState.cameraY,
      canvas: canvasRef.current,
      layers,
      stroke: canvasState.currentStrokeColor,
    });
  }, [layers, canvasState.currentStrokeColor, canvasState.cameraX, canvasState.cameraY])

  // Change layers color when theme changes
  useEffect(() => {
    if(theme === "light") {
      setCanvasState({
        ...canvasState,
        currentStrokeColor: "black",
      })
    } else if (theme === "dark") {
      setCanvasState({
        ...canvasState,
        currentStrokeColor: "white",
      })
    }
  }, [theme, canvasState, setCanvasState])

  const onPointerDown = (event: React.MouseEvent) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const currentX = event.pageX;
    const currentY = event.pageY;

    // Activate panning mode
    if (canvasState.mode === CanvasMode.None && canvasState.selectedLayerType === null) {
      setCanvasState({
        ...canvasState,
        mode: CanvasMode.Panning,
        originX: currentX,
        originY: currentY,
      })
      return;
    }

    // Select one layer
    if (canvasState.mode === CanvasMode.Selecting) {
      const selectedLayerIndex = layers.findLastIndex((layer) => isPointInLayer(currentX - canvasState.cameraX, currentY - canvasState.cameraY, layer));
      if(selectedLayerIndex !== -1) {
        setCanvasState({
          ...canvasState,
          currentLayer: layers[selectedLayerIndex],
        });
        setLayers(layers.map((layer, index) => {
          if(index === selectedLayerIndex) {
            return {
              ...layer,
              isActive: true,
            }
          } else {
            return {
              ...layer,
              isActive: false,
            }
          }
        }))
      } else {
        setCanvasState({
          ...canvasState,
          currentLayer: null,
        });
        setLayers(layers.map((layer) => {
          return {
            ...layer,
            isActive: false,
          }
        }))
      }

    } 
    // Activate inserting new layer mode
    else if (canvasState.selectedLayerType === "rectangle" || canvasState.selectedLayerType === "ellipse") {
      setCanvasState({
        ...canvasState,
        mode: CanvasMode.Inserting,
        originX: currentX,
        originY: currentY,
      });
    }
  };

  const onPointerMove = (event: React.MouseEvent) => {

    // Panning the canvas
    if (canvasState.mode === CanvasMode.Panning) {
      const moveX = event.pageX - canvasState.originX;
      const moveY = event.pageY - canvasState.originY;
      setCanvasState((prevCanvasState) => {
        return {
          ...prevCanvasState,
          cameraX: prevCanvasState.cameraX + moveX,
          cameraY: prevCanvasState.cameraY + moveY,
          originX: event.pageX, // Update the origin to the current pointer position
          originY: event.pageY, // Update the origin to the current pointer position
        }
      })
    }
    
    // Drawing the preview layer
    if (canvasState.mode === CanvasMode.Inserting) {
      if (canvasState.selectedLayerType === LayerType.Rectangle) {
        const tempCanvas = tempCanvasRef.current;
        if (!tempCanvas) return;

        const ctx = tempCanvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height); // Clear the temporary canvas

        const width = event.pageX - canvasState.originX;
        const height = event.pageY - canvasState.originY;

        // Draw preview rectangle
        draw({
          x: canvasState.originX,
          y: canvasState.originY,
          width,
          height,
          stroke: theme === "light" ? "black" : "white",
          fill: "transparent",
          canvas: tempCanvas,
          type: LayerType.Rectangle
        });
      }

      if (canvasState.selectedLayerType === LayerType.Ellipse) {
        const tempCanvas = tempCanvasRef.current;
        if (!tempCanvas) return;

        const ctx = tempCanvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height); // Clear the temporary canvas

        const width = event.pageX - canvasState.originX;
        const height = event.pageY - canvasState.originY;

        // Draw preview ellipse
        draw({
          x: canvasState.originX,
          y: canvasState.originY,
          width,
          height,
          stroke: theme === "light" ? "black" : "white",
          fill: "transparent",
          canvas: tempCanvas,
          type: LayerType.Ellipse
        });
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


    if(canvasState.mode === CanvasMode.Panning) {
      setCanvasState({
        ...canvasState,
        mode: CanvasMode.None,
      })
      return;
    }
    

    // Clear the temporary canvas
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Add final preview layer to the layers
    if(canvasState.selectedLayerType !== null) {
      setLayers([...layers, {
        id: (Math.random()).toString(16),
        type: canvasState.selectedLayerType,
        fill: canvasState.currentFillColor,
        stroke: canvasState.currentStrokeColor,
        x: canvasState.originX - canvasState.cameraX,
        y: canvasState.originY - canvasState.cameraY,
        width: event.pageX - canvasState.originX,
        height: event.pageY - canvasState.originY,
        isActive: false,
      }])
    }
    
    setCanvasState({
      ...canvasState,
      mode: CanvasMode.Selecting,
      selectedLayerType: null
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
