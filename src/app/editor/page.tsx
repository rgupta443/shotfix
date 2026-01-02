'use client';

import React, { useRef, useState } from 'react';
import { CanvasWrapper, CanvasWrapperRef } from '../../components/CanvasWrapper';
import { CanvasState } from '../../lib/types/canvas';

export default function EditorPage() {
  const canvasRef = useRef<CanvasWrapperRef>(null);
  const [canvasState, setCanvasState] = useState<CanvasState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [clipboardMessage, setClipboardMessage] = useState<string | null>(null);

  const handleImageLoad = (state: CanvasState) => {
    setCanvasState(state);
    setError(null);
    setValidationError(null);
    console.log('Image loaded:', state);
  };

  const handleError = (error: Error) => {
    setError(error.message);
    console.error('Canvas error:', error);
  };

  const handleFileValidationError = (error: string) => {
    setValidationError(error);
    console.error('File validation error:', error);
  };

  const handleClipboardPaste = (success: boolean) => {
    if (success) {
      setClipboardMessage('Image pasted successfully from clipboard!');
      setError(null);
      setValidationError(null);
    } else {
      setClipboardMessage('Failed to paste image from clipboard');
    }
    
    // Clear clipboard message after 3 seconds
    setTimeout(() => setClipboardMessage(null), 3000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && canvasRef.current) {
      setError(null);
      setValidationError(null);
      canvasRef.current.loadImage(file).catch(handleError);
    }
  };

  const handleResetView = () => {
    if (canvasRef.current) {
      canvasRef.current.resetView();
    }
  };

  const handleExport = async () => {
    if (canvasRef.current) {
      try {
        const blob = await canvasRef.current.exportCanvas();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'edited-screenshot.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        handleError(error instanceof Error ? error : new Error('Export failed'));
      }
    }
  };

  const handlePasteFromClipboard = async () => {
    if (canvasRef.current) {
      try {
        // Try to read clipboard manually
        if (navigator.clipboard && navigator.clipboard.read) {
          const clipboardItems = await navigator.clipboard.read();
          
          for (const clipboardItem of clipboardItems) {
            for (const type of clipboardItem.types) {
              if (type.startsWith('image/')) {
                const blob = await clipboardItem.getType(type);
                await canvasRef.current.loadImage(blob);
                handleClipboardPaste(true);
                return;
              }
            }
          }
          
          setClipboardMessage('No image found in clipboard');
          setTimeout(() => setClipboardMessage(null), 3000);
        } else {
          setClipboardMessage('Clipboard API not supported. Try Ctrl+V instead.');
          setTimeout(() => setClipboardMessage(null), 3000);
        }
      } catch (error) {
        console.error('Manual clipboard read failed:', error);
        setClipboardMessage('Failed to read clipboard. Try Ctrl+V instead.');
        setTimeout(() => setClipboardMessage(null), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <a 
                href="/"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Home
              </a>
              <h1 className="text-2xl font-bold text-gray-900">
                Screenshot Editor
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                Upload Image
              </label>
              
              <button
                onClick={handlePasteFromClipboard}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                title="Paste image from clipboard"
              >
                Paste from Clipboard
              </button>
              
              {canvasState?.image.data && (
                <>
                  <button
                    onClick={handleResetView}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Reset View
                  </button>
                  <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Export PNG
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {clipboardMessage && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium">Clipboard:</p>
            <p className="text-blue-600">{clipboardMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error:</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {validationError && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-medium">File Validation Error:</p>
            <p className="text-yellow-700">{validationError}</p>
          </div>
        )}

        {/* Canvas Area */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <CanvasWrapper
            ref={canvasRef}
            className="w-full h-96"
            onImageLoad={handleImageLoad}
            onError={handleError}
            onFileValidationError={handleFileValidationError}
            onClipboardPaste={handleClipboardPaste}
          />
          
          {!canvasState?.image.data && (
            <div className="mt-4 text-center text-gray-500">
              <p className="text-lg font-medium mb-2">No image loaded</p>
              <p className="text-sm mb-2">
                Upload an image using the button above, drag and drop a PNG/JPG file, or paste from clipboard (Ctrl+V / Cmd+V)
              </p>
              <div className="text-xs text-gray-400 space-y-1">
                <p>• Supported formats: PNG, JPG, JPEG</p>
                <p>• Maximum file size: 50MB</p>
                <p>• Maximum dimensions: 8000×8000 pixels</p>
                <p>• For clipboard paste: Copy an image first, then click here and press Ctrl+V/Cmd+V</p>
              </div>
            </div>
          )}
        </div>

        {/* Image Info */}
        {canvasState?.image.data && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Image Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Dimensions:</span>
                <p className="text-gray-600">
                  {canvasState.image.dimensions.width} × {canvasState.image.dimensions.height}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Zoom Level:</span>
                <p className="text-gray-600">
                  {Math.round(canvasState.ui.zoomLevel * 100)}%
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Estimated Size:</span>
                <p className="text-gray-600">
                  {Math.round(canvasState.image.originalSize / 1024 / 1024 * 100) / 100} MB
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Snap Guides:</span>
                <p className="text-gray-600">
                  {canvasState.ui.snapGuidesEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}