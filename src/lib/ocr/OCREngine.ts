import { createWorker, Worker, RecognizeResult } from 'tesseract.js';
import { TextRegion, Rectangle, FontStyle } from '../types/canvas';

export interface OCRProgress {
  status: string;
  progress: number;
}

export class OCREngine {
  private worker: Worker | null = null;
  private isInitialized = false;
  private onProgress?: (progress: OCRProgress) => void;

  constructor(onProgress?: (progress: OCRProgress) => void) {
    this.onProgress = onProgress;
  }

  /**
   * Initialize the OCR worker with optimized settings for UI text detection
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Initializing OCR engine...');
      this.worker = await createWorker('eng', 1, {
        logger: (m) => {
          console.log('OCR Logger:', m);
          if (this.onProgress) {
            this.onProgress({
              status: m.status,
              progress: m.progress || 0
            });
          }
        }
      });

      console.log('OCR worker created, setting parameters...');
      // Configure OCR settings optimized for UI text
      await this.worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?@#$%^&*()_+-=[]{}|;:\'",.<>/?`~',
        preserve_interword_spaces: '1'
        // Note: tessedit_pageseg_mode removed due to TypeScript compatibility
      });

      console.log('OCR engine initialized successfully');
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize OCR engine:', error);
      throw new Error('OCR engine initialization failed');
    }
  }

  /**
   * Detect text regions in an image
   */
  async detectText(imageData: HTMLImageElement | HTMLCanvasElement | string): Promise<TextRegion[]> {
    if (!this.worker || !this.isInitialized) {
      await this.initialize();
    }

    if (!this.worker) {
      throw new Error('OCR worker not initialized');
    }

    try {
      const startTime = performance.now();
      
      const result: RecognizeResult = await this.worker.recognize(imageData);
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      // Log performance for monitoring
      console.log(`OCR processing completed in ${processingTime.toFixed(2)}ms`);

      return this.parseOCRResult(result);
    } catch (error) {
      console.error('OCR text detection failed:', error);
      throw new Error('Text detection failed');
    }
  }

  /**
   * Set OCR language
   */
  async setLanguage(language: string): Promise<void> {
    if (this.worker) {
      await this.worker.reinitialize(language);
    }
  }

  /**
   * Parse Tesseract.js result into TextRegion objects
   */
  private parseOCRResult(result: RecognizeResult): TextRegion[] {
    const textRegions: TextRegion[] = [];

    console.log('OCR Result:', result);

    if (!result.data) {
      console.warn('No OCR data returned');
      return textRegions;
    }

    // Log the structure to understand what we're working with
    console.log('OCR data structure:', {
      hasWords: !!(result.data as any).words,
      hasLines: !!(result.data as any).lines,
      hasBlocks: !!(result.data as any).blocks,
      hasParagraphs: !!(result.data as any).paragraphs,
      text: result.data.text
    });

    // Try to access words from different possible locations in the result
    const words = (result.data as any).words || [];
    
    if (words.length === 0) {
      console.log('No words found, trying lines...');
      // Fallback: try to get text from lines and create regions
      const lines = (result.data as any).lines || [];
      console.log('Found lines:', lines.length);
      
      lines.forEach((line: any, index: number) => {
        console.log('Processing line:', line);
        if (line.text && line.text.trim().length > 0 && line.confidence > 20) { // Lower confidence threshold
          const bounds: Rectangle = {
            x: line.bbox.x0,
            y: line.bbox.y0,
            width: line.bbox.x1 - line.bbox.x0,
            height: line.bbox.y1 - line.bbox.y0
          };

          const fontSize = Math.max(12, bounds.height * 0.8);
          const fontStyle: FontStyle = {
            family: 'Arial, sans-serif',
            size: fontSize,
            weight: 'normal',
            color: '#000000'
          };

          const textRegion: TextRegion = {
            id: `text-region-line-${index}-${Date.now()}`,
            bounds,
            originalText: line.text,
            fontStyle,
            confidence: line.confidence
          };

          textRegions.push(textRegion);
          console.log('Added text region from line:', textRegion);
        }
      });
      
      // If no lines either, try paragraphs
      if (textRegions.length === 0) {
        console.log('No lines found, trying paragraphs...');
        const paragraphs = (result.data as any).paragraphs || [];
        console.log('Found paragraphs:', paragraphs.length);
        
        paragraphs.forEach((paragraph: any, index: number) => {
          console.log('Processing paragraph:', paragraph);
          if (paragraph.text && paragraph.text.trim().length > 0 && paragraph.confidence > 20) {
            const bounds: Rectangle = {
              x: paragraph.bbox.x0,
              y: paragraph.bbox.y0,
              width: paragraph.bbox.x1 - paragraph.bbox.x0,
              height: paragraph.bbox.y1 - paragraph.bbox.y0
            };

            const fontSize = Math.max(12, bounds.height * 0.6);
            const fontStyle: FontStyle = {
              family: 'Arial, sans-serif',
              size: fontSize,
              weight: 'normal',
              color: '#000000'
            };

            const textRegion: TextRegion = {
              id: `text-region-para-${index}-${Date.now()}`,
              bounds,
              originalText: paragraph.text,
              fontStyle,
              confidence: paragraph.confidence
            };

            textRegions.push(textRegion);
            console.log('Added text region from paragraph:', textRegion);
          }
        });
      }
    } else {
      console.log('Processing words:', words.length);
      // Process individual words
      words.forEach((word: any, index: number) => {
        console.log('Processing word:', word);
        // Filter out low-confidence detections (lowered threshold)
        if (word.confidence < 20) {
          console.log('Skipping low confidence word:', word.confidence);
          return;
        }

        // Skip empty or whitespace-only text
        if (!word.text || word.text.trim().length === 0) {
          console.log('Skipping empty word');
          return;
        }

        const bounds: Rectangle = {
          x: word.bbox.x0,
          y: word.bbox.y0,
          width: word.bbox.x1 - word.bbox.x0,
          height: word.bbox.y1 - word.bbox.y0
        };

        // Estimate font style based on text dimensions
        const fontSize = Math.max(12, bounds.height * 0.8);
        const fontStyle: FontStyle = {
          family: 'Arial, sans-serif', // Default font family
          size: fontSize,
          weight: 'normal',
          color: '#000000'
        };

        const textRegion: TextRegion = {
          id: `text-region-${index}-${Date.now()}`,
          bounds,
          originalText: word.text,
          fontStyle,
          confidence: word.confidence
        };

        textRegions.push(textRegion);
        console.log('Added text region from word:', textRegion);
      });
    }

    console.log('Total text regions before merging:', textRegions.length);

    // Merge nearby text regions that likely belong together
    const mergedRegions = this.mergeNearbyRegions(textRegions);
    console.log('Total text regions after merging:', mergedRegions.length);
    
    return mergedRegions;
  }

