import { draw, reDraw } from "@/lib/drawings";
import { CanvasMode } from "@/lib/types";
import {
  checkIfMouseOverResizeHandlers,
  getBoundingBox,
  isPointInLayer,
  resizeBounds,
  useTheme,
} from "@/lib/utils";
import { CanvasStateContext } from "@/providers/canvas-state-provider";
import { useContext, useEffect, useRef, useState } from "react";

export function Canvas() {
  const { canvasState, setCanvasState, layers, setLayers } =
    useContext(CanvasStateContext);
  const [pathPoints, setPathPoints] = useState<number[][] | null>(null);
  const [isDrawingPath, setIsDrawingPath] = useState(false);
  const [resizingCorner, setResizingCorner] = useState<string | null>(null);

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
  }, [
    layers,
    canvasState.currentStrokeColor,
    canvasState.cameraX,
    canvasState.cameraY,
    window.innerWidth,
    window.innerHeight,
  ]);

  // Change layers color when theme changes
  useEffect(() => {
    if (theme === "light") {
      setCanvasState({
        ...canvasState,
        currentStrokeColor: "black",
      });
    } else if (theme === "dark") {
      setCanvasState({
        ...canvasState,
        currentStrokeColor: "white",
      });
    }
  }, [theme, canvasState, setCanvasState]);

  const onPointerDown = (event: React.MouseEvent) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const currentX = event.pageX;
    const currentY = event.pageY;

    if (canvasState.mode === CanvasMode.Pencil) {
      setCanvasState({
        ...canvasState,
        originX: currentX,
        originY: currentY,
      });

      setIsDrawingPath(true);
      const tempCanvas = tempCanvasRef.current;
      if (!tempCanvas) return;
      const tempCanvasCtx = tempCanvas.getContext("2d");
      if (!tempCanvasCtx) return;

      setPathPoints([[currentX, currentY]]);

      tempCanvasCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCanvasCtx.lineCap = "round";
      tempCanvasCtx.strokeStyle = theme === "light" ? "black" : "white";
      tempCanvasCtx.lineWidth = 2;
      tempCanvasCtx.beginPath();
      return;
    }

    // Activate panning mode
    if (
      canvasState.mode === CanvasMode.None &&
      canvasState.selectedLayerType === null
    ) {
      setCanvasState({
        ...canvasState,
        mode: CanvasMode.Panning,
        originX: currentX,
        originY: currentY,
      });
      return;
    }

    // Select one layer
    if (canvasState.mode === CanvasMode.Selecting) {
      const selectedLayerIndex = layers.findLastIndex((layer) =>
        isPointInLayer(
          currentX - canvasState.cameraX,
          currentY - canvasState.cameraY,
          layer
        )
      );
      if (selectedLayerIndex !== -1) {
        // Check if mouse is over resizing handlers
        const selectedLayer = layers[selectedLayerIndex];
        const clickedCorner = checkIfMouseOverResizeHandlers(
          currentX - canvasState.cameraX,
          currentY - canvasState.cameraY,
          selectedLayer
        );
        if (clickedCorner === "bottomRight") {
          setCanvasState({
            ...canvasState,
            mode: CanvasMode.Resizing,
            currentLayer: selectedLayer,
            originX: currentX,
            originY: currentY,
          });
          setResizingCorner(clickedCorner);
          return;
        }

        // Move layer
        setCanvasState({
          ...canvasState,
          mode: CanvasMode.Moving,
          currentLayer: selectedLayer,
          originX: currentX,
          originY: currentY,
        });

        // Repaint active layer
        setLayers(
          layers.map((layer, index) => {
            if (index === selectedLayerIndex) {
              return {
                ...layer,
                isActive: true,
              };
            } else {
              return {
                ...layer,
                isActive: false,
              };
            }
          })
        );
      } else {
        setCanvasState({
          ...canvasState,
          currentLayer: null,
        });
        setLayers(
          layers.map((layer) => {
            return {
              ...layer,
              isActive: false,
            };
          })
        );
      }
    }
    // Activate inserting new layer mode
    else if (
      canvasState.selectedLayerType === "rectangle" ||
      canvasState.selectedLayerType === "ellipse" ||
      canvasState.selectedLayerType === "line"
    ) {
      setCanvasState({
        ...canvasState,
        mode: CanvasMode.Inserting,
        originX: currentX,
        originY: currentY,
      });
    }
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (canvasState.mode === CanvasMode.Resizing && resizingCorner !== null) {
      // Resize the layer
      const currentX = event.pageX;
      const currentY = event.pageY;
      const selectedLayer = canvasState.currentLayer;
      if (!selectedLayer) return;

      // const tempCanvas = tempCanvasRef.current;
      // if (!tempCanvas) return;
      // const tempCanvasCtx = tempCanvas.getContext("2d");
      // if (!tempCanvasCtx) return;

      // tempCanvasCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height); // Clear the temporary canvas

      // const moveX = currentX - canvasState.originX;
      // const moveY = currentY - canvasState.originY;

      const newBounds = resizeBounds(
        selectedLayer,
        resizingCorner,
        currentX - canvasState.cameraX,
        currentY - canvasState.cameraY
      );
      // console.log(newBounds)
      // console.log(moveX, moveY)
        setLayers(
          layers.map((layer) => {
            if (layer.id === selectedLayer.id) {
              return {
                ...layer,
                x: newBounds.x,
                y: newBounds.y,
                width: newBounds.width,
                height: newBounds.height,
              };
            } else {
              return layer;
            }
          })
        );

      setCanvasState({
        ...canvasState,
        originX: currentX,
        originY: currentY,
      });
    }

    if (canvasState.mode === CanvasMode.Moving) {
      const moveX = event.pageX - canvasState.originX;
      const moveY = event.pageY - canvasState.originY;
      const selectedLayerId = canvasState.currentLayer?.id;

      if (!selectedLayerId) return;

      setLayers(
        layers.map((layer) => {
          if (layer.id === selectedLayerId) {
            if (layer.points) {
              const movedPoints = layer.points.map(([x, y]) => [
                x + moveX,
                y + moveY,
              ]);
              return {
                ...layer,
                x: layer.x + moveX,
                y: layer.y + moveY,
                points: movedPoints,
              };
            } else {
              return {
                ...layer,
                x: layer.x + moveX,
                y: layer.y + moveY,
              };
            }
          } else {
            return layer;
          }
        })
      );
      setCanvasState({
        ...canvasState,
        originX: event.pageX,
        originY: event.pageY,
      });
    }

    if (isDrawingPath) {
      const tempCanvasCtx = tempCanvasRef.current?.getContext("2d");
      if (!tempCanvasCtx) return;
      setPathPoints((state) => [...state!, [event.pageX, event.pageY]]);
      tempCanvasCtx.lineTo(event.pageX, event.pageY);
      tempCanvasCtx.stroke();
      return;
    }

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
        };
      });
    }

    // Drawing the preview layer
    if (
      canvasState.mode === CanvasMode.Inserting &&
      canvasState.selectedLayerType !== null
    ) {
      const tempCanvas = tempCanvasRef.current;
      if (!tempCanvas) return;

      const ctx = tempCanvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height); // Clear the temporary canvas

      const width = event.pageX - canvasState.originX;
      const height = event.pageY - canvasState.originY;

      draw({
        x: canvasState.originX,
        y: canvasState.originY,
        width,
        height,
        stroke: theme === "light" ? "black" : "white",
        fill: "transparent",
        canvas: tempCanvas,
        points: null,
        type: canvasState.selectedLayerType,
      });
    }
  };

  const onPointerUp = (event: React.PointerEvent) => {
    const canvas = canvasRef.current;
    const tempCanvas = tempCanvasRef.current;
    if (!canvas || !tempCanvas) return;

    const ctx = canvas.getContext("2d");
    const tempCtx = tempCanvas.getContext("2d");
    if (!ctx || !tempCtx) return;

    if (canvasState.mode === CanvasMode.Resizing && resizingCorner !== null) {
      setResizingCorner(null);
      setCanvasState({
        ...canvasState,
        mode: CanvasMode.Selecting,
      });
      return;
    }

    if (canvasState.mode === CanvasMode.Moving) {
      setCanvasState({
        ...canvasState,
        mode: CanvasMode.Selecting,
      });
      return;
    }

    if (canvasState.mode === CanvasMode.Panning) {
      setCanvasState({
        ...canvasState,
        mode: CanvasMode.None,
      });
      return;
    }

    // Clear the temporary canvas
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

    if (canvasState.selectedLayerType == null) return;

    // Reset drawing path
    if (isDrawingPath && pathPoints !== null) {
      const boundingBox = getBoundingBox(pathPoints);

      const cameraMovedPoints = pathPoints.map(([x, y]) => [
        x - canvasState.cameraX,
        y - canvasState.cameraY,
      ]);

      // Add drawing path to the layers
      setLayers([
        ...layers,
        {
          id: crypto.randomUUID(),
          type: canvasState.selectedLayerType,
          fill: canvasState.currentFillColor,
          stroke: canvasState.currentStrokeColor,
          x: boundingBox.x - canvasState.cameraX,
          y: boundingBox.y - canvasState.cameraY,
          width: boundingBox.width,
          height: boundingBox.height,
          isActive: false,
          points: cameraMovedPoints,
        },
      ]);

      setIsDrawingPath(false);
      setPathPoints(null);
      return;
    } else {
      // Add final preview layer to the layers
      setLayers([
        ...layers,
        {
          id: crypto.randomUUID(),
          type: canvasState.selectedLayerType,
          fill: canvasState.currentFillColor,
          stroke: canvasState.currentStrokeColor,
          x: canvasState.originX - canvasState.cameraX,
          y: canvasState.originY - canvasState.cameraY,
          width: event.pageX - canvasState.originX,
          height: event.pageY - canvasState.originY,
          isActive: false,
          points: pathPoints,
        },
      ]);
    }

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
        style={{
          cursor:
            canvasState.mode === CanvasMode.None &&
            canvasState.selectedLayerType === null
              ? "grab"
              : canvasState.mode === CanvasMode.Panning
              ? "grabbing"
              : canvasState.mode === CanvasMode.Pencil
              ? "crosshair"
              : "default",
        }}
      />
      {/* Canvas for preview layer */}
      <canvas
        ref={tempCanvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      />
    </>
  );
}
