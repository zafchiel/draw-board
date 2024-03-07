import { CanvasMode, LayerType } from "@/lib/types";
import { CanvasStateContext } from "@/providers/canvas-state-provider";
import { useContext, useEffect, useRef } from "react";
import rough from "roughjs";

const gen = rough.generator();

export function Canvas() {
  const {canvasState, updateState} = useContext(CanvasStateContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rc = rough.canvas(canvas);
    const rectangle = gen.rectangle(10, 10, 200, 200, {stroke: "red"});

    rc.draw(rectangle);
  }, []);


  const onPointerDown = (event: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const startingX = event.pageX;
    const startingY = event.pageY;

    if(canvasState.selectedLayerType === "rectangle") {
      console.log("Inserting rectangle");
      updateState({
        ...canvasState,
        mode: CanvasMode.Inserting,
        originX: startingX,
        originY: startingY
      })
    }
  }

  const onPointerMove = (event: React.MouseEvent) => {
    if(canvasState.mode === CanvasMode.Inserting) {

      if(canvasState.selectedLayerType === LayerType.Rectangle) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if(!ctx) return;

        const width = event.pageX - canvasState.originX;
        const height = event.pageY - canvasState.originY;

        const rc = rough.canvas(canvas);
        const rectangle = gen.rectangle(canvasState.originX, canvasState.originY, width, height, {stroke: "red", fill: "rgba(25, 255, 255, 1)"});

        rc.draw(rectangle);

      }
    }

  }

  const onPointerUp = () => {
    updateState({
      ...canvasState,
      mode: CanvasMode.None
    })
  }

  return <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}  />;
}
