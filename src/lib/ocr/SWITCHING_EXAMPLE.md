# OCR Provider Switching Example

This example demonstrates how easy it is to switch OCR providers with the pluggable architecture.

## Scenario: Upgrading from Tesseract to Google Vision

### Step 1: Current State (Using Tesseract)

```typescript
// src/lib/ocr/config.ts
export const DEFAULT_OCR_PROVIDER = OCR_PROVIDERS.TESSERACT;
```

Your application is running with Tesseract OCR. All components automatically use this provider.

### Step 2: Switch to Google Vision (1 line change!)

```typescript
// src/lib/ocr/config.ts
export const DEFAULT_OCR_PROVIDER = OCR_PROVIDERS.GOOGLE_VISION;

// Add your API key
export const OCR_CONFIG = {
  // ... existing config
  [OCR_PROVIDERS.GOOGLE_VISION]: {
    language: 'en',
    confidence: 50,
    apiKey: process.env.GOOGLE_VISION_API_KEY,
  },
} as const;
```

### Step 3: Set Environment Variable

```bash
# .env.local
GOOGLE_VISION_API_KEY=your_actual_api_key_here
```

### Step 4: Deploy

That's it! Your entire application now uses Google Vision API instead of Tesseract.

## What Changed Automatically

✅ **CanvasWrapper**: Now uses Google Vision for text detection  
✅ **Editor Page**: Automatically processes images with Google Vision  
✅ **useOCR Hook**: Returns Google Vision results  
✅ **All Components**: Seamlessly work with the new provider  

## What Didn't Change

✅ **Component Code**: Zero changes needed  
✅ **API Interfaces**: All remain the same  
✅ **User Experience**: Same functionality, better accuracy  
✅ **Type Safety**: Full TypeScript support maintained  

## Adding a Custom Provider

Let's say you want to add AWS Textract:

### 1. Create the Provider

```typescript
// src/lib/ocr/providers/AWSTextractProvider.ts
import { IOCRService, IOCRProvider, OCRConfig } from '../types';

export class AWSTextractOCRService implements IOCRService {
  // Implement all required methods
  async detectText(imageData: any): Promise<TextRegion[]> {
    // AWS Textract implementation
  }
  // ... other methods
}

export class AWSTextractProvider implements IOCRProvider {
  public readonly name = 'aws-textract';
  public createService(config?: OCRConfig): IOCRService {
    return new AWSTextractOCRService(config);
  }
}
```

### 2. Add to Configuration

```typescript
// src/lib/ocr/config.ts
export const OCR_PROVIDERS = {
  TESSERACT: 'tesseract',
  GOOGLE_VISION: 'google-vision',
  AWS_TEXTRACT: 'aws-textract', // Add this
} as const;

export const OCR_CONFIG = {
  // ... existing configs
  [OCR_PROVIDERS.AWS_TEXTRACT]: {
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
} as const;
```

### 3. Register the Provider

```typescript
// src/lib/ocr/OCRManager.ts
import { AWSTextractProvider } from './providers/AWSTextractProvider';

function ensureProvidersInitialized(): void {
  // ... existing registrations
  factory.registerProvider(new AWSTextractProvider());
}
```

### 4. Switch to AWS Textract

```typescript
// src/lib/ocr/config.ts
export const DEFAULT_OCR_PROVIDER = OCR_PROVIDERS.AWS_TEXTRACT;
```

Done! Your entire application now uses AWS Textract.

## Benefits of This Architecture

1. **Single Point of Configuration**: Change one line to switch providers
2. **Zero Component Changes**: All UI components work with any provider
3. **Type Safety**: Full TypeScript support across all providers
4. **Easy Testing**: Switch to mock providers for testing
5. **Gradual Migration**: Test new providers without changing production code
6. **Environment-Specific**: Use different providers for dev/staging/prod

## Real-World Usage Patterns

### Development vs Production
```typescript
// Use free Tesseract for development, paid service for production
export const DEFAULT_OCR_PROVIDER = 
  process.env.NODE_ENV === 'production' 
    ? OCR_PROVIDERS.GOOGLE_VISION 
    : OCR_PROVIDERS.TESSERACT;
```

### A/B Testing
```typescript
// Randomly assign users to different OCR providers
export const DEFAULT_OCR_PROVIDER = 
  Math.random() > 0.5 
    ? OCR_PROVIDERS.GOOGLE_VISION 
    : OCR_PROVIDERS.AWS_TEXTRACT;
```

### Feature Flags
```typescript
// Use feature flags to control OCR provider
export const DEFAULT_OCR_PROVIDER = 
  featureFlags.useAdvancedOCR 
    ? OCR_PROVIDERS.GOOGLE_VISION 
    : OCR_PROVIDERS.TESSERACT;
```

This architecture makes your application future-proof and easy to maintain!