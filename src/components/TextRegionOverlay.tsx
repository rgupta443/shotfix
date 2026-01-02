import React, { useState, useCallback } from 'react';
import { TextRegion } from '../lib/types/canvas';

interface TextRegionOverlayProps {
  textRegions: TextRegion[];
  onTextRegionClick: (region: TextRegion) => void;
  onTextRegionHover: (region: TextRegion | null) => void;
  scale?: number;
  offset?: { x: number; y: number };
  className?: string;
}

export const TextRegionOverlay: React.FC<TextRegionOverlayProps> = ({
  textRegions,
  onTextRegionClick,
  onTextRegionHover,
  scale = 1,
  offset = { x: 0, y: 0 },
  className = ''
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const handleMouseEnter = useCallback((region: TextRegion) => {
    setHoveredRegion(region.id);
    onTextRegionHover(region);
  }, [onTextRegionHover]);

  const handleMouseLeave = useCallback(() => {
    setHoveredRegion(null);
    onTextRegionHover(null);
  }, [onTextRegionHover]);

  const handleClick = useCallback((region: TextRegion) => {
    onTextRegionClick(region);
  }, [onTextRegionClick]);

  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ 
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
        transformOrigin: 'top left'
      }}
    >
      {textRegions.map((region) => {
        const isHovered = hoveredRegion === region.id;
        const isHighConfidence = region.confidence > 70;
        
        return (
          <div
            key={region.id}
            className={`
              absolute pointer-events-auto cursor-pointer transition-all duration-200
              ${isHovered 
                ? 'bg-blue-500/20 border-2 border-blue-500 shadow-lg' 
                : 'bg-transparent border border-transparent hover:bg-blue-500/10 hover:border-blue-400'
              }
              ${isHighConfidence ? 'border-opacity-80' : 'border-opacity-40'}
            `}
            style={{
              left: region.bounds.x,
              top: region.bounds.y,
              width: region.bounds.width,
              height: region.bounds.height,
              minWidth: '8px',
              minHeight: '8px'
            }}
            onMouseEnter={() => handleMouseEnter(region)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(region)}
            title={`Text: "${region.originalText}" (${Math.round(region.confidence)}% confidence)`}
          >
            {/* Visual indicator for text editability */}
            {isHovered && (
              <>
                {/* Corner indicators */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                
                {/* Text preview tooltip */}
                <div className="absolute -top-8 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                  {region.originalText.length > 20 
                    ? `${region.originalText.substring(0, 20)}...` 
                    : region.originalText
                  }
                  <span className="ml-2 text-gray-300">
                    ({Math.round(region.confidence)}%)
                  </span>
                </div>
              </>
            )}
            
            {/* Confidence indicator */}
            <div 
              className={`
                absolute top-0 right-0 w-1 h-full transition-opacity duration-200
                ${isHighConfidence ? 'bg-green-400' : 'bg-yellow-400'}
                ${isHovered ? 'opacity-100' : 'opacity-0'}
              `}
            />
          </div>
        );
      })}
    </div>
  );
};