'use client';

import { useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Play, Circle, Code2 } from 'lucide-react';
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

// Boilerplate code templates - Only starter code, NO solutions!
const DEFAULT_CODES: Record<string, string> = {
  javascript: `/**
 * Problem: Binary Search
 * Find target in a sorted array with O(log n) complexity
 * 
 * @param {number[]} arr - Sorted array of numbers
 * @param {number} target - Value to find
 * @return {number} - Index of target, or -1 if not found
 */
function binarySearch(arr, target) {
  // Write your code here
  
}

// Test your solution
const arr = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(binarySearch(arr, 7)); // Expected: 3
console.log(binarySearch(arr, 4)); // Expected: -1
`,
  typescript: `/**
 * Problem: Binary Search
 * Find target in a sorted array with O(log n) complexity
 */
function binarySearch(arr: number[], target: number): number {
  // Write your code here
  
}

// Test your solution
const arr: number[] = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(binarySearch(arr, 7)); // Expected: 3
console.log(binarySearch(arr, 4)); // Expected: -1
`,
  python: `# Problem: Binary Search
# Find target in a sorted array with O(log n) complexity

def binary_search(arr, target):
    """
    Find target in sorted array.
    
    Args:
        arr: Sorted list of numbers
        target: Value to find
    
    Returns:
        Index of target, or -1 if not found
    """
    # Write your code here
    pass

# Test your solution
arr = [1, 3, 5, 7, 9, 11, 13, 15]
print(binary_search(arr, 7))  # Expected: 3
print(binary_search(arr, 4))  # Expected: -1
`,
  java: `// Problem: Binary Search
// Find target in a sorted array with O(log n) complexity

public class Solution {
    /**
     * Find target in sorted array.
     * @param arr Sorted array of integers
     * @param target Value to find
     * @return Index of target, or -1 if not found
     */
    public static int binarySearch(int[] arr, int target) {
        // Write your code here
        return -1;
    }
    
    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 7, 9, 11, 13, 15};
        System.out.println(binarySearch(arr, 7)); // Expected: 3
        System.out.println(binarySearch(arr, 4)); // Expected: -1
    }
}
`,
  cpp: `// Problem: Binary Search
// Find target in a sorted array with O(log n) complexity

#include <iostream>
#include <vector>
using namespace std;

int binarySearch(const vector<int>& arr, int target) {
    // Write your code here
    return -1;
}

int main() {
    vector<int> arr = {1, 3, 5, 7, 9, 11, 13, 15};
    cout << binarySearch(arr, 7) << endl; // Expected: 3
    cout << binarySearch(arr, 4) << endl; // Expected: -1
    return 0;
}
`,
  go: `// Problem: Binary Search
// Find target in a sorted array with O(log n) complexity

package main

import "fmt"

func binarySearch(arr []int, target int) int {
    // Write your code here
    return -1
}

func main() {
    arr := []int{1, 3, 5, 7, 9, 11, 13, 15}
    fmt.Println(binarySearch(arr, 7)) // Expected: 3
    fmt.Println(binarySearch(arr, 4)) // Expected: -1
}
`,
  rust: `// Problem: Binary Search
// Find target in a sorted array with O(log n) complexity

fn binary_search(arr: &[i32], target: i32) -> i32 {
    // Write your code here
    -1
}

fn main() {
    let arr = vec![1, 3, 5, 7, 9, 11, 13, 15];
    println!("{}", binary_search(&arr, 7)); // Expected: 3
    println!("{}", binary_search(&arr, 4)); // Expected: -1
}
`,
};

interface MonacoEditorProps {
  className?: string;
}

export function MonacoEditor({ className }: MonacoEditorProps) {
  const editorRef = useRef<unknown>(null);
  const { code, language, setCode, setLanguage, isRunning, setOutput, setIsRunning } = useSessionStore();
  const { closeEditor, setFloating, toggleFocusMode } = useEditorStore();

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
        'editor.inactiveSelectionBackground': '#264f7850',
        'editorCursor.foreground': '#ffa116',
        'editorIndentGuide.background': '#21262d',
        'editorIndentGuide.activeBackground': '#30363d',
      },
    });
  }, []);

  // Mac control handlers
  const handleClose = useCallback(() => {
    closeEditor();
    toast.info('Editor closed');
  }, [closeEditor]);

  const handleFloat = useCallback(() => {
    setFloating(true);
    toast.info('Editor floating');
  }, [setFloating]);

  const handleFocusMode = useCallback(() => {
    toggleFocusMode();
    toast.info('Entered Focus Mode');
  }, [toggleFocusMode]);

  return (
    <div className={cn('flex flex-col h-full w-full bg-[#0d1117]', className)}>
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-3 h-10 bg-[#161b22] border-b border-[#30363d] shrink-0">
        <div className="flex items-center gap-2">
          {/* Mac-style controls */}
          <div className="flex items-center gap-2 pr-3 border-r border-[#30363d]">
            {/* Close Button - Red */}
            <button
              onClick={handleClose}
              className="window-control window-control-close group"
              title="Close editor"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[#0d1117] text-[10px] font-bold">×</span>
            </button>
            
            {/* Minimize Button - Yellow (Float) */}
            <button
              onClick={handleFloat}
              className="window-control window-control-minimize group"
              title="Float editor"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[#0d1117] text-[10px] font-bold">−</span>
            </button>
            
            {/* Maximize Button - Green (Focus Mode) */}
            <button
              onClick={handleFocusMode}
              className="window-control window-control-maximize group"
              title="Focus mode"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[#0d1117] text-[10px] font-bold">+</span>
            </button>
          </div>
          
          <Code2 className="h-4 w-4 text-[#8b949e]" />
          
          {/* Language Selector */}
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[120px] h-7 bg-[#21262d] border-[#30363d] text-xs text-[#e6edf3] hover:bg-[#30363d]">
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

        <div className="flex items-center gap-2">
          <Button
            onClick={handleRunCode}
            disabled={isRunning}
            className="h-7 px-4 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-medium"
          >
            {isRunning ? (
              <>
                <Circle className="h-3 w-3 mr-1.5 animate-pulse fill-current" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-3 w-3 mr-1.5 fill-current" />
                Run
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0">
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
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            bracketPairColorization: { enabled: true },
          }}
        />
      </div>
    </div>
  );
}
