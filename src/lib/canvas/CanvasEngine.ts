import Konva from 'konva';
import { Dimensions, Point, Rectangle, TextRegion, Shape, BlurRegion, CanvasState, BlurType } from '../types/canvas';

export class CanvasEngine {
  private stage: Konva.Stage | null = null;
  private layer: Konva.Layer | null = null;
  private imageNode: Konva.Image | null = null;
  private container: HTMLDivElement | null = null;
  private canvasState: CanvasState;
  private onStateChange?: (state: CanvasState) => void;
  
  // Performance tracking
  private performanceMetrics = {
    imageLoadTime: 0,
    renderTime: 0,
  };

  constructor(onStateChange?: (state: CanvasState) => void) {
    this.onStateChange = onStateChange;
    this.canvasState = {
      image: {
        data: null,
        dimensions: { width: 0, height: 0 },
        originalSize: 0,
      },
      layers: {
        textRegions: [],
        shapes: [],
        blurRegions: [],
      },
      ui: {
        selectedTool: 'select',
        snapGuidesEnabled: true,
        zoomLevel: 1,
        panOffset: { x: 0, y: 0 },
      },
    };
  }

  /**
   * Initialize the canvas with a container element
   */
  public initialize(container: HTMLDivElement): void {
    this.container = container;
    const containerRect = container.getBoundingClientRect();
    
    this.stage = new Konva.Stage({
      container: container,
      width: containerRect.width || 800, // Fallback width
      height: containerRect.height || 400, // Fallback height
      draggable: false,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    // Set up zoom functionality
    this.setupZoomAndPan();
  }

  /**
   * Load an image onto the canvas
   */
  public async loadImage(imageData: HTMLImageElement | File | Blob | string): Promise<void> {
    const startTime = performance.now();
    
    try {
      let imageElement: HTMLImageElement;
      
      if (imageData instanceof HTMLImageElement) {
        imageElement = imageData;
      } else if (imageData instanceof File) {
        imageElement = await this.fileToImage(imageData);
      } else if (imageData instanceof Blob) {
        imageElement = await this.blobToImage(imageData);
      } else if (typeof imageData === 'string') {
        imageElement = await this.urlToImage(imageData);
      } else {
        throw new Error('Invalid image data type');
      }

      // Update canvas state
      this.canvasState.image.data = imageElement;
      this.canvasState.image.dimensions = {
        width: imageElement.naturalWidth,
        height: imageElement.naturalHeight,
      };
      this.canvasState.image.originalSize = this.estimateImageSize(imageElement);

      // Create Konva image node
      this.imageNode = new Konva.Image({
        image: imageElement,
        x: 0,
        y: 0,
        width: imageElement.naturalWidth,
        height: imageElement.naturalHeight,
        draggable: true, // Make the image draggable
      });

      // Clear existing content and add image
      this.layer?.destroyChildren();
      this.layer?.add(this.imageNode);
      
      // Fit image to stage
      this.fitImageToStage();
      
      // Force a redraw
      this.layer?.batchDraw();
      
      // Record performance
      this.performanceMetrics.imageLoadTime = performance.now() - startTime;
      
    } catch (error) {
      throw new Error(`Failed to load image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Notify parent component of state changes
   */
  private notifyStateChange(): void {
    if (this.onStateChange) {
      this.onStateChange({ ...this.canvasState });
    }
  }

  /**
   * Set up zoom and pan functionality
   */
  private setupZoomAndPan(): void {
    if (!this.stage) return;

    const scaleBy = 1.1;
    
    this.stage.on('wheel', (e) => {
      e.evt.preventDefault();
      
      if (!this.imageNode) return;
      
      const oldScale = this.imageNode.scaleX();
      const pointer = this.stage!.getPointerPosition();
      
      if (!pointer) return;
      
      const mousePointTo = {
        x: (pointer.x - this.imageNode.x()) / oldScale,
        y: (pointer.y - this.imageNode.y()) / oldScale,
      };
      
      const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      
      // Limit zoom levels
      const clampedScale = Math.max(0.1, Math.min(5, newScale));
      
      this.imageNode.scale({ x: clampedScale, y: clampedScale });
      
      const newPos = {
        x: pointer.x - mousePointTo.x * clampedScale,
        y: pointer.y - mousePointTo.y * clampedScale,
      };
      
      this.imageNode.position(newPos);
      this.canvasState.ui.zoomLevel = clampedScale;
      this.canvasState.ui.panOffset = newPos;
      
      // Notify parent component of state change
      this.notifyStateChange();
      
      this.layer?.batchDraw();
    });

    // Handle image dragging
    this.stage.on('dragend', (e) => {
      if (e.target === this.imageNode) {
        const pos = this.imageNode!.position();
        this.canvasState.ui.panOffset = pos;
        
        // Notify parent component of state change
        this.notifyStateChange();
      }
    });
  }

  /**
   * Set up responsive scaling
   */
  private setupResponsiveScaling(): void {
    if (!this.container || !this.stage) return;

    let resizeTimeout: NodeJS.Timeout;

    const resizeObserver = new ResizeObserver(() => {
      if (!this.container || !this.stage) return;
      
      // Debounce resize events
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        console.log('CanvasEngine: ResizeObserver triggered (debounced)');
        const containerRect = this.container!.getBoundingClientRect();
        console.log('CanvasEngine: New container dimensions:', containerRect);
        
        this.stage!.size({
          width: containerRect.width,
          height: containerRect.height,
        });
        
        // Re-fit image if it exists
        if (this.imageNode) {
          console.log('CanvasEngine: Re-fitting image due to resize');
          this.fitImageToStage();
          this.layer?.batchDraw();
        }
      }, 100); // 100ms debounce
    });

    resizeObserver.observe(this.container);
  }

  /**
   * Fit the loaded image to the stage dimensions
   */
  private fitImageToStage(): void {
    if (!this.stage || !this.imageNode || !this.canvasState.image.data) return;

    const stageWidth = this.stage.width();
    const stageHeight = this.stage.height();
    const imageWidth = this.canvasState.image.dimensions.width;
    const imageHeight = this.canvasState.image.dimensions.height;

    // Check if stage has valid dimensions
    if (stageWidth <= 0 || stageHeight <= 0) {
      return;
    }

    // Calculate scale to fit image in stage while maintaining aspect ratio
    const scaleX = stageWidth / imageWidth;
    const scaleY = stageHeight / imageHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond original size

    // Calculate scaled dimensions
    const scaledWidth = imageWidth * scale;
    const scaledHeight = imageHeight * scale;

    // Center the image within the stage
    const x = (stageWidth - scaledWidth) / 2;
    const y = (stageHeight - scaledHeight) / 2;

    // Apply scale and position to the image node, not the stage
    this.imageNode.scale({ x: scale, y: scale });
    this.imageNode.position({ x, y });
    
    // Reset stage transform to default
    this.stage.scale({ x: 1, y: 1 });
    this.stage.position({ x: 0, y: 0 });
    
    this.canvasState.ui.zoomLevel = scale;
    this.canvasState.ui.panOffset = { x: 0, y: 0 };
  }

  /**
   * Convert File to HTMLImageElement
   */
  private fileToImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('File is not an image'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Convert Blob to HTMLImageElement
   */
  private blobToImage(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (!blob.type.startsWith('image/')) {
        reject(new Error('Blob is not an image'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Clean up the object URL to prevent memory leaks
          URL.revokeObjectURL(img.src);
          resolve(img);
        };
        img.onerror = () => {
          URL.revokeObjectURL(img.src);
          reject(new Error('Failed to load image from blob'));
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read blob'));
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Convert URL to HTMLImageElement
   */
  private urlToImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image from URL'));
      img.src = url;
    });
  }

  /**
   * Estimate image file size
   */
  private estimateImageSize(image: HTMLImageElement): number {
    // Rough estimation: width * height * 4 bytes per pixel (RGBA)
    return image.naturalWidth * image.naturalHeight * 4;
  }

  /**
   * Add a text region to the canvas
   */
  public addTextRegion(region: TextRegion): void {
    this.canvasState.layers.textRegions.push(region);
    // Implementation for visual representation will be added in later tasks
  }

  /**
   * Add a shape to the canvas
   */
  public addShape(shape: Shape): void {
    this.canvasState.layers.shapes.push(shape);
    // Implementation for visual representation will be added in later tasks
  }

  /**
   * Apply blur to a region
   */
  public applyBlur(region: Rectangle, type: BlurType, intensity: number = 10): void {
    const blurRegion: BlurRegion = {
      id: `blur_${Date.now()}`,
      bounds: region,
      type,
      intensity,
    };
    this.canvasState.layers.blurRegions.push(blurRegion);
    // Implementation for visual blur effect will be added in later tasks
  }

  /**
   * Export canvas as blob
   */
  public async exportCanvas(): Promise<Blob> {
    if (!this.stage) {
      throw new Error('Canvas not initialized');
    }

    return new Promise((resolve, reject) => {
      try {
        this.stage!.toBlob({
          callback: (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to export canvas'));
            }
          },
          mimeType: 'image/png',
          quality: 1.0,
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Enable or disable snap guides
   */
  public enableSnapGuides(enabled: boolean): void {
    this.canvasState.ui.snapGuidesEnabled = enabled;
  }

  /**
   * Get current canvas state
   */
  public getState(): CanvasState {
    return { ...this.canvasState };
  }

  /**
   * Get performance metrics
   */
  public getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }

  /**
   * Reset zoom and pan to fit image
   */
  public resetView(): void {
    if (this.imageNode) {
      this.fitImageToStage();
      this.layer?.batchDraw();
    }
  }

  /**
   * Destroy the canvas and clean up resources
   */
  public destroy(): void {
    if (this.stage) {
      this.stage.destroy();
      this.stage = null;
    }
    this.layer = null;
    this.imageNode = null;
    this.container = null;
  }
}