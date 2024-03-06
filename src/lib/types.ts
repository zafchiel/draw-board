export type Color = {
    h: number;
    s: number;
    l: number;
    a: number;
}

export enum LayerType {
    Rectangle = "rectangle",
    Ellipse = "ellipse",
    Path = "path",
    Text = "text",
  }
  
  export type RectangleLayer = {
    type: LayerType.Rectangle;
    x: number;
    y: number;
    width: number;
    height: number;
    fill: Color;
    stroke: Color;
    value?: string;
  };
  
  export type EllipseLayer = {
    type: LayerType.Ellipse;
    x: number;
    y: number;
    width: number;
    height: number;
    fill: Color;
    stroke: Color;
    value?: string;
  };
  
  export type PathLayer = {
    type: LayerType.Path;
    x: number;
    y: number;
    width: number;
    height: number;
    stroke: Color;
    points: number[][];
    value?: string;
  };
  
  export type TextLayer = {
    type: LayerType.Text;
    x: number;
    y: number;
    width: number;
    height: number;
    fill: Color;
    value?: string;
  };

  export type Layer =
  | RectangleLayer
  | EllipseLayer
  | PathLayer
  | TextLayer;

  export enum CanvasMode {
    None = 'none',
    Pressing = 'pressing',
    SelectionNet = 'selectionNet',
    Translating = 'translating',
    Inserting = 'inserting',
    Resizing = 'resizing',
    Pencil = 'pencil',
  }

  export type LayersArray = Layer[];

  export type CanvasState = {
    mode: CanvasMode;
    currentStrokeColor: Color;
    currentFillColor: Color;
    currentLayer: Layer | null;
  }