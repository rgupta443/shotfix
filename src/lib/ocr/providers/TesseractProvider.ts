import { createWorker, Worker, RecognizeResult } from 'tesseract.js';
import { IOCRService, IOCRProvider, OCRConfig, OCRProgress, OCRProviderInfo, OCRCapabilities } from '../types';
import { TextRegion, Rectangle, FontStyle } from '../../types/canvas';

/**
 * Tesseract.js OCR Service Implementation
 */
export class TesseractOCRService implements IOCRService {
  private worker: Worker | null = null;
  private _isInitialized = false;
  private onProgress?: (progress: OCRProgress) => void;
  private config: OCRConfig;

  constructor(config: OCRConfig = {}) {
    this.config = {
      language: 'eng',
      confidence: 20,
      whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?@#$%^&*()_+-=[]{}|;:\'",.<>/?`~',
      ...config
    };
  }

  public getProviderInfo(): OCRProviderInfo {
    return {
      name: 'Tesseract.js',
      version: '7.0.0',
      description: 'Client-side OCR using Tesseract.js WebAssembly',
      capabilities: {
        supportsLanguages: ['eng', 'spa', 'fra', 'deu', 'ita', 'por', 'rus', 'chi_sim', 'chi_tra', 'jpn', 'kor'],
        supportsConfidenceScoring: true,
        supportsWordLevel: true,
        supportsLineLevel: true,
        supportsParagraphLevel: true,
        supportsProgressReporting: true,
        requiresApiKey: false,
        requiresNetwork: false
      }
    };
  }

  public async initialize(config?: OCRConfig): Promise<void> {
    if (this._isInitialized) return;

    if (config) {
      this.config = { ...this.config, ...config };
    }

    try {
      console.log('Initializing Tesseract OCR service...');
      
      this.worker = await createWorker(this.config.language || 'eng', 1, {
        logger: (m) => {
          console.log('Tesseract Logger:', m);
          if (this.onProgress) {
            this.onProgress({
              status: m.status,
              progress: m.progress || 0,
              message: m.status
            });
          }
        }
      });

      // Configure OCR settings
      const parameters: any = {};
      
      if (this.config.whitelist) {
        parameters.tessedit_char_whitelist = this.config.whitelist;
      }
      
      if (this.config.blacklist) {
        parameters.tessedit_char_blacklist = this.config.blacklist;
      }

      parameters.preserve_interword_spaces = '1';

      await this.worker.setParameters(parameters);

      console.log('Tesseract OCR service initialized successfully');
      this._isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Tesseract OCR service:', error);
      throw new Error(`Tesseract OCR initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public isInitialized(): boolean {
    return this._isInitialized;
  }

  public async detectText(
    imageData: HTMLImageElement | HTMLCanvasElement | string | Blob,
    config?: OCRConfig
  ): Promise<TextRegion[]> {
    if (!this.worker || !this._isInitialized) {
      await this.initialize(config);
    }

    if (!this.worker) {
      throw new Error('Tesseract OCR worker not initialized');
    }

    try {
      const startTime = performance.now();
      
      const result: RecognizeResult = await this.worker.recognize(imageData);
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      console.log(`Tesseract OCR processing completed in ${processingTime.toFixed(2)}ms`);

      return this.parseOCRResult(result, config);
    } catch (error) {
      console.error('Tesseract OCR text detection failed:', error);
      throw new Error(`Tesseract text detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async setLanguage(language: string): Promise<void> {
    if (this.worker) {
      await this.worker.reinitialize(language);
      this.config.language = language;
    }
  }

  public async updateConfig(config: OCRConfig): Promise<void> {
    this.config = { ...this.config, ...config };
    
    if (this.worker && this._isInitialized) {
      // Re-initialize with new config
      await this.terminate();
      await this.initialize(this.config);
    }
  }

  public async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this._isInitialized = false;
    }
  }

  public setProgressCallback(callback: (progress: OCRProgress) => void): void {
    this.onProgress = callback;
  }

  /**
   * Parse Tesseract.js result into TextRegion objects
   */
  private parseOCRResult(result: RecognizeResult, config?: OCRConfig): TextRegion[] {
    const textRegions: TextRegion[] = [];
    const confidenceThreshold = config?.confidence || this.config.confidence || 20;

    console.log('Tesseract OCR Result:', result);

    if (!result.data) {
      console.warn('No OCR data returned from Tesseract');
      return textRegions;
    }

    // Log the structure to understand what we're working with
    console.log('Tesseract OCR data structure:', {
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
        if (line.text && line.text.trim().length > 0 && line.confidence > confidenceThreshold) {
          const textRegion = this.createTextRegion(
            `text-region-line-${index}-${Date.now()}`,
            line.text,
            line.bbox,
            line.confidence
          );
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
          if (paragraph.text && paragraph.text.trim().length > 0 && paragraph.confidence > confidenceThreshold) {
            const textRegion = this.createTextRegion(
              `text-region-para-${index}-${Date.now()}`,
              paragraph.text,
              paragraph.bbox,
              paragraph.confidence
            );
            textRegions.push(textRegion);
            console.log('Added text region from paragraph:', textRegion);
          }
        });
      }
    } else {
      console.log('Processing words:', words.length);
      // Process individual words
      words.forEach((word: any, index: number) => {
        if (word.confidence >= confidenceThreshold && word.text && word.text.trim().length > 0) {
          const textRegion = this.createTextRegion(
            `text-region-${index}-${Date.now()}`,
            word.text,
            word.bbox,
            word.confidence
          );
          textRegions.push(textRegion);
          console.log('Added text region from word:', textRegion);
        }
      });
    }

    console.log('Total text regions before merging:', textRegions.length);

    // Merge nearby text regions that likely belong together
    const mergedRegions = this.mergeNearbyRegions(textRegions);
    console.log('Total text regions after merging:', mergedRegions.length);
    
    return mergedRegions;
  }

  /**
   * Create a TextRegion from OCR data
   */
  private createTextRegion(id: string, text: string, bbox: any, confidence: number): TextRegion {
    const bounds: Rectangle = {
      x: bbox.x0,
      y: bbox.y0,
      width: bbox.x1 - bbox.x0,
      height: bbox.y1 - bbox.y0
    };

    const fontSize = Math.max(12, bounds.height * 0.8);
    const fontStyle: FontStyle = {
      family: 'Arial, sans-serif',
      size: fontSize,
      weight: 'normal',
      color: '#000000'
    };

    return {
      id,
      bounds,
      originalText: text,
      fontStyle,
      confidence
    };
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
}

/**
 * Tesseract OCR Provider
 */
export class TesseractProvider implements IOCRProvider {
  public readonly name = 'tesseract';

  public createService(config?: OCRConfig): IOCRService {
    return new TesseractOCRService(config);
  }

  public getProviderInfo(): OCRProviderInfo {
    const service = new TesseractOCRService();
    return service.getProviderInfo();
  }
}