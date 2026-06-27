'use client';

import { Play, Circle, X, Minimize2, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSessionStore } from '@/stores/session-store';
import { useEditorStore } from '@/stores/editor-store';
import { toast } from 'sonner';

export function FocusModeToolbar() {
  const { code, language, isRunning, setOutput, setIsRunning } = useSessionStore();
  const { setFocusMode } = useEditorStore();

  const handleRunCode = async () => {
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
  };

  const handleExitFocusMode = () => {
    setFocusMode(false);
    toast.info('Exited Focus Mode');
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex items-center gap-2 p-2 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl">
      <div className="flex items-center gap-2 pr-2 border-r border-[#30363d]">
        <Code2 className="h-4 w-4 text-[#ffa116]" />
        <span className="text-xs font-medium text-[#e6edf3] capitalize">{language}</span>
      </div>
      
      <Button
        onClick={handleRunCode}
        disabled={isRunning}
        className="h-8 px-3 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-medium"
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
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleExitFocusMode}
        className="h-8 px-3 bg-transparent border-[#30363d] text-[#e6edf3] hover:bg-[#21262d] hover:text-[#e6edf3]"
      >
        <Minimize2 className="h-3.5 w-3.5 mr-1.5" />
        Exit Focus
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleExitFocusMode}
        className="h-8 w-8 hover:bg-[#f85149]/20"
        title="Exit Focus Mode"
      >
        <X className="h-4 w-4 text-[#8b949e] hover:text-[#f85149]" />
      </Button>
    </div>
  );
}
