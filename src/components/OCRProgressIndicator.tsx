import React from 'react';
import { OCRProgress } from '../lib/ocr/OCREngine';

interface OCRProgressIndicatorProps {
  progress: OCRProgress | null;
  isVisible: boolean;
  className?: string;
}

export const OCRProgressIndicator: React.FC<OCRProgressIndicatorProps> = ({
  progress,
  isVisible,
  className = ''
}) => {
  if (!isVisible || !progress) {
    return null;
  }

  const progressPercentage = Math.round(progress.progress * 100);

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 border ${className}`}>
      <div className="flex items-center space-x-3">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        
        {/* Status and Progress */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 capitalize">
              {progress.status.replace(/_/g, ' ')}
            </span>
            <span className="text-sm text-gray-500">
              {progressPercentage}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Additional status messages */}
      {progress.status === 'loading tesseract core' && (
        <p className="text-xs text-gray-500 mt-2">
          Loading OCR engine for the first time...
        </p>
      )}
      {progress.status === 'initializing tesseract' && (
        <p className="text-xs text-gray-500 mt-2">
          Preparing text recognition...
        </p>
      )}
      {progress.status === 'recognizing text' && (
        <p className="text-xs text-gray-500 mt-2">
          Analyzing image for text content...
        </p>
      )}
    </div>
  );
};