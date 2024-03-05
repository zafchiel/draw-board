import { useEffect, useRef } from "react";
import rough from "roughjs";

const gen = rough.generator();

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const rc = rough.canvas(canvasRef.current);
    const rectangle = gen.rectangle(10, 10, 200, 200, {stroke: "red"});

    rc.draw(rectangle);
  }, []);

  return <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />;
}
