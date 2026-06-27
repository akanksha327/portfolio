'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Play, Circle, Code2, X, Maximize2, Pin, PinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSessionStore } from '@/stores/session-store';
import { useEditorStore } from '@/stores/editor-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Dynamically import Monaco Editor with SSR disabled
const Editor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-[#ffa116] border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-[#8b949e] text-sm">Loading editor...</p>
        </div>
      </div>
    )
  }
);

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
];

const DEFAULT_CODES: Record<string, string> = {
  javascript: `/**
 * Problem: Binary Search
 * Find target in a sorted array with O(log n) complexity
 */
function binarySearch(arr, target) {
  // Write your code here
  
}

const arr = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(binarySearch(arr, 7)); // Expected: 3
console.log(binarySearch(arr, 4)); // Expected: -1
`,
  typescript: `function binarySearch(arr: number[], target: number): number {
  // Write your code here
  
}

const arr: number[] = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(binarySearch(arr, 7)); // Expected: 3
`,
  python: `def binary_search(arr, target):
    # Write your code here
    pass

arr = [1, 3, 5, 7, 9, 11, 13, 15]
print(binary_search(arr, 7))  # Expected: 3
`,
  java: `public class Solution {
    public static int binarySearch(int[] arr, int target) {
        // Write your code here
        return -1;
    }
}`,
  cpp: `int binarySearch(const vector<int>& arr, int target) {
    // Write your code here
    return -1;
}`,
  go: `func binarySearch(arr []int, target int) int {
    // Write your code here
    return -1
}`,
  rust: `fn binary_search(arr: &[i32], target: i32) -> i32 {
    // Write your code here
    -1
}`,
};

