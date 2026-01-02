import { useState, useCallback, useRef } from 'react';
import { OCREngine, OCRProgress, getOCREngine } from './OCREngine';
import { TextRegion } from '../types/canvas';

export interface OCRState {
  isProcessing: boolean;
  progress: OCRProgress | null;
  textRegions: TextRegion[];
  error: string | null;
  isInitialized: boolean;
}

export interface OCRActions {
  detectText: (imageData: HTMLImageElement | HTMLCanvasElement | string) => Promise<TextRegion[]>;
  initialize: () => Promise<void>;
  setLanguage: (language: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useOCR = (): [OCRState, OCRActions] => {
  const [state, setState] = useState<OCRState>({
    isProcessing: false,
    progress: null,
    textRegions: [],
    error: null,
    isInitialized: false
  });

  const ocrEngineRef = useRef<OCREngine | null>(null);

  // Initialize OCR engine with progress callback
  const getEngine = useCallback(() => {
    if (!ocrEngineRef.current) {
      ocrEngineRef.current = getOCREngine((progress: OCRProgress) => {
        setState(prev => ({
          ...prev,
          progress
        }));
      });
    }
    return ocrEngineRef.current;
  }, []);

  const initialize = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isProcessing: true, error: null }));
      
      const engine = getEngine();
      await engine.initialize();
      
      setState(prev => ({
        ...prev,
        isInitialized: true,
        isProcessing: false,
        progress: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to initialize OCR',
        isProcessing: false,
        progress: null
      }));
    }
  }, [getEngine]);

  const detectText = useCallback(async (imageData: HTMLImageElement | HTMLCanvasElement | string): Promise<TextRegion[]> => {
    try {
      setState(prev => ({ 
        ...prev, 
        isProcessing: true, 
        error: null,
        progress: { status: 'recognizing text', progress: 0 }
      }));

      const engine = getEngine();
      const textRegions = await engine.detectText(imageData);

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
  }, [getEngine]);

  const setLanguage = useCallback(async (language: string) => {
    try {
      setState(prev => ({ ...prev, isProcessing: true, error: null }));
      
      const engine = getEngine();
      await engine.setLanguage(language);
      
      setState(prev => ({ ...prev, isProcessing: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to set language',
        isProcessing: false
      }));
    }
  }, [getEngine]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isProcessing: false,
      progress: null,
      textRegions: [],
      error: null,
      isInitialized: false
    });
  }, []);

  return [
    state,
    {
      detectText,
      initialize,
      setLanguage,
      clearError,
      reset
    }
  ];
};