  /**
   * Merge nearby text regions that likely belong to the same UI element
   */
  private mergeNearbyRegions(regions: TextRegion[]): TextRegion[] {
    if (regions.length <= 1) return regions;

    const merged: TextRegion[] = [];
    const processed = new Set<number>();

    for (let i = 0; i < regions.length; i++) {
      if (processed.has(i)) continue;

      const currentRegion = regions[i];
      const groupedRegions = [currentRegion];
      processed.add(i);

      // Find nearby regions to merge
      for (let j = i + 1; j < regions.length; j++) {
        if (processed.has(j)) continue;

        const otherRegion = regions[j];
        
        // Check if regions are close enough to merge (within 10 pixels vertically)
        const verticalDistance = Math.abs(currentRegion.bounds.y - otherRegion.bounds.y);
        const horizontalGap = Math.abs(
          (currentRegion.bounds.x + currentRegion.bounds.width) - otherRegion.bounds.x
        );

        if (verticalDistance <= 10 && horizontalGap <= 20) {
          groupedRegions.push(otherRegion);
          processed.add(j);
        }
      }

      // Merge grouped regions
      if (groupedRegions.length > 1) {
        merged.push(this.mergeRegions(groupedRegions));
      } else {
        merged.push(currentRegion);
      }
    }

    return merged;
  }

  /**
   * Merge multiple text regions into a single region
   */
  private mergeRegions(regions: TextRegion[]): TextRegion {
    // Sort regions by x position
    regions.sort((a, b) => a.bounds.x - b.bounds.x);

    const firstRegion = regions[0];

    // Calculate merged bounds
    const minX = Math.min(...regions.map(r => r.bounds.x));
    const minY = Math.min(...regions.map(r => r.bounds.y));
    const maxX = Math.max(...regions.map(r => r.bounds.x + r.bounds.width));
    const maxY = Math.max(...regions.map(r => r.bounds.y + r.bounds.height));

    const mergedBounds: Rectangle = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };

    // Combine text with spaces
    const combinedText = regions.map(r => r.originalText).join(' ');

    // Use the highest confidence
    const maxConfidence = Math.max(...regions.map(r => r.confidence));

    return {
      id: `merged-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      bounds: mergedBounds,
      originalText: combinedText,
      fontStyle: firstRegion.fontStyle,
      confidence: maxConfidence
    };
  }

  /**
   * Cleanup resources
   */
  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
    }
  }

  /**
   * Get initialization status
   */
  getInitializationStatus(): boolean {
    return this.isInitialized;
  }
}

// Singleton instance for global use
let globalOCREngine: OCREngine | null = null;

export const getOCREngine = (onProgress?: (progress: OCRProgress) => void): OCREngine => {
  if (!globalOCREngine) {
    globalOCREngine = new OCREngine(onProgress);
  }
  return globalOCREngine;
};