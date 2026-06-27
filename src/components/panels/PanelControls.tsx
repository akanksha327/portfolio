'use client';

import { Code2, PanelLeft, PanelRight, Terminal, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/stores/editor-store';
import { cn } from '@/lib/utils';

export function PanelControls() {
  const { 
    isEditorOpen, 
    isFloating, 
    isFocusMode,
    openEditor, 
    toggleFloating,
    toggleFocusMode 
  } = useEditorStore();

  return (
    <div className="p-2 space-y-2">
      {/* Section Title */}
      <div className="px-2 py-1.5">
        <span className="text-[10px] font-semibold text-[#8b949e] uppercase tracking-wider">
          Panel Controls
        </span>
      </div>

      {/* Closed Panels */}
      <div className="space-y-1">
        {/* Editor Button */}
        <Button
          variant="ghost"
          onClick={openEditor}
          className={cn(
            'w-full justify-start h-9 px-2 text-xs transition-all duration-200',
            isEditorOpen 
              ? 'bg-[#21262d] text-[#e6edf3] hover:bg-[#30363d]' 
              : 'bg-[#f85149]/10 text-[#f85149] hover:bg-[#f85149]/20 border border-[#f85149]/30'
          )}
        >
          <Code2 className="h-4 w-4 mr-2" />
          <span className="flex-1 text-left">
            {isEditorOpen ? 'Editor Open' : 'Open Editor'}
          </span>
          {!isEditorOpen && (
            <span className="text-[10px] bg-[#f85149] text-white px-1.5 py-0.5 rounded">
              Closed
            </span>
          )}
        </Button>

        {/* Float Button - Only show when editor is open */}
        {isEditorOpen && (
          <Button
            variant="ghost"
            onClick={toggleFloating}
            className={cn(
              'w-full justify-start h-9 px-2 text-xs transition-all duration-200',
              isFloating
                ? 'bg-[#ffa116]/10 text-[#ffa116] hover:bg-[#ffa116]/20 border border-[#ffa116]/30'
                : 'bg-transparent text-[#8b949e] hover:bg-[#21262d] hover:text-[#e6edf3]'
            )}
          >
            <PanelLeft className="h-4 w-4 mr-2" />
            <span className="flex-1 text-left">
              {isFloating ? 'Dock Editor' : 'Float Editor'}
            </span>
            {isFloating && (
              <span className="text-[10px] bg-[#ffa116] text-[#0d1117] px-1.5 py-0.5 rounded">
                Floating
              </span>
            )}
          </Button>
        )}

        {/* Focus Mode Button - Only show when editor is open and not floating */}
        {isEditorOpen && !isFloating && (
          <Button
            variant="ghost"
            onClick={toggleFocusMode}
            className={cn(
              'w-full justify-start h-9 px-2 text-xs transition-all duration-200',
              isFocusMode
                ? 'bg-[#3fb950]/10 text-[#3fb950] hover:bg-[#3fb950]/20 border border-[#3fb950]/30'
                : 'bg-transparent text-[#8b949e] hover:bg-[#21262d] hover:text-[#e6edf3]'
            )}
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            <span className="flex-1 text-left">
              {isFocusMode ? 'Exit Focus Mode' : 'Focus Mode'}
            </span>
            {isFocusMode && (
              <span className="text-[10px] bg-[#3fb950] text-[#0d1117] px-1.5 py-0.5 rounded">
                Active
              </span>
            )}
          </Button>
        )}
      </div>

      {/* Status Info */}
      {!isEditorOpen && (
        <div className="mt-3 p-2 rounded-lg bg-[#21262d]/50 border border-[#30363d]/50">
          <p className="text-[10px] text-[#8b949e]">
            The editor has been closed. Click &quot;Open Editor&quot; to restore it.
          </p>
        </div>
      )}

      {isFloating && (
        <div className="mt-3 p-2 rounded-lg bg-[#ffa116]/10 border border-[#ffa116]/20">
          <p className="text-[10px] text-[#ffa116]">
            Editor is floating. Drag the toolbar to move, drag edges to resize.
          </p>
        </div>
      )}

      {isFocusMode && (
        <div className="mt-3 p-2 rounded-lg bg-[#3fb950]/10 border border-[#3fb950]/20">
          <p className="text-[10px] text-[#3fb950]">
            Focus Mode active. Press Escape or click &quot;Exit Focus&quot; to return.
          </p>
        </div>
      )}
    </div>
  );
}
