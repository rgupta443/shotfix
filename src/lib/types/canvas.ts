export interface Dimensions {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FontStyle {
  family: string;
  size: number;
  weight: string;
  color: string;
}

export interface TextRegion {
  id: string;
  bounds: Rectangle;
  originalText: string;
  editedText?: string;
  fontStyle: FontStyle;
  confidence: number;
}

export interface ShapeStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}

export interface Shape {
  id: string;
  type: 'rectangle' | 'arrow' | 'circle' | 'text';
  bounds: Rectangle;
  style: ShapeStyle;
}

export type BlurType = 'gaussian' | 'solid' | 'pixelate';

export interface BlurRegion {
  id: string;
  bounds: Rectangle;
  type: BlurType;
  intensity: number;
}

export interface CanvasState {
  image: {
    data: HTMLImageElement | null;
    dimensions: Dimensions;
    originalSize: number;
  };
  
  layers: {
    textRegions: TextRegion[];
    shapes: Shape[];
    blurRegions: BlurRegion[];
  };
  
  ui: {
    selectedTool: string;
    snapGuidesEnabled: boolean;
    zoomLevel: number;
    panOffset: Point;
  };
}