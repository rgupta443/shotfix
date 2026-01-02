import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TextRegion } from '../lib/types/canvas';

interface InlineTextEditorProps {
  textRegion: TextRegion;
  onSave: (regionId: string, newText: string) => void;
  onCancel: () => void;
  scale?: number;
  offset?: { x: number; y: number };
  className?: string;
}

export const InlineTextEditor: React.FC<InlineTextEditorProps> = ({
  textRegion,
  onSave,
  onCancel,
  scale = 1,
  offset = { x: 0, y: 0 },
  className = ''
}) => {
  const [editedText, setEditedText] = useState(textRegion.editedText || textRegion.originalText);
  const [isEditing, setIsEditing] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Determine if we need a textarea (multi-line) or input (single-line)
  const isMultiLine = editedText.includes('\n') || editedText.length > 50;
  const currentRef = isMultiLine ? textareaRef : inputRef;

  useEffect(() => {
    // Focus and select text when component mounts
    if (currentRef.current) {
      currentRef.current.focus();
      currentRef.current.select();
    }
  }, [isMultiLine]);

  const handleSave = useCallback(() => {
    if (editedText.trim() !== textRegion.originalText.trim()) {
      onSave(textRegion.id, editedText.trim());
    } else {
      onCancel();
    }
    setIsEditing(false);
  }, [editedText, textRegion.id, textRegion.originalText, onSave, onCancel]);

  const handleCancel = useCallback(() => {
    setEditedText(textRegion.originalText);
    onCancel();
    setIsEditing(false);
  }, [textRegion.originalText, onCancel]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isMultiLine) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    } else if (e.key === 'Enter' && e.ctrlKey && isMultiLine) {
      e.preventDefault();
      handleSave();
    }
  }, [handleSave, handleCancel, isMultiLine]);

  const handleBlur = useCallback(() => {
    // Small delay to allow clicking save button
    setTimeout(() => {
      if (isEditing) {
        handleSave();
      }
    }, 150);
  }, [handleSave, isEditing]);

  if (!isEditing) {
    return null;
  }

  // Calculate font size based on region height
  const fontSize = Math.max(12, Math.min(24, textRegion.bounds.height * 0.6));
  
  const editorStyle = {
    left: textRegion.bounds.x + offset.x,
    top: textRegion.bounds.y + offset.y,
    width: Math.max(textRegion.bounds.width, 100),
    height: isMultiLine ? Math.max(textRegion.bounds.height, 60) : textRegion.bounds.height,
    fontSize: `${fontSize}px`,
    fontFamily: textRegion.fontStyle.family,
    fontWeight: textRegion.fontStyle.weight,
    transform: `scale(${scale})`,
    transformOrigin: 'top left'
  };

  return (
    <div 
      className={`absolute z-50 ${className}`}
      style={editorStyle}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-white border-2 border-blue-500 rounded shadow-lg" />
      
      {/* Text input */}
      {isMultiLine ? (
        <textarea
          ref={textareaRef}
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="absolute inset-1 bg-transparent border-none outline-none resize-none p-1"
          style={{
            fontSize: 'inherit',
            fontFamily: 'inherit',
            fontWeight: 'inherit',
            lineHeight: '1.2'
          }}
          placeholder="Enter text..."
        />
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="absolute inset-1 bg-transparent border-none outline-none p-1"
          style={{
            fontSize: 'inherit',
            fontFamily: 'inherit',
            fontWeight: 'inherit'
          }}
          placeholder="Enter text..."
        />
      )}
      
      {/* Action buttons */}
      <div className="absolute -bottom-8 left-0 flex space-x-1">
        <button
          onClick={handleSave}
          className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
          onMouseDown={(e) => e.preventDefault()} // Prevent blur
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
          onMouseDown={(e) => e.preventDefault()} // Prevent blur
        >
          Cancel
        </button>
      </div>
      
      {/* Keyboard shortcuts hint */}
      <div className="absolute -bottom-12 left-0 text-xs text-gray-500">
        {isMultiLine ? 'Ctrl+Enter to save, Esc to cancel' : 'Enter to save, Esc to cancel'}
      </div>
    </div>
  );
};