import { IOCRService, OCRConfig, OCRProgress, OCRProviderInfo } from './types';
import { OCRServiceFactory } from './OCRServiceFactory';
import { TextRegion } from '../types/canvas';
import { DEFAULT_OCR_PROVIDER, getOCRConfig } from './config';

// Import providers to ensure they're available
import { TesseractProvider } from './providers/TesseractProvider';
import { GoogleVisionProvider } from './providers/GoogleVisionProvider';

/**
 * Initialize OCR providers if not already done
 */
function ensureProvidersInitialized(): void {
  const factory = OCRServiceFactory.getInstance();
  
  // Check if providers are already registered
  if (factory.getAvailableProviders().length === 0) {
    console.log('Initializing OCR providers...');
    
    // Register Tesseract provider (always available)
    factory.registerProvider(new TesseractProvider());
    
    // Register Google Vision provider (requires API key)
    factory.registerProvider(new GoogleVisionProvider());
    
    console.log('OCR providers initialized:', factory.getAvailableProviders());
  }
}

/**
 * OCR Manager - High-level interface for OCR operations
 * Manages the current OCR service and provides a unified API
 */
export class OCRManager {
  private static instance: OCRManager | null = null;
  private currentService: IOCRService | null = null;
  private currentProvider: string | null = null;
  private factory: OCRServiceFactory;
  private onProgress?: (progress: OCRProgress) => void;

  private constructor() {
    this.factory = OCRServiceFactory.getInstance();
    // Ensure providers are initialized
    ensureProvidersInitialized();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): OCRManager {
    if (!OCRManager.instance) {
      OCRManager.instance = new OCRManager();
    }
    return OCRManager.instance;
  }

  /**
   * Initialize OCR with the default provider (configured in config.ts)
   */
  public async initialize(provider: string = DEFAULT_OCR_PROVIDER, config?: OCRConfig): Promise<void> {
    try {
      // Terminate current service if exists
      if (this.currentService) {
        await this.currentService.terminate();
      }

      // Merge default config with provided config
      const defaultConfig = getOCRConfig(provider);
      const finalConfig = { ...defaultConfig, ...config };

      // Create new service
      this.currentService = this.factory.createService(provider, finalConfig);
      this.currentProvider = provider;

      // Set progress callback if available
      if (this.onProgress) {
        this.currentService.setProgressCallback(this.onProgress);
      }

      // Initialize the service
      await this.currentService.initialize(finalConfig);

      console.log(`OCR Manager initialized with provider: ${provider}`);
    } catch (error) {
      console.error(`Failed to initialize OCR with provider ${provider}:`, error);
      this.currentService = null;
      this.currentProvider = null;
      throw error;
    }
  }

  /**
   * Switch to a different OCR provider
   */
  public async switchProvider(provider: string, config?: OCRConfig): Promise<void> {
    if (this.currentProvider === provider) {
      console.log(`Already using provider: ${provider}`);
      return;
    }

    await this.initialize(provider, config);
  }

  /**
   * Get current provider name
   */
  public getCurrentProvider(): string | null {
    return this.currentProvider;
  }

  /**
   * Check if OCR is initialized
   */
  public isInitialized(): boolean {
    return this.currentService?.isInitialized() || false;
  }

  /**
   * Detect text in an image
   */
  public async detectText(
    imageData: HTMLImageElement | HTMLCanvasElement | string | Blob,
    config?: OCRConfig
  ): Promise<TextRegion[]> {
    if (!this.currentService) {
      throw new Error('OCR service not initialized. Call initialize() first.');
    }

    return this.currentService.detectText(imageData, config);
  }

  /**
   * Set language for OCR processing
   */
  public async setLanguage(language: string): Promise<void> {
    if (!this.currentService) {
      throw new Error('OCR service not initialized. Call initialize() first.');
    }

    await this.currentService.setLanguage(language);
  }

  /**
   * Update OCR configuration
   */
  public async updateConfig(config: OCRConfig): Promise<void> {
    if (!this.currentService) {
      throw new Error('OCR service not initialized. Call initialize() first.');
    }

    await this.currentService.updateConfig(config);
  }

  /**
   * Set progress callback
   */
  public setProgressCallback(callback: (progress: OCRProgress) => void): void {
    this.onProgress = callback;
    if (this.currentService) {
      this.currentService.setProgressCallback(callback);
    }
  }

  /**
   * Get available OCR providers
   */
  public getAvailableProviders(): string[] {
    return this.factory.getAvailableProviders();
  }

  /**
   * Get provider information
   */
  public getProviderInfo(provider?: string): OCRProviderInfo | null {
    if (provider) {
      return this.factory.getProviderInfo(provider);
    }
    
    if (this.currentService) {
      return this.currentService.getProviderInfo();
    }

    return null;
  }

  /**
   * Get all provider information
   */
  public getAllProviderInfo(): OCRProviderInfo[] {
    return this.factory.getAllProviderInfo();
  }

  /**
   * Check if a provider is available
   */
  public isProviderAvailable(provider: string): boolean {
    return this.factory.isProviderAvailable(provider);
  }

  /**
   * Terminate current OCR service
   */
  public async terminate(): Promise<void> {
    if (this.currentService) {
      await this.currentService.terminate();
      this.currentService = null;
      this.currentProvider = null;
    }
  }

  /**
   * Get current service instance (for advanced usage)
   */
  public getCurrentService(): IOCRService | null {
    return this.currentService;
  }
}