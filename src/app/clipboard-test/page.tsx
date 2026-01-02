'use client';

import React, { useEffect, useState } from 'react';

export default function ClipboardTestPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [clipboardSupported, setClipboardSupported] = useState(false);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    // Check clipboard API support
    const hasClipboardAPI = !!(navigator.clipboard && navigator.clipboard.read);
    setClipboardSupported(hasClipboardAPI);
    addLog(`Clipboard API supported: ${hasClipboardAPI}`);

    // Add paste event listener
    const handlePaste = (event: ClipboardEvent) => {
      addLog('Paste event detected');
      
      const clipboardData = event.clipboardData;
      if (!clipboardData) {
        addLog('No clipboard data available');
        return;
      }

      const items = Array.from(clipboardData.items);
      addLog(`Clipboard items: ${items.length}`);
      
      items.forEach((item, index) => {
        addLog(`Item ${index}: kind=${item.kind}, type=${item.type}`);
        
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            addLog(`Found image file: ${file.name}, size: ${file.size}, type: ${file.type}`);
            event.preventDefault();
          }
        }
      });
    };

    const handleKeydown = (event: KeyboardEvent) => {
      const isCtrlV = (event.ctrlKey || event.metaKey) && event.key === 'v';
      if (isCtrlV) {
        addLog('Ctrl+V / Cmd+V detected');
      }
    };

    document.addEventListener('paste', handlePaste);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  const testClipboardRead = async () => {
    try {
      addLog('Attempting to read clipboard...');
      const clipboardItems = await navigator.clipboard.read();
      addLog(`Clipboard items found: ${clipboardItems.length}`);
      
      for (const clipboardItem of clipboardItems) {
        addLog(`Clipboard item types: ${clipboardItem.types.join(', ')}`);
        
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            const blob = await clipboardItem.getType(type);
            addLog(`Found image blob: type=${blob.type}, size=${blob.size}`);
          }
        }
      }
    } catch (error) {
      addLog(`Clipboard read error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Clipboard Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Clipboard Support</h2>
          <p className="mb-4">
            Clipboard API supported: <span className={clipboardSupported ? 'text-green-600' : 'text-red-600'}>
              {clipboardSupported ? 'Yes' : 'No'}
            </span>
          </p>
          
          <button
            onClick={testClipboardRead}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!clipboardSupported}
          >
            Test Clipboard Read
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Copy an image to your clipboard (right-click an image and select "Copy image" or take a screenshot)</li>
            <li>Click in this area and press Ctrl+V (or Cmd+V on Mac)</li>
            <li>Check the logs below to see what happens</li>
            <li>You can also click the "Test Clipboard Read" button (requires user gesture)</li>
          </ol>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Event Logs</h2>
          <div className="bg-gray-50 rounded p-4 h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">No events logged yet. Try copying an image and pasting it here.</p>
            ) : (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <div key={index} className="text-sm font-mono">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={() => setLogs([])}
            className="mt-4 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
          >
            Clear Logs
          </button>
        </div>
      </div>
    </div>
  );
}