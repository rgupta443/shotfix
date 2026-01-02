import { useState, useCallback, useRef, useEffect } from 'react';
import { OCRManager } from './OCRManager';
import { OCRProgress, OCRConfig } from './types';
import { TextRegion } from '../types/canvas';
import { DEFAULT_OCR_PROVIDER } from './config';

export interface OCRState {
  isProcessing: boolean;
  progress: OCRProgress | null;
  textRegions: TextRegion[];
  error: string | null;
  isInitialized: boolean;
  currentProvider: string | null;
  availableProviders: string[];
}

export interface OCRActions {
  detectText: (imageData: HTMLImageElement | HTMLCanvasElement | string | Blob, config?: OCRConfig) => Promise<TextRegion[]>;
  initialize: (provider?: string, config?: OCRConfig) => Promise<void>;
  switchProvider: (provider: string, config?: OCRConfig) => Promise<void>;
  setLanguage: (language: string) => Promise<void>;
  updateConfig: (config: OCRConfig) => Promise<void>;
  clearError: () => void;
  reset: () => void;
  getProviderInfo: (provider?: string) => any;
}

export const useOCR = (defaultProvider: string = DEFAULT_OCR_PROVIDER): [OCRState, OCRActions] => {
  const [state, setState] = useState<OCRState>({
    isProcessing: false,
    progress: null,
    textRegions: [],
    error: null,
    isInitialized: false,
    currentProvider: null,
    availableProviders: []
  });

  const ocrManagerRef = useRef<OCRManager | null>(null);

  // Initialize OCR manager
  const getManager = useCallback(() => {
    if (!ocrManagerRef.current) {
      ocrManagerRef.current = OCRManager.getInstance();
      
      // Set up progress callback
      ocrManagerRef.current.setProgressCallback((progress: OCRProgress) => {
        setState(prev => ({
          ...prev,
          progress
        }));
      });

      // Get available providers
      const availableProviders = ocrManagerRef.current.getAvailableProviders();
      setState(prev => ({
        ...prev,
        availableProviders
      }));
    }
    return ocrManagerRef.current;
  }, []);

  // Initialize with default provider on first use
  useEffect(() => {
    const manager = getManager();
    if (!manager.isInitialized() && defaultProvider) {
      initialize(defaultProvider).catch(error => {
        console.warn('Failed to auto-initialize OCR:', error);
      });
    }
  }, [defaultProvider]);

  const initialize = useCallback(async (provider: string = defaultProvider, config?: OCRConfig) => {
    try {
      setState(prev => ({ ...prev, isProcessing: true, error: null }));
      
      const manager = getManager();
      await manager.initialize(provider, config);
      
      setState(prev => ({
        ...prev,
        isInitialized: true,
        isProcessing: false,
        progress: null,
        currentProvider: provider
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to initialize OCR',
        isProcessing: false,
        progress: null,
        isInitialized: false,
        currentProvider: null
      }));
      throw error;
    }
  }, [defaultProvider, getManager]);

  const switchProvider = useCallback(async (provider: string, config?: OCRConfig) => {
    try {
      setState(prev => ({ ...prev, isProcessing: true, error: null }));
      
      const manager = getManager();
      await manager.switchProvider(provider, config);
      
      setState(prev => ({
        ...prev,
        isInitialized: true,
        isProcessing: false,
        progress: null,
        currentProvider: provider
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to switch OCR provider',
        isProcessing: false,
        progress: null
      }));
      throw error;
    }
  }, [getManager]);

  const detectText = useCallback(async (
    imageData: HTMLImageElement | HTMLCanvasElement | string | Blob,
    config?: OCRConfig
  ): Promise<TextRegion[]> => {
    try {
      setState(prev => ({ 
        ...prev, 
        isProcessing: true, 
        error: null,
        progress: { status: 'starting', progress: 0 }
      }));

      const manager = getManager();
      
      // Auto-initialize with default provider if not initialized
      if (!manager.isInitialized()) {
        await manager.initialize(defaultProvider);
        setState(prev => ({
          ...prev,
          isInitialized: true,
          currentProvider: defaultProvider
        }));
      }

      const textRegions = await manager.detectText(imageData, config);

      setState(prev => ({
        ...prev,
        textRegions,
        isProcessing: false,
        progress: null
      }));

      return textRegions;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Text detection failed';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isProcessing: false,
        progress: null,
        textRegions: []
      }));
      throw error;
    }
  }, [getManager, defaultProvider]);

  const setLanguage = useCallback(async (language: string) => {
    try {
      setState(prev => ({ ...prev, isProcessing: true, error: null }));
      
      const manager = getManager();
      await manager.setLanguage(language);
      
      setState(prev => ({ ...prev, isProcessing: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to set language',
        isProcessing: false
      }));
      throw error;
    }
  }, [getManager]);

  const updateConfig = useCallback(async (config: OCRConfig) => {
    try {
      setState(prev => ({ ...prev, isProcessing: true, error: null }));
      
      const manager = getManager();
      await manager.updateConfig(config);
      
      setState(prev => ({ ...prev, isProcessing: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update config',
        isProcessing: false
      }));
      throw error;
    }
  }, [getManager]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      isProcessing: false,
      progress: null,
      textRegions: [],
      error: null
    }));
  }, []);

  const getProviderInfo = useCallback((provider?: string) => {
    const manager = getManager();
    return manager.getProviderInfo(provider);
  }, [getManager]);

  return [
    state,
    {
      detectText,
      initialize,
      switchProvider,
      setLanguage,
      updateConfig,
      clearError,
      reset,
      getProviderInfo
    }
  ];
};