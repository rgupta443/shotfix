'use client';

import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { CanvasEngine } from '../lib/canvas/CanvasEngine';
import { CanvasState } from '../lib/types/canvas';
import { ClipboardManager, ClipboardImageData } from '../lib/clipboard/ClipboardManager';

interface CanvasWrapperProps {
  className?: string;
  onImageLoad?: (state: CanvasState) => void;
  onError?: (error: Error) => void;
  onFileValidationError?: (error: string) => void;
  onClipboardPaste?: (success: boolean) => void;
}

// Export type for the ref
export interface CanvasWrapperRef {
  loadImage: (imageData: HTMLImageElement | File | Blob | string) => Promise<void>;
  resetView: () => void;
  exportCanvas: () => Promise<Blob>;
  getPerformanceMetrics: () => any;
  getCanvasEngine: () => CanvasEngine | null;
}

export const CanvasWrapper = forwardRef<CanvasWrapperRef, CanvasWrapperProps>(({
  className = '',
  onImageLoad,
  onError,
  onFileValidationError,
  onClipboardPaste,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasEngineRef = useRef<CanvasEngine | null>(null);
  const clipboardManagerRef = useRef<ClipboardManager | null>(null);
  const onImageLoadRef = useRef(onImageLoad);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPasteReady, setIsPasteReady] = useState(false);
  const [currentState, setCurrentState] = useState<CanvasState | null>(null);

  // File validation constants
  const SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg'];
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_DIMENSIONS = { width: 8000, height: 8000 };

  // Update ref when callback changes
  useEffect(() => {
    onImageLoadRef.current = onImageLoad;
  }, [onImageLoad]);

  // Handle canvas state changes
  const handleStateChange = useCallback((state: CanvasState) => {
    setCurrentState(state);
    onImageLoadRef.current?.(state);
  }, []);

  // Initialize canvas engine
  useEffect(() => {
    if (containerRef.current && !canvasEngineRef.current) {
      try {
        canvasEngineRef.current = new CanvasEngine(handleStateChange);
        canvasEngineRef.current.initialize(containerRef.current);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize canvas:', error);
        onError?.(error instanceof Error ? error : new Error('Canvas initialization failed'));
      }
    }

    // Cleanup on unmount
    return () => {
      if (canvasEngineRef.current) {
        canvasEngineRef.current.destroy();
        canvasEngineRef.current = null;
      }
    };
  }, []); // Empty dependency array to prevent re-initialization

  // File validation function
  const validateFile = useCallback((file: File): { isValid: boolean; error?: string } => {
    // Check file type
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      return {
        isValid: false,
        error: `Unsupported file format. Please use PNG or JPG files. Received: ${file.type || 'unknown'}`
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB. File size: ${Math.round(file.size / 1024 / 1024 * 100) / 100}MB`
      };
    }

    return { isValid: true };
  }, []);

  // Blob validation function (for clipboard images)
  const validateBlob = useCallback((blob: Blob): { isValid: boolean; error?: string } => {
    // Check blob type
    if (!SUPPORTED_FORMATS.includes(blob.type)) {
      return {
        isValid: false,
        error: `Unsupported image format from clipboard. Received: ${blob.type || 'unknown'}`
      };
    }

    // Check blob size
    if (blob.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `Clipboard image too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB. Size: ${Math.round(blob.size / 1024 / 1024 * 100) / 100}MB`
      };
    }

    return { isValid: true };
  }, []);

  // Load image method with validation
  const loadImage = useCallback(async (imageData: HTMLImageElement | File | Blob | string) => {
    if (!canvasEngineRef.current) {
      throw new Error('Canvas not initialized');
    }

    // Validate file if it's a File object
    if (imageData instanceof File) {
      const validation = validateFile(imageData);
      if (!validation.isValid) {
        onFileValidationError?.(validation.error!);
        return;
      }
    }

    // Validate blob if it's a Blob object (from clipboard)
    if (imageData instanceof Blob) {
      const validation = validateBlob(imageData);
      if (!validation.isValid) {
        onFileValidationError?.(validation.error!);
        return;
      }
    }

    setIsLoading(true);
    try {
      await canvasEngineRef.current.loadImage(imageData);
      const state = canvasEngineRef.current.getState();
      
      // Additional validation for image dimensions
      if (state.image.dimensions.width > MAX_DIMENSIONS.width || 
          state.image.dimensions.height > MAX_DIMENSIONS.height) {
        throw new Error(`Image dimensions too large. Maximum: ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height}, Received: ${state.image.dimensions.width}x${state.image.dimensions.height}`);
      }
      
      // State change will be handled by the callback
      setCurrentState(state);
      onImageLoad?.(state);
    } catch (error) {
      console.error('Failed to load image:', error);
      onError?.(error instanceof Error ? error : new Error('Image loading failed'));
    } finally {
      setIsLoading(false);
    }
  }, [onImageLoad, onError, onFileValidationError, validateFile, validateBlob]);

  // Clipboard event handlers
  const handleClipboardImagePaste = useCallback(async (imageData: ClipboardImageData) => {
    try {
      console.log('Clipboard image paste detected:', imageData);
      setIsPasteReady(false);
      await loadImage(imageData.blob);
      onClipboardPaste?.(true);
    } catch (error) {
      console.error('Failed to load pasted image:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to load pasted image'));
      onClipboardPaste?.(false);
    }
  }, [onError, onClipboardPaste, loadImage]);

  const handleClipboardError = useCallback((error: Error) => {
    console.warn('Clipboard operation failed:', error);
    setIsPasteReady(false);
    // Don't propagate clipboard errors as they're often due to no image in clipboard
    // onError?.(error);
  }, []);

  const handlePasteAttempt = useCallback(() => {
    console.log('Paste attempt detected');
    setIsPasteReady(true);
    // Reset the paste ready state after a short delay
    setTimeout(() => setIsPasteReady(false), 2000);
  }, []);

  // Initialize clipboard manager
  useEffect(() => {
    if (!clipboardManagerRef.current) {
      console.log('CanvasWrapper: Initializing clipboard manager');
      clipboardManagerRef.current = new ClipboardManager({
        onImagePaste: handleClipboardImagePaste,
        onError: handleClipboardError,
        onPasteAttempt: handlePasteAttempt,
      });
      
      clipboardManagerRef.current.startListening();
      console.log('CanvasWrapper: Clipboard manager started listening');
    }

    // Cleanup on unmount
    return () => {
      if (clipboardManagerRef.current) {
        console.log('CanvasWrapper: Destroying clipboard manager');
        clipboardManagerRef.current.destroy();
        clipboardManagerRef.current = null;
      }
    };
  }, [handleClipboardImagePaste, handleClipboardError, handlePasteAttempt]);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set dragOver to false if we're leaving the container entirely
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    
    if (files.length === 0) {
      onFileValidationError?.('No files detected in drop');
      return;
    }

    if (files.length > 1) {
      onFileValidationError?.('Please drop only one image file at a time');
      return;
    }

    const file = files[0];
    loadImage(file).catch(error => {
      onError?.(error instanceof Error ? error : new Error('Failed to load dropped file'));
    });
  }, [loadImage, onError, onFileValidationError]);

  // Reset view method
  const resetView = useCallback(() => {
    if (canvasEngineRef.current) {
      canvasEngineRef.current.resetView();
    }
  }, []);

  // Export canvas method
  const exportCanvas = useCallback(async (): Promise<Blob> => {
    if (!canvasEngineRef.current) {
      throw new Error('Canvas not initialized');
    }
    return canvasEngineRef.current.exportCanvas();
  }, []);

  // Get performance metrics
  const getPerformanceMetrics = useCallback(() => {
    if (!canvasEngineRef.current) {
      return null;
    }
    return canvasEngineRef.current.getPerformanceMetrics();
  }, []);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    loadImage,
    resetView,
    exportCanvas,
    getPerformanceMetrics,
    getCanvasEngine: () => canvasEngineRef.current,
  }));

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        className={`w-full h-full border-2 border-dashed rounded-lg overflow-hidden transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50'
        }`}
        style={{ minHeight: '400px' }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
      
      {/* Paste feedback overlay */}
      {isPasteReady && (
        <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center rounded-lg pointer-events-none">
          <div className="bg-white px-6 py-4 rounded-lg shadow-lg border-2 border-green-500">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-2 border-green-500 border-dashed rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-green-700">Paste detected</p>
                <p className="text-sm text-green-600">Processing clipboard image...</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center rounded-lg pointer-events-none">
          <div className="bg-white px-6 py-4 rounded-lg shadow-lg border-2 border-blue-500">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-2 border-blue-500 border-dashed rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-blue-700">Drop your image here</p>
                <p className="text-sm text-blue-600">PNG or JPG files only</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium">Loading image...</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Initialization overlay */}
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500 text-sm">Initializing canvas...</div>
        </div>
      )}
    </div>
  );
});

CanvasWrapper.displayName = 'CanvasWrapper';