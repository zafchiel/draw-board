import { LayerType, type Layer } from "./types";
import rough from "roughjs";

const gen = rough.generator();

type DrawParams = {
  x: number;
  y: number;
  width: number;
  height: number;
  stroke: string;
  fill: string;
  canvas: HTMLCanvasElement;
  type: LayerType;
}

export function draw({
  x,
  y,
  width,
  height,
  stroke,
  fill,
  canvas,
  type
}: DrawParams) {
  const rc = rough.canvas(canvas);
  let drawing;

  switch (type) {
    case LayerType.Rectangle:
      drawing = gen.rectangle(x, y, width, height, { stroke, fill });
      break;
    case LayerType.Ellipse:
      drawing = gen.ellipse(x + width / 2, y + height / 2, width, height, { stroke, fill, roughness: 0.2});
      break;
    default:
      break;
  }

  if (!drawing) return;
  rc.draw(drawing);
}

type RedrawParams = {
  layers: Layer[];
  stroke: string;
  cameraX: number;
  cameraY: number;
  canvas: HTMLCanvasElement;
}

export function reDraw({cameraX,cameraY,canvas,layers,stroke}: RedrawParams) {
  // const rc = rough.canvas(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(cameraX, cameraY);

  layers.forEach((layer) => {
    switch (layer.type) {
      case LayerType.Rectangle:
        draw({
          x: layer.x,
          y: layer.y,
          width: layer.width,
          height: layer.height,
          stroke: layer.isActive ? "#605e87" : stroke,
          fill: layer.fill,
          canvas,
          type: LayerType.Rectangle
        });
        break;

      case LayerType.Ellipse:
        draw({
          x: layer.x,
          y: layer.y,
          width: layer.width,
          height: layer.height,
          stroke: layer.isActive ? "#605e87" : stroke,
          fill: layer.fill,
          canvas,
          type: LayerType.Ellipse
        });
        break;
        
      default:
        break;
    }
  });

  ctx.restore();
  // ctx.setTransform(1, 0, 0, 1, 0, 0);
}
