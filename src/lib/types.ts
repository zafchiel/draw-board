// export type Color = {
//   h: number;
//   s: number;
//   l: number;
//   a: number;
// };

import { Drawable } from "roughjs/bin/core";

export enum LayerType {
  Rectangle = "rectangle",
  Ellipse = "ellipse",
  Path = "path",
  Text = "text",
  Line = "line",
  Arrow = "arrow",
}

export type Layer = {
  type: LayerType;
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  isActive: boolean;
};

export enum CanvasMode {
  Selecting = "selecting",
  SelectionNet = "selectionNet",
  Inserting = "inserting",
  Resizing = "resizing",
  Pencil = "pencil",
  Moving = "moving",
  Panning = "panning",
  None = "none",
}

export type CanvasState = {
  mode: CanvasMode;
  currentLayer: Layer | null;
  selectedLayerType: LayerType | null;
  currentStrokeColor: string;
  currentFillColor: string;
  currentX: number;
  currentY: number;
  originX: number;
  originY: number;
  cameraX: number;
  cameraY: number;
  // previewLayer: {
  //   type: LayerType;
  //   x: number;
  //   y: number;
  //   width: number;
  //   height: number;
  //   fill: string;
  //   stroke: string;
  // } | null;
  previewLayer: Drawable | null;
};