export function FloatingEditor() {
  const editorRef = useRef<unknown>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { code, language, setCode, setLanguage, isRunning, setOutput, setIsRunning } = useSessionStore();
  const { 
    floatingPosition, 
    updateFloatingPosition, 
    setFloating, 
    setFocusMode,
    closeEditor 
  } = useEditorStore();
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [isPinned, setIsPinned] = useState(true);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });

  const handleEditorMount = useCallback((editor: unknown) => {
    editorRef.current = editor;
  }, []);

  const handleRunCode = useCallback(async () => {
    setIsRunning(true);
    setOutput('');
    
    try {
      const response = await fetch('/api/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      
      const result = await response.json();
      
      if (result.error) {
        setOutput(`Error: ${result.error}`);
        toast.error('Execution failed');
      } else {
        setOutput(result.output || 'No output');
        toast.success('Code executed successfully!');
      }
    } catch {
      setOutput('Error: Failed to execute code. Please try again.');
      toast.error('Execution failed');
    } finally {
      setIsRunning(false);
    }
  }, [code, language, setOutput, setIsRunning]);

  const handleLanguageChange = useCallback((newLang: string) => {
    setLanguage(newLang);
    setCode(DEFAULT_CODES[newLang] || '');
  }, [setLanguage, setCode]);

  // Drag handlers
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, select, [role="combobox"]')) return;
    
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: floatingPosition.x,
      posY: floatingPosition.y,
    };
  }, [floatingPosition]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      updateFloatingPosition({
        x: Math.max(0, dragStartRef.current.posX + deltaX),
        y: Math.max(0, dragStartRef.current.posY + deltaY),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, updateFloatingPosition]);

  // Resize handlers
  const handleResizeStart = useCallback((e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: floatingPosition.width,
      height: floatingPosition.height,
      posX: floatingPosition.x,
      posY: floatingPosition.y,
    };
  }, [floatingPosition]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;
      const { width, height, posX, posY } = resizeStartRef.current;

      let newWidth = width;
      let newHeight = height;
      let newX = posX;
      let newY = posY;

      if (resizeDirection.includes('e')) {
        newWidth = Math.max(400, width + deltaX);
      }
      if (resizeDirection.includes('w')) {
        const maxDelta = width - 400;
        const actualDelta = Math.min(deltaX, maxDelta);
        newWidth = width - actualDelta;
        newX = posX + actualDelta;
      }
      if (resizeDirection.includes('s')) {
        newHeight = Math.max(300, height + deltaY);
      }
      if (resizeDirection.includes('n')) {
        const maxDelta = height - 300;
        const actualDelta = Math.min(deltaY, maxDelta);
        newHeight = height - actualDelta;
        newY = posY + actualDelta;
      }

      updateFloatingPosition({
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection('');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeDirection, updateFloatingPosition]);

  const beforeMount = useCallback((monaco: any) => {
    monaco.editor.defineTheme('mentorship-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '8b949e', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ffa116' },
        { token: 'string', foreground: 'a5d6ff' },
        { token: 'number', foreground: '79c0ff' },
        { token: 'type', foreground: 'ffa116' },
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#e6edf3',
        'editor.lineHighlightBackground': '#161b22',
        'editorLineNumber.foreground': '#484f58',
        'editorLineNumber.activeForeground': '#e6edf3',
        'editor.selectionBackground': '#264f78',
        'editorCursor.foreground': '#ffa116',
        'editorIndentGuide.background': '#21262d',
      },
    });
  }, []);

  const handleDock = useCallback(() => {
    setFloating(false);
    toast.success('Editor docked');
  }, [setFloating]);

  const handleEnterFocusMode = useCallback(() => {
    setFocusMode(true);
    setFloating(false);
    toast.info('Entered Focus Mode');
  }, [setFocusMode, setFloating]);

  const handleClose = useCallback(() => {
    closeEditor();
    toast.info('Editor closed');
  }, [closeEditor]);

  const togglePin = useCallback(() => {
    setIsPinned(prev => !prev);
    toast.info(isPinned ? 'Editor unpinned' : 'Editor pinned');
  }, [isPinned]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'fixed flex flex-col bg-[#161b22] border border-[#30363d] shadow-2xl transition-shadow duration-200',
        isDragging && 'cursor-grabbing',
        isResizing && 'cursor-nwse-resize'
      )}
      style={{
        left: floatingPosition.x,
        top: floatingPosition.y,
        width: floatingPosition.width,
        height: floatingPosition.height,
        zIndex: isPinned ? 9999 : 100,
      }}
    >
      {/* Resize handles */}
      <div
        className="absolute top-0 left-0 w-2 h-full cursor-ew-resize"
        onMouseDown={(e) => handleResizeStart(e, 'w')}
      />
      <div
        className="absolute top-0 right-0 w-2 h-full cursor-ew-resize"
        onMouseDown={(e) => handleResizeStart(e, 'e')}
      />
      <div
        className="absolute top-0 left-0 w-full h-2 cursor-ns-resize"
        onMouseDown={(e) => handleResizeStart(e, 'n')}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize"
        onMouseDown={(e) => handleResizeStart(e, 's')}
      />
      <div
        className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize"
        onMouseDown={(e) => handleResizeStart(e, 'nw')}
      />
      <div
        className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize"
        onMouseDown={(e) => handleResizeStart(e, 'ne')}
      />
      <div
        className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize"
        onMouseDown={(e) => handleResizeStart(e, 'sw')}
      />
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
        onMouseDown={(e) => handleResizeStart(e, 'se')}
      />

      {/* Toolbar - Draggable area */}
      <div
        className="flex items-center justify-between px-3 h-10 bg-[#161b22] border-b border-[#30363d] shrink-0 cursor-grab select-none"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-2">
          {/* Mac-style controls */}
          <div className="flex items-center gap-2 pr-3 border-r border-[#30363d]">
            <button
              onClick={handleClose}
              className="window-control window-control-close"
              title="Close editor"
            />
            <button
              onClick={handleDock}
              className="window-control window-control-minimize"
              title="Dock editor"
            />
            <button
              onClick={handleEnterFocusMode}
              className="window-control window-control-maximize"
              title="Enter focus mode"
            />
          </div>
          
          <Code2 className="h-4 w-4 text-[#8b949e]" />
          
          {/* Language Selector */}
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[100px] h-7 bg-[#21262d] border-[#30363d] text-xs text-[#e6edf3] hover:bg-[#30363d]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1c2128] border-[#30363d]">
              {LANGUAGES.map((lang) => (
                <SelectItem
                  key={lang.value}
                  value={lang.value}
                  className="text-xs text-[#e6edf3] hover:bg-[#21262d] focus:bg-[#21262d]"
                >
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          {/* Pin toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePin}
            className="h-7 w-7 hover:bg-[#21262d]"
            title={isPinned ? 'Unpin' : 'Pin on top'}
          >
            {isPinned ? (
              <PinOff className="h-3.5 w-3.5 text-[#ffa116]" />
            ) : (
              <Pin className="h-3.5 w-3.5 text-[#8b949e]" />
            )}
          </Button>
          
          {/* Run button */}
          <Button
            onClick={handleRunCode}
            disabled={isRunning}
            className="h-7 px-3 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-medium"
          >
            {isRunning ? (
              <>
                <Circle className="h-3 w-3 mr-1 animate-pulse fill-current" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-3 w-3 mr-1 fill-current" />
                Run
              </>
            )}
          </Button>
          
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-7 w-7 hover:bg-[#f85149]/20"
            title="Close"
          >
            <X className="h-3.5 w-3.5 text-[#8b949e] hover:text-[#f85149]" />
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0 bg-[#0d1117]">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorMount}
          beforeMount={beforeMount}
          theme="mentorship-dark"
          loading={
            <div className="h-full w-full bg-[#0d1117] flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-2 border-[#ffa116] border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-[#8b949e] text-sm">Loading editor...</p>
              </div>
            </div>
          }
          options={{
            fontSize: 13,
            fontFamily: 'Geist Mono, Consolas, Monaco, monospace',
            lineHeight: 22,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            tabSize: 2,
            wordWrap: 'on',
            automaticLayout: true,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        />
      </div>
    </div>
  );
}
