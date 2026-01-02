/**
 * ClipboardManager - Handles clipboard operations for image pasting
 * Supports various clipboard image formats and provides visual feedback
 */

export interface ClipboardImageData {
  blob: Blob;
  type: string;
  size: number;
}

export interface ClipboardManagerOptions {
  onImagePaste?: (imageData: ClipboardImageData) => void;
  onError?: (error: Error) => void;
  onPasteAttempt?: () => void;
  supportedTypes?: string[];
}

export class ClipboardManager {
  private options: ClipboardManagerOptions;
  private isListening: boolean = false;
  private pasteHandler: (event: ClipboardEvent) => void;
  private keyboardHandler: (event: KeyboardEvent) => void;

  // Supported image MIME types
  private readonly DEFAULT_SUPPORTED_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
    'image/bmp'
  ];

  constructor(options: ClipboardManagerOptions = {}) {
    this.options = {
      supportedTypes: this.DEFAULT_SUPPORTED_TYPES,
      ...options
    };

    // Bind event handlers
    this.pasteHandler = this.handlePaste.bind(this);
    this.keyboardHandler = this.handleKeyboard.bind(this);
  }

  /**
   * Start listening for clipboard events
   */
  public startListening(): void {
    if (this.isListening) {
      return;
    }

    console.log('ClipboardManager: Starting to listen for clipboard events');
    
    // Listen for paste events on the document
    document.addEventListener('paste', this.pasteHandler);
    
    // Listen for Ctrl+V / Cmd+V keyboard shortcuts
    document.addEventListener('keydown', this.keyboardHandler);
    
    this.isListening = true;
  }

  /**
   * Stop listening for clipboard events
   */
  public stopListening(): void {
    if (!this.isListening) {
      return;
    }

    document.removeEventListener('paste', this.pasteHandler);
    document.removeEventListener('keydown', this.keyboardHandler);
    
    this.isListening = false;
  }

  /**
   * Handle paste events
   */
  private async handlePaste(event: ClipboardEvent): Promise<void> {
    console.log('ClipboardManager: Paste event detected', event);
    try {
      // Notify that a paste attempt is happening
      this.options.onPasteAttempt?.();

      const clipboardData = event.clipboardData;
      if (!clipboardData) {
        throw new Error('No clipboard data available');
      }

      console.log('ClipboardManager: Clipboard data items:', Array.from(clipboardData.items).map(item => ({ kind: item.kind, type: item.type })));

      // Look for image data in clipboard
      const imageData = await this.extractImageFromClipboard(clipboardData);
      
      if (imageData) {
        console.log('ClipboardManager: Image data found:', imageData);
        // Prevent default paste behavior
        event.preventDefault();
        
        // Notify success
        this.options.onImagePaste?.(imageData);
      } else {
        // No image found in clipboard
        console.log('ClipboardManager: No image data found in clipboard');
        throw new Error('No image data found in clipboard');
      }
    } catch (error) {
      console.error('ClipboardManager: Paste error:', error);
      this.options.onError?.(error instanceof Error ? error : new Error('Clipboard paste failed'));
    }
  }

  /**
   * Handle keyboard shortcuts (Ctrl+V / Cmd+V)
   */
  private handleKeyboard(event: KeyboardEvent): void {
    // Check for Ctrl+V (Windows/Linux) or Cmd+V (Mac)
    const isCtrlV = (event.ctrlKey || event.metaKey) && event.key === 'v';
    
    if (isCtrlV) {
      console.log('ClipboardManager: Ctrl+V / Cmd+V detected');
      // Don't interfere if user is typing in an input field
      const activeElement = document.activeElement;
      const isInputField = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.getAttribute('contenteditable') === 'true'
      );

      if (!isInputField) {
        console.log('ClipboardManager: Triggering paste attempt notification');
        // Trigger paste attempt notification
        this.options.onPasteAttempt?.();
        
        // The actual paste event will be handled by handlePaste
        // We just provide visual feedback here
      } else {
        console.log('ClipboardManager: Ignoring paste in input field');
      }
    }
  }

  /**
   * Extract image data from clipboard
   */
  private async extractImageFromClipboard(clipboardData: DataTransfer): Promise<ClipboardImageData | null> {
    const items = Array.from(clipboardData.items);
    
    // First, try to find image files
    for (const item of items) {
      if (item.kind === 'file' && this.isImageType(item.type)) {
        const file = item.getAsFile();
        if (file) {
          return {
            blob: file,
            type: file.type,
            size: file.size
          };
        }
      }
    }

    // If no file found, try to get image data from string types
    // This handles cases where images are copied as data URLs
    for (const item of items) {
      if (item.kind === 'string' && item.type === 'text/html') {
        const htmlData = await this.getStringFromClipboardItem(item);
        const imageBlob = await this.extractImageFromHTML(htmlData);
        if (imageBlob) {
          return imageBlob;
        }
      }
    }

    return null;
  }

  /**
   * Check if a MIME type is a supported image type
   */
  private isImageType(type: string): boolean {
    return this.options.supportedTypes?.includes(type) || false;
  }

  /**
   * Get string data from clipboard item
   */
  private getStringFromClipboardItem(item: DataTransferItem): Promise<string> {
    return new Promise((resolve, reject) => {
      item.getAsString((data) => {
        if (data) {
          resolve(data);
        } else {
          reject(new Error('Failed to get string from clipboard item'));
        }
      });
    });
  }

  /**
   * Extract image from HTML content (for cases where images are copied from web pages)
   */
  private async extractImageFromHTML(html: string): Promise<ClipboardImageData | null> {
    try {
      // Create a temporary DOM element to parse HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Look for img tags
      const imgElements = tempDiv.querySelectorAll('img');
      
      for (const img of imgElements) {
        const src = img.src;
        if (src && src.startsWith('data:image/')) {
          // Convert data URL to blob
          const blob = await this.dataURLToBlob(src);
          if (blob) {
            return {
              blob,
              type: blob.type,
              size: blob.size
            };
          }
        }
      }
      
      return null;
    } catch (error) {
      console.warn('Failed to extract image from HTML:', error);
      return null;
    }
  }

  /**
   * Convert data URL to Blob
   */
  private async dataURLToBlob(dataURL: string): Promise<Blob | null> {
    try {
      const response = await fetch(dataURL);
      return await response.blob();
    } catch (error) {
      console.warn('Failed to convert data URL to blob:', error);
      return null;
    }
  }

  /**
   * Manually trigger clipboard read (requires user gesture)
   */
  public async readClipboard(): Promise<ClipboardImageData | null> {
    try {
      // Check if Clipboard API is supported
      if (!navigator.clipboard || !navigator.clipboard.read) {
        throw new Error('Clipboard API not supported');
      }

      const clipboardItems = await navigator.clipboard.read();
      
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (this.isImageType(type)) {
            const blob = await clipboardItem.getType(type);
            return {
              blob,
              type,
              size: blob.size
            };
          }
        }
      }
      
      return null;
    } catch (error) {
      throw new Error(`Failed to read clipboard: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if clipboard contains image data (requires user gesture)
   */
  public async hasImageData(): Promise<boolean> {
    try {
      if (!navigator.clipboard || !navigator.clipboard.read) {
        return false;
      }

      const clipboardItems = await navigator.clipboard.read();
      
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (this.isImageType(type)) {
            return true;
          }
        }
      }
      
      return false;
    } catch (error) {
      // Clipboard access denied or not supported
      return false;
    }
  }

  /**
   * Get current listening status
   */
  public isListeningForPaste(): boolean {
    return this.isListening;
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    this.stopListening();
  }
}