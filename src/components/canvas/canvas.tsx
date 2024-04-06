import { draw, reDraw } from "@/lib/drawings";
import { CanvasMode, LayerType } from "@/lib/types";
import {
  checkIfMouseOverResizeHandlers,
  getBoundingBox,
  isPointInLayer,
  resizeBounds,
  useTheme,
} from "@/lib/utils";
import { CanvasStateContext } from "@/providers/canvas-state-provider";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { TextArea } from "./text-area";
import { nanoid } from "nanoid/non-secure";

export function Canvas() {
  const { canvasState, setCanvasState, layers, setLayers } =
    useContext(CanvasStateContext);

  const [pathPoints, setPathPoints] = useState<[number, number][] | null>(null);
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

  const startDrawingPencil = useCallback(
    (currentX: number, currentY: number) => {
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
      tempCanvasCtx.lineWidth = 1;
      tempCanvasCtx.beginPath();
    },
    [canvasState, setCanvasState, theme]
  );

  const startPanningMode = useCallback(
    (currentX: number, currentY: number) => {
      setCanvasState({
        ...canvasState,
        mode: CanvasMode.Panning,
        originX: currentX,
        originY: currentY,
      });
    },
    [canvasState, setCanvasState]
  );

  const onPointerDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;

      const currentX = event.pageX;
      const currentY = event.pageY;

      // Start drawing path
      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawingPencil(currentX, currentY);
      }
      // Activate panning mode
      else if (
        canvasState.mode === CanvasMode.None &&
        canvasState.selectedLayerType === null
      ) {
        startPanningMode(currentX, currentY);
      }
      // Select one layer
      else if (canvasState.mode === CanvasMode.Selecting) {
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
          if (
            clickedCorner === "bottomRight" &&
            canvasState.selectedLayerType !== LayerType.Path
          ) {
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

          // If not over resize handler move layer
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
          // Delete selection if clicked on nothing
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
      else if (canvasState.selectedLayerType !== null) {
        setCanvasState({
          ...canvasState,
          mode: CanvasMode.Inserting,
          originX: currentX,
          originY: currentY,
        });
      }
    },
    [
      canvasState,
      layers,
      setCanvasState,
      setLayers,
      startDrawingPencil,
      startPanningMode,
    ]
  );

  const handleResizing = useCallback(
    (currentX: number, currentY: number, corner: string) => {
      // Resize the layer
      const selectedLayer = canvasState.currentLayer;
      if (!selectedLayer) return;

      const newBounds = resizeBounds(
        selectedLayer,
        corner,
        currentX - canvasState.cameraX,
        currentY - canvasState.cameraY
      );

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
    },
    [canvasState, layers, setCanvasState, setLayers]
  );

  const handleMoveLayer = useCallback(
    (currentX: number, currentY: number, moveX: number, moveY: number) => {
      const selectedLayerId = canvasState.currentLayer?.id;

      if (!selectedLayerId) return;

      setLayers(
        layers.map((layer) => {
          if (layer.id === selectedLayerId) {
            if (layer.points) {
              const movedPoints = layer.points.map(
                ([x, y]) => [x + moveX, y + moveY] as [number, number]
              );
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
        originX: currentX,
        originY: currentY,
      });
    },
    [canvasState, layers, setCanvasState, setLayers]
  );

  const handleDrawingPath = useCallback(
    (currentX: number, currentY: number) => {
      const tempCanvasCtx = tempCanvasRef.current?.getContext("2d");
      if (!tempCanvasCtx) return;
      setPathPoints((state) => [...state!, [currentX, currentY]]);
      tempCanvasCtx.lineTo(currentX, currentY);
      tempCanvasCtx.stroke();
    },
    []
  );

  const handlePanningCanvas = useCallback(
    (currentX: number, currentY: number, moveX: number, moveY: number) => {
      setCanvasState((prevCanvasState) => {
        return {
          ...prevCanvasState,
          cameraX: prevCanvasState.cameraX + moveX,
          cameraY: prevCanvasState.cameraY + moveY,
          originX: currentX, // Update the origin to the current pointer position
          originY: currentY, // Update the origin to the current pointer position
        };
      });
    },
    [setCanvasState]
  );

  const handleDrawingPreviewLayer = useCallback(
    (
      originX: number,
      originY: number,
      moxeX: number,
      moveY: number,
      selectedLayerType: LayerType
    ) => {
      const tempCanvas = tempCanvasRef.current;
      if (!tempCanvas) return;

      const ctx = tempCanvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height); // Clear the temporary canvas

      draw({
        layer: {
          x: originX,
          y: originY,
          width: moxeX,
          height: moveY,
          stroke: theme === "light" ? "black" : "white",
          fill: "transparent",
          points: null,
          type: selectedLayerType,
          id: nanoid(),
          isActive: false,
        },
        canvas: tempCanvas,
      });
    },
    [theme]
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      const currentX = event.pageX;
      const currentY = event.pageY;

      const moveX = event.pageX - canvasState.originX;
      const moveY = event.pageY - canvasState.originY;

      // Resizing layer
      if (canvasState.mode === CanvasMode.Resizing && resizingCorner !== null) {
        handleResizing(currentX, currentY, resizingCorner);
      }
      // Moving one layer
      else if (canvasState.mode === CanvasMode.Moving) {
        handleMoveLayer(currentX, currentY, moveX, moveY);
      }
      // Drawing pencil path
      else if (isDrawingPath) {
        handleDrawingPath(currentX, currentY);
      }
      // Panning the canvas
      else if (canvasState.mode === CanvasMode.Panning) {
        handlePanningCanvas(currentX, currentY, moveX, moveY);
      }
      // Drawing the preview layer
      else if (
        canvasState.mode === CanvasMode.Inserting &&
        canvasState.selectedLayerType !== null &&
        canvasState.selectedLayerType !== LayerType.Text
      ) {
        handleDrawingPreviewLayer(
          canvasState.originX,
          canvasState.originY,
          moveX,
          moveY,
          canvasState.selectedLayerType
        );
      }
    },
    [
      canvasState.mode,
      canvasState.originX,
      canvasState.originY,
      canvasState.selectedLayerType,
      handleDrawingPath,
      handleDrawingPreviewLayer,
      handleMoveLayer,
      handlePanningCanvas,
      handleResizing,
      isDrawingPath,
      resizingCorner,
    ]
  );

  const onPointerUp = (event: React.PointerEvent) => {
    const canvas = canvasRef.current;
    const tempCanvas = tempCanvasRef.current;
    if (!canvas || !tempCanvas) return;

    const ctx = canvas.getContext("2d");
    const tempCtx = tempCanvas.getContext("2d");
    if (!ctx || !tempCtx) return;

    if (
      canvasState.mode === CanvasMode.Inserting &&
      canvasState.selectedLayerType === LayerType.Text
    ) {
      return;
    }

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
      ]) as [number, number][];

      // Add drawing path to the layers
      setLayers([
        ...layers,
        {
          id: nanoid(),
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
          id: nanoid(),
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

      <TextArea
        left={canvasState.originX}
        top={canvasState.originY}
        visible={
          canvasState.mode === CanvasMode.Inserting &&
          canvasState.selectedLayerType === LayerType.Text
        }
      />
    </>
  );
}
