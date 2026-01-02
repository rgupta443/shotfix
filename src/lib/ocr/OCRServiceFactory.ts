import { IOCRService, IOCRServiceFactory, IOCRProvider, OCRProviderInfo, OCRConfig } from './types';

/**
 * OCR Service Factory - manages different OCR providers
 */
export class OCRServiceFactory implements IOCRServiceFactory {
  private static instance: OCRServiceFactory | null = null;
  private providers: Map<string, IOCRProvider> = new Map();

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): OCRServiceFactory {
    if (!OCRServiceFactory.instance) {
      OCRServiceFactory.instance = new OCRServiceFactory();
    }
    return OCRServiceFactory.instance;
  }

  /**
   * Register an OCR provider
   */
  public registerProvider(provider: IOCRProvider): void {
    this.providers.set(provider.name.toLowerCase(), provider);
    console.log(`OCR Provider registered: ${provider.name}`);
  }

  /**
   * Create an OCR service instance
   */
  public createService(provider: string, config?: OCRConfig): IOCRService {
    const providerKey = provider.toLowerCase();
    const providerInstance = this.providers.get(providerKey);

    if (!providerInstance) {
      throw new Error(`OCR provider '${provider}' not found. Available providers: ${this.getAvailableProviders().join(', ')}`);
    }

    return providerInstance.createService(config);
  }

  /**
   * Get list of available providers
   */
  public getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Get provider information
   */
  public getProviderInfo(provider: string): OCRProviderInfo | null {
    const providerKey = provider.toLowerCase();
    const providerInstance = this.providers.get(providerKey);
    return providerInstance ? providerInstance.getProviderInfo() : null;
  }

  /**
   * Get all provider information
   */
  public getAllProviderInfo(): OCRProviderInfo[] {
    return Array.from(this.providers.values()).map(provider => provider.getProviderInfo());
  }

  /**
   * Check if a provider is available
   */
  public isProviderAvailable(provider: string): boolean {
    return this.providers.has(provider.toLowerCase());
  }
}