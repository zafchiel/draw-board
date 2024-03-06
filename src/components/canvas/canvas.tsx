import { CanvasStateContext } from "@/providers/canvas-state-provider";
import { useContext, useEffect, useRef } from "react";
import rough from "roughjs";

const gen = rough.generator();

export function Canvas() {
  const canvasContext = useContext(CanvasStateContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Resize canvas on window resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rc = rough.canvas(canvas);
    const rectangle = gen.rectangle(10, 10, 200, 200, {stroke: "red"});

    rc.draw(rectangle);
  }, [canvasRef.current]);

  return <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />;
}
