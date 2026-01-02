import { TextRegion } from '../types/canvas';

/**
 * Common OCR progress information
 */
export interface OCRProgress {
  status: string;
  progress: number;
  message?: string;
}

/**
 * OCR configuration options that can be passed to any provider
 */
export interface OCRConfig {
  language?: string;
  confidence?: number;
  whitelist?: string;
  blacklist?: string;
  pageSegmentationMode?: string | number;
  engineMode?: string | number;
  [key: string]: any; // Allow provider-specific options
}

/**
 * OCR provider capabilities
 */
export interface OCRCapabilities {
  supportsLanguages: string[];
  supportsConfidenceScoring: boolean;
  supportsWordLevel: boolean;
  supportsLineLevel: boolean;
  supportsParagraphLevel: boolean;
  supportsProgressReporting: boolean;
  requiresApiKey: boolean;
  requiresNetwork: boolean;
}

/**
 * OCR provider metadata
 */
export interface OCRProviderInfo {
  name: string;
  version: string;
  description: string;
  capabilities: OCRCapabilities;
}

/**
 * Core OCR service interface that all providers must implement
 */
export interface IOCRService {
  /**
   * Get provider information
   */
  getProviderInfo(): OCRProviderInfo;

  /**
   * Initialize the OCR service
   */
  initialize(config?: OCRConfig): Promise<void>;

  /**
   * Check if the service is initialized
   */
  isInitialized(): boolean;

  /**
   * Detect text regions in an image
   */
  detectText(
    imageData: HTMLImageElement | HTMLCanvasElement | string | Blob,
    config?: OCRConfig
  ): Promise<TextRegion[]>;

  /**
   * Set language for OCR processing
   */
  setLanguage(language: string): Promise<void>;

  /**
   * Update configuration
   */
  updateConfig(config: OCRConfig): Promise<void>;

  /**
   * Cleanup resources
   */
  terminate(): Promise<void>;

  /**
   * Set progress callback
   */
  setProgressCallback(callback: (progress: OCRProgress) => void): void;
}

/**
 * OCR service factory interface
 */
export interface IOCRServiceFactory {
  createService(provider: string, config?: OCRConfig): IOCRService;
  getAvailableProviders(): string[];
  getProviderInfo(provider: string): OCRProviderInfo | null;
}

/**
 * OCR provider registration interface
 */
export interface IOCRProvider {
  name: string;
  createService(config?: OCRConfig): IOCRService;
  getProviderInfo(): OCRProviderInfo;
}