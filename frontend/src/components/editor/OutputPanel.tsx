'use client';

import { Terminal, CheckCircle, XCircle, Clock, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSessionStore } from '@/stores/session-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function OutputPanel() {
  const { output, isRunning, setOutput } = useSessionStore();

  const getStatus = () => {
    if (isRunning) return { icon: Clock, text: 'Running...', color: 'text-[#d29922]' };
    if (!output) return { icon: Terminal, text: 'Ready', color: 'text-[#8b949e]' };
    if (output.includes('Error')) return { icon: XCircle, text: 'Error', color: 'text-[#f85149]' };
    return { icon: CheckCircle, text: 'Completed', color: 'text-[#3fb950]' };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      toast.success('Output copied to clipboard');
    }
  };

  const handleClear = () => {
    setOutput('');
    toast.info('Output cleared');
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117]">
      {/* Status Bar - Compact */}
      <div className="flex items-center justify-between px-3 h-8 border-b border-[#30363d] shrink-0 bg-[#161b22]">
        <div className={cn('flex items-center gap-1.5 text-xs', status.color)}>
          <StatusIcon className={cn('h-3.5 w-3.5', isRunning && 'animate-pulse')} />
          <span>{status.text}</span>
        </div>
        {output && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-5 w-5 hover:bg-[#30363d]"
              title="Copy output"
            >
              <Copy className="h-3 w-3 text-[#8b949e]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-5 w-5 hover:bg-[#30363d]"
              title="Clear output"
            >
              <Trash2 className="h-3 w-3 text-[#8b949e]" />
            </Button>
          </div>
        )}
      </div>
      
      {/* Output Content - Scrollable */}
      <div className="flex-1 overflow-auto p-3">
        <div className="font-mono text-sm leading-relaxed min-h-full">
          {isRunning ? (
            <div className="flex items-center gap-3 text-[#8b949e]">
              <Clock className="h-4 w-4 animate-spin" />
              <span>Executing code...</span>
            </div>
          ) : output ? (
            <pre className="text-[#e6edf3] whitespace-pre-wrap">
              {output}
            </pre>
          ) : (
            <div className="text-center py-6">
              <Terminal className="h-6 w-6 mx-auto mb-2 text-[#30363d]" />
              <p className="text-[#8b949e] text-sm mb-1">No output yet</p>
              <p className="text-[#6e7681] text-xs">Click Run to execute your code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
