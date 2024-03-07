export type Color = {
  h: number;
  s: number;
  l: number;
  a: number;
};

export enum LayerType {
  Rectangle = "rectangle",
  Ellipse = "ellipse",
  Path = "path",
  Text = "text",
}

export type Layer = {
  type: LayerType;
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: Color;
  stroke: Color;
};

export enum CanvasMode {
  Selecting = "selecting",
  SelectionNet = "selectionNet",
  Inserting = "inserting",
  Resizing = "resizing",
  Pencil = "pencil",
  Moving = "moving",
}

export type CanvasState = {
  mode: CanvasMode;
  currentLayer: Layer | null;
  selectedLayerType: LayerType | null;
  currentStrokeColor: Color;
  currentFillColor: Color;
  currentX: number;
  currentY: number;
  originX: number;
  originY: number;
};
