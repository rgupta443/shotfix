import React, { useState, useCallback } from 'react';
import { TextRegion } from '../lib/types/canvas';
import { TextRegionOverlay } from './TextRegionOverlay';
import { InlineTextEditor } from './InlineTextEditor';

interface TextRegionManagerProps {
  textRegions: TextRegion[];
  onTextRegionUpdate: (regionId: string, newText: string) => void;
  scale?: number;
  offset?: { x: number; y: number };
  isEnabled?: boolean;
  className?: string;
}

export const TextRegionManager: React.FC<TextRegionManagerProps> = ({
  textRegions,
  onTextRegionUpdate,
  scale = 1,
  offset = { x: 0, y: 0 },
  isEnabled = true,
  className = ''
}) => {
  const [editingRegion, setEditingRegion] = useState<TextRegion | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<TextRegion | null>(null);

  const handleTextRegionClick = useCallback((region: TextRegion) => {
    if (!isEnabled) return;
    setEditingRegion(region);
  }, [isEnabled]);

  const handleTextRegionHover = useCallback((region: TextRegion | null) => {
    if (!isEnabled) return;
    setHoveredRegion(region);
  }, [isEnabled]);

  const handleTextSave = useCallback((regionId: string, newText: string) => {
    onTextRegionUpdate(regionId, newText);
    setEditingRegion(null);
  }, [onTextRegionUpdate]);

  const handleTextCancel = useCallback(() => {
    setEditingRegion(null);
  }, []);

  if (!isEnabled || textRegions.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Text region overlay for visualization */}
      <TextRegionOverlay
        textRegions={textRegions}
        onTextRegionClick={handleTextRegionClick}
        onTextRegionHover={handleTextRegionHover}
        scale={scale}
        offset={offset}
      />
      
      {/* Inline text editor */}
      {editingRegion && (
        <InlineTextEditor
          textRegion={editingRegion}
          onSave={handleTextSave}
          onCancel={handleTextCancel}
          scale={scale}
          offset={offset}
        />
      )}
      
      {/* Hover feedback indicator */}
      {hoveredRegion && !editingRegion && (
        <div 
          className="absolute pointer-events-none z-40"
          style={{
            left: hoveredRegion.bounds.x + offset.x,
            top: hoveredRegion.bounds.y + offset.y - 30,
            transform: `scale(${scale})`,
            transformOrigin: 'top left'
          }}
        >
          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
            Click to edit: "{hoveredRegion.originalText.length > 30 
              ? `${hoveredRegion.originalText.substring(0, 30)}...` 
              : hoveredRegion.originalText
            }"
          </div>
        </div>
      )}
      
      {/* Instructions overlay when no regions are hovered */}
      {textRegions.length > 0 && !hoveredRegion && !editingRegion && (
        <div className="absolute top-4 left-4 bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-sm z-30">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm text-blue-700">
              {textRegions.length} text region{textRegions.length !== 1 ? 's' : ''} detected. Hover to preview, click to edit.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};