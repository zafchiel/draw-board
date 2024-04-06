import { LayerType, type Layer } from "./types";
import rough from "roughjs";
import { nanoid } from "nanoid/non-secure";

type DrawParams = {
  layer: Layer;
  canvas: HTMLCanvasElement;
};

export function draw({ layer, canvas }: DrawParams) {
  const { x, y, width, height, stroke, fill, points, innerText, type } = layer;

  const rc = rough.canvas(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.font = "18px system-ui";
  ctx.textBaseline = "middle";
  ctx.fillStyle = stroke;

  switch (type) {
    case LayerType.Rectangle:
      rc.rectangle(x, y, width, height, { stroke, fill });
      break;
    case LayerType.Ellipse:
      rc.ellipse(x + width / 2, y + height / 2, width, height, {
        stroke,
        fill,
        roughness: 0.2,
      });
      break;
    case LayerType.Line:
      rc.line(x, y, x + width, y + height, {
        stroke,
        roughness: 0.2,
      });
      break;
    case LayerType.Arrow: {
      const p2x = x + width;
      const p2y = y + height;

      rc.line(x, y, p2x, p2y, {
        stroke,
        roughness: 0.2,
      });

      const lineAngle = Math.atan2(y - p2y, x - p2x);
      const delta = Math.PI / 6;

      const x1 = p2x + 20 * Math.cos(lineAngle + delta);
      const y1 = p2y + 20 * Math.sin(lineAngle + delta);

      const x2 = p2x + 20 * Math.cos(lineAngle - delta);
      const y2 = p2y + 20 * Math.sin(lineAngle - delta);

      rc.line(p2x, p2y, x1, y1, { stroke, roughness: 0.2 });
      rc.line(p2x, p2y, x2, y2, { stroke, roughness: 0.2 });
      break;
    }
    case LayerType.Path:
      rc.linearPath(points!, {
        stroke,
        roughness: 0.8,
        simplification: 1,
      });
      break;
    case LayerType.Text:
      if (!innerText) return;
      ctx.fillText(innerText, x, y);
      break;
    default:
      break;
  }
}

type RedrawParams = {
  layers: Layer[];
  cameraX: number;
  cameraY: number;
  canvas: HTMLCanvasElement;
  stroke: string;
};

export function reDraw({
  cameraX,
  cameraY,
  canvas,
  layers,
  stroke,
}: RedrawParams) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(cameraX, cameraY);

  layers.forEach((layer) => {
    if (layer.isActive) {
      // Draw selection rectangle
      draw({
        layer: {
          id: nanoid(),
          x: layer.x - 10,
          y: layer.y - 10,
          width: layer.width + 20,
          height: layer.height + 20,
          stroke: "#605e87",
          fill: "transparent",
          points: null,
          type: LayerType.Rectangle,
          isActive: false,
        },
        canvas,
      });

      // Draw resize handlers
      // draw({
      //   x: layer.x - 10,
      //   y: layer.y - 10,
      //   width: 10,
      //   height: 10,
      //   stroke: "#605e87",
      //   fill: layer.fill,
      //   points: null,
      //   type: LayerType.Ellipse,
      //   canvas,
      // });
      // draw({
      //   x: layer.x + layer.width,
      //   y: layer.y - 10,
      //   width: 10,
      //   height: 10,
      //   stroke: "#605e87",
      //   fill: layer.fill,
      //   points: null,
      //   type: LayerType.Ellipse,
      //   canvas,
      // });
      // draw({
      //   x: layer.x - 10,
      //   y: layer.y + layer.height,
      //   width: 10,
      //   height: 10,
      //   stroke: "#605e87",
      //   fill: layer.fill,
      //   points: null,
      //   type: LayerType.Ellipse,
      //   canvas,
      // });
      if (layer.type !== LayerType.Path) {
        // Draw resizing handler
        draw({
          layer: {
            id: nanoid(),
            x: layer.x + layer.width + 5,
            y: layer.y + layer.height + 5,
            width: 10,
            height: 10,
            stroke: "#605e87",
            fill: "transparent",
            points: null,
            type: LayerType.Ellipse,
            isActive: false,
          },
          canvas,
        });
      }
    }

    // Draw the layer
    draw({
      layer: {
        ...layer,
        stroke,
      },
      canvas,
    });
  });

  ctx.restore();
}
