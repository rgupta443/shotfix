# OCR Architecture

This directory contains a pluggable OCR architecture that makes it easy to switch between different OCR providers with minimal code changes.

## Quick Start - Switching OCR Providers

To switch OCR providers, simply edit `src/lib/ocr/config.ts`:

```typescript
// Change this line to switch providers app-wide
export const DEFAULT_OCR_PROVIDER = OCR_PROVIDERS.GOOGLE_VISION; // or TESSERACT
```

That's it! The entire application will now use the new OCR provider.

## Architecture Overview

```
src/lib/ocr/
├── config.ts              # 🔧 Main configuration - change provider here
├── types.ts               # Type definitions
├── OCRManager.ts          # High-level OCR interface
├── OCRServiceFactory.ts   # Provider factory
├── useOCR.ts             # React hook
├── providers/
│   ├── TesseractProvider.ts    # Tesseract.js implementation
│   └── GoogleVisionProvider.ts # Google Vision API implementation
└── README.md             # This file
```

## Available Providers

### Tesseract (Default)
- **Provider**: `OCR_PROVIDERS.TESSERACT`
- **Type**: Client-side OCR
- **Pros**: No API costs, works offline, no API keys needed
- **Cons**: Lower accuracy, slower processing
- **Best for**: Development, privacy-sensitive applications

### Google Vision API
- **Provider**: `OCR_PROVIDERS.GOOGLE_VISION`
- **Type**: Cloud-based OCR
- **Pros**: High accuracy, fast processing, supports many languages
- **Cons**: Requires API key, costs money, needs internet
- **Best for**: Production applications requiring high accuracy

## Adding a New OCR Provider

1. **Create the provider implementation**:
   ```typescript
   // src/lib/ocr/providers/YourProvider.ts
   export class YourOCRService implements IOCRService {
     // Implement all required methods
   }
   
   export class YourProvider implements IOCRProvider {
     public readonly name = 'your-provider';
     public createService(config?: OCRConfig): IOCRService {
       return new YourOCRService(config);
     }
   }
   ```

2. **Add to configuration**:
   ```typescript
   // src/lib/ocr/config.ts
   export const OCR_PROVIDERS = {
     TESSERACT: 'tesseract',
     GOOGLE_VISION: 'google-vision',
     YOUR_PROVIDER: 'your-provider', // Add this
   } as const;
   
   export const OCR_CONFIG = {
     // ... existing configs
     [OCR_PROVIDERS.YOUR_PROVIDER]: {
       // Your provider's configuration
     },
   } as const;
   ```

3. **Register the provider**:
   ```typescript
   // src/lib/ocr/OCRManager.ts
   import { YourProvider } from './providers/YourProvider';
   
   function ensureProvidersInitialized(): void {
     // ... existing registrations
     factory.registerProvider(new YourProvider());
   }
   ```

4. **Switch to your provider**:
   ```typescript
   // src/lib/ocr/config.ts
   export const DEFAULT_OCR_PROVIDER = OCR_PROVIDERS.YOUR_PROVIDER;
   ```

## Configuration

Each provider can have its own configuration in `config.ts`. Common settings include:

- `language`: OCR language (e.g., 'eng', 'spa', 'fra')
- `confidence`: Minimum confidence threshold (0-100)
- `apiKey`: API key for cloud providers
- `whitelist`: Allowed characters for recognition

## Environment Variables

For production deployments, use environment variables for sensitive configuration:

```bash
# .env.local
GOOGLE_VISION_API_KEY=your_api_key_here
```

Then reference in config:
```typescript
[OCR_PROVIDERS.GOOGLE_VISION]: {
  apiKey: process.env.GOOGLE_VISION_API_KEY,
}
```

## Testing

The architecture includes comprehensive tests. When adding a new provider:

1. Add unit tests for your provider implementation
2. Update integration tests if needed
3. Test provider switching functionality

## Performance Considerations

- **Tesseract**: Runs in browser, may block UI during processing
- **Google Vision**: Network latency, but faster processing
- **Custom providers**: Consider worker threads for CPU-intensive tasks

## Migration Guide

### From Direct Tesseract Usage
If you were using Tesseract directly:

**Before**:
```typescript
import { createWorker } from 'tesseract.js';
const worker = await createWorker('eng');
const result = await worker.recognize(image);
```

**After**:
```typescript
import { useOCR } from './lib/ocr/useOCR';
const [ocrState, ocrActions] = useOCR();
const regions = await ocrActions.detectText(image);
```

### Switching Providers
No code changes needed in components - just update `config.ts`!

## Troubleshooting

### Provider Not Found Error
- Ensure the provider is registered in `OCRManager.ts`
- Check that the provider name matches exactly

### Configuration Issues
- Verify configuration in `config.ts`
- Check environment variables for API keys
- Ensure required dependencies are installed

### Performance Issues
- Consider using web workers for client-side OCR
- Implement caching for repeated OCR operations
- Monitor API usage for cloud providers