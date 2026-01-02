/**
 * OCR Configuration
 * 
 * This file allows developers to easily configure which OCR provider to use
 * throughout the application. To switch providers, simply change the 
 * DEFAULT_PROVIDER constant and update any provider-specific configuration.
 */

// Available OCR providers
export const OCR_PROVIDERS = {
  TESSERACT: 'tesseract',
  GOOGLE_VISION: 'google-vision',
  // Add new providers here as they become available
} as const;

// Default OCR provider - change this to switch providers app-wide
export const DEFAULT_OCR_PROVIDER = OCR_PROVIDERS.TESSERACT;

// Provider-specific configuration
export const OCR_CONFIG = {
  [OCR_PROVIDERS.TESSERACT]: {
    language: 'eng',
    confidence: 20,
    whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?@#$%^&*()_+-=[]{}|;:\'",.<>/?`~',
  },
  [OCR_PROVIDERS.GOOGLE_VISION]: {
    language: 'en',
    confidence: 50,
    // apiKey: process.env.GOOGLE_VISION_API_KEY, // Set via environment variable
  },
} as const;

/**
 * Get the configuration for the current OCR provider
 */
export function getOCRConfig(provider: string = DEFAULT_OCR_PROVIDER) {
  return OCR_CONFIG[provider as keyof typeof OCR_CONFIG] || {};
}

/**
 * Instructions for developers:
 * 
 * To switch OCR providers:
 * 1. Change DEFAULT_OCR_PROVIDER to your desired provider
 * 2. Update OCR_CONFIG with any provider-specific settings
 * 3. Ensure the provider is implemented in src/lib/ocr/providers/
 * 4. The change will apply throughout the entire application
 * 
 * To add a new OCR provider:
 * 1. Add the provider name to OCR_PROVIDERS
 * 2. Add configuration to OCR_CONFIG
 * 3. Implement the provider in src/lib/ocr/providers/YourProvider.ts
 * 4. Register it in src/lib/ocr/OCRManager.ts
 */