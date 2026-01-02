// Export main interfaces and types
export * from './types';
export * from './OCRManager';
export * from './OCRServiceFactory';
export * from './useOCR';

// Export providers
export * from './providers/TesseractProvider';
export * from './providers/GoogleVisionProvider';

// Provider registration and initialization
import { OCRServiceFactory } from './OCRServiceFactory';
import { TesseractProvider } from './providers/TesseractProvider';
import { GoogleVisionProvider } from './providers/GoogleVisionProvider';

/**
 * Initialize and register all available OCR providers
 */
export function initializeOCRProviders(): void {
  const factory = OCRServiceFactory.getInstance();
  
  // Register Tesseract provider (always available)
  factory.registerProvider(new TesseractProvider());
  
  // Register Google Vision provider (requires API key)
  factory.registerProvider(new GoogleVisionProvider());
  
  console.log('OCR providers initialized:', factory.getAvailableProviders());
}

/**
 * Auto-initialize providers when this module is imported
 */
initializeOCRProviders();