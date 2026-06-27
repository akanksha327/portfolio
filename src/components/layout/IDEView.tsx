'use client';

import { useState, useCallback, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { ChevronLeft, ChevronRight, ChevronDown, Terminal, X, Maximize2, Code2 } from 'lucide-react';
import { ParticipantsPanel } from '@/components/panels/ParticipantsPanel';
import { PanelControls } from '@/components/panels/PanelControls';
import { PanelToggleControls, PanelRestoreButtons } from '@/components/panels/PanelToggleControls';
import { MonacoEditor } from '@/components/editor/MonacoEditor';
import { FloatingEditor } from '@/components/editor/FloatingEditor';
import { FocusModeToolbar } from '@/components/editor/FocusModeToolbar';
import { OutputPanel } from '@/components/editor/OutputPanel';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { VideoPanel } from '@/components/chat/VideoPanel';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/stores/editor-store';
import { cn } from '@/lib/utils';

interface ResizeHandleProps {
  direction: 'horizontal' | 'vertical';
}

function ResizeHandle({ direction }: ResizeHandleProps) {
  return (
    <PanelResizeHandle
      className={cn(
        'group flex items-center justify-center transition-colors bg-transparent relative',
        direction === 'horizontal' 
          ? 'w-1.5 cursor-col-resize' 
          : 'h-2.5 cursor-row-resize'
      )}
    >
      <div
        className={cn(
          'transition-all duration-200 rounded-full absolute',
          direction === 'horizontal'
            ? 'w-0.5 h-12 bg-[#30363d] group-hover:bg-[#ffa116] group-hover:h-16 group-active:bg-[#ffa116]'
            : 'h-0.5 w-16 bg-[#30363d] group-hover:bg-[#ffa116] group-hover:w-24 group-active:bg-[#ffa116]'
        )}
      />
      <div
        className={cn(
          'absolute',
          direction === 'horizontal'
            ? 'inset-y-0 -inset-x-2'
            : 'inset-x-0 -inset-y-2'
        )}
      />
    </PanelResizeHandle>
  );
}

interface CollapseButtonProps {
  collapsed: boolean;
  direction: 'left' | 'right';
  onClick: () => void;
}

function CollapseButton({ collapsed, direction, onClick }: CollapseButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 z-20 h-10 w-4 rounded-sm bg-[#161b22] border border-[#30363d] hover:bg-[#21262d] hover:border-[#ffa116] transition-colors"
      style={{
        [direction === 'left' ? 'right' : 'left']: -8,
      }}
    >
      {direction === 'left' ? (
        collapsed ? <ChevronRight className="h-3 w-3 text-[#8b949e]" /> : <ChevronLeft className="h-3 w-3 text-[#8b949e]" />
      ) : (
        collapsed ? <ChevronLeft className="h-3 w-3 text-[#8b949e]" /> : <ChevronRight className="h-3 w-3 text-[#8b949e]" />
      )}
    </Button>
  );
}

export function IDEView() {
  const { 
    isEditorOpen, 
    isFloating, 
    isFocusMode, 
    setFocusMode, 
    openEditor,
    chatVisible,
    videoVisible 
  } = useEditorStore();
  
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [outputCollapsed, setOutputCollapsed] = useState(false);

  const toggleLeft = useCallback(() => {
    setLeftCollapsed(prev => !prev);
  }, []);

  const toggleOutput = useCallback(() => {
    setOutputCollapsed(prev => !prev);
  }, []);

  // Determine if right panel should be shown
  const showRightPanel = chatVisible || videoVisible;

  // Handle Escape key to exit focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) {
        setFocusMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode, setFocusMode]);

  // Determine layout mode
  const isCommunicationMode = !isEditorOpen || isFloating;
  const showEditor = isEditorOpen && !isFloating;
  const showOutput = showEditor && !outputCollapsed;

  // Focus Mode - Full screen editor
  if (isFocusMode && isEditorOpen) {
    return (
      <div className="h-full w-full overflow-hidden bg-[#0d1117]">
        <FocusModeToolbar />
        <MonacoEditor />
        <OutputPanel />
      </div>
    );
  }

  // ========== COMMUNICATION MODE (Editor Floating or Closed) ==========
  if (isCommunicationMode) {
    return (
      <div className="h-full w-full overflow-hidden bg-[#0d1117]">
        <PanelGroup direction="horizontal" className="h-full">
          
          {/* Left Sidebar - Participants */}
          {!leftCollapsed && (
            <>
              <Panel defaultSize={20} minSize={15} maxSize={30}>
                <div className="h-full w-full bg-[#161b22] border-r border-[#30363d] flex flex-col">
                  {/* Header */}
                  <div className="flex items-center gap-2 px-3 h-10 bg-[#0d1117] border-b border-[#30363d] shrink-0">
                    <span className="text-xs font-medium text-[#e6edf3]">Participants</span>
                  </div>
                  
                  {/* Panel Controls - Show when editor is closed */}
                  {!isEditorOpen && (
                    <div className="border-b border-[#30363d]">
                      <PanelControls />
                    </div>
                  )}
                  
                  {/* Users Content */}
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <ParticipantsPanel />
                  </div>
                </div>
              </Panel>
              <ResizeHandle direction="horizontal" />
            </>
          )}

          {/* Chat + Video - EXPANDED (if visible) */}
          {showRightPanel ? (
            <Panel defaultSize={leftCollapsed ? 100 : 80} minSize={50}>
              <div className="h-full w-full relative flex flex-col">
                {/* Left collapse toggle */}
                <CollapseButton
                  collapsed={leftCollapsed}
                  direction="left"
                  onClick={toggleLeft}
                />
                
                {/* Communication Layout Label */}
                <div className="flex items-center justify-between px-3 h-10 bg-[#0d1117] border-b border-[#30363d] shrink-0">
                  <div className="flex items-center gap-2">
                    {isFloating ? (
                      <>
                        <Code2 className="h-4 w-4 text-[#ffa116]" />
                        <span className="text-xs font-medium text-[#e6edf3]">Discussion Mode</span>
                        <span className="text-[10px] text-[#8b949e] ml-2">(Editor floating)</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs font-medium text-[#e6edf3]">Communication Mode</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <PanelToggleControls />
                    {!isEditorOpen && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openEditor}
                        className="h-7 px-3 text-xs bg-transparent border-[#30363d] text-[#e6edf3] hover:bg-[#21262d]"
                      >
                        <Maximize2 className="h-3 w-3 mr-1.5" />
                        Open Editor
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Chat + Video - Dynamic Layout */}
                {chatVisible && videoVisible ? (
                  // Both visible - Split with flex (no nested PanelGroup)
                  <div className="flex-1 min-h-0 flex flex-col">
                    {/* Chat Section */}
                    <div className="h-1/2 min-h-0 border-b border-[#30363d] overflow-hidden">
                      <ChatPanel expandedMode />
                    </div>
                    {/* Video Section */}
                    <div className="h-1/2 min-h-0 overflow-hidden">
                      <VideoPanel expandedMode />
                    </div>
                  </div>
                ) : chatVisible ? (
                  // Chat only - Full height
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <ChatPanel expandedMode />
                  </div>
                ) : videoVisible ? (
                  // Video only - Full height
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <VideoPanel expandedMode />
                  </div>
                ) : null}

                {/* Restore buttons when panels hidden */}
                <PanelRestoreButtons />
              </div>
            </Panel>
          ) : (
            // No panels visible - Show empty state with restore buttons
            <Panel defaultSize={leftCollapsed ? 100 : 80} minSize={50}>
              <div className="h-full w-full relative flex flex-col items-center justify-center bg-[#0d1117]">
                <CollapseButton
                  collapsed={leftCollapsed}
                  direction="left"
                  onClick={toggleLeft}
                />
                
                <div className="text-center max-w-md p-8">
                  <div className="w-16 h-16 rounded-full bg-[#21262d] flex items-center justify-center mx-auto mb-4">
                    <X className="h-8 w-8 text-[#8b949e]" />
                  </div>
                  <h3 className="text-lg font-medium text-[#e6edf3] mb-2">
                    No Panels Visible
                  </h3>
                  <p className="text-sm text-[#8b949e] mb-4">
                    All communication panels are hidden. Use the buttons below to restore them.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => useEditorStore.getState().setChatVisible(true)}
                      className="bg-transparent border-[#30363d] text-[#e6edf3] hover:bg-[#21262d]"
                    >
                      <Code2 className="h-4 w-4 mr-2" />
                      Show Chat
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => useEditorStore.getState().setVideoVisible(true)}
                      className="bg-transparent border-[#30363d] text-[#e6edf3] hover:bg-[#21262d]"
                    >
                      <Code2 className="h-4 w-4 mr-2" />
                      Show Video
                    </Button>
                  </div>
                </div>

                <PanelRestoreButtons />
              </div>
            </Panel>
          )}
        </PanelGroup>

        {/* Floating Editor - Above everything */}
        {isFloating && isEditorOpen && <FloatingEditor />}
      </div>
    );
  }

  // ========== FULL IDE MODE (Editor Active) ==========
  return (
    <div className="h-full w-full overflow-hidden bg-[#0d1117]">
      <PanelGroup direction="horizontal" className="h-full">
        
        {/* Left Sidebar - Participants */}
        {!leftCollapsed && (
          <>
            <Panel defaultSize={15} minSize={10} maxSize={25}>
              <div className="h-full w-full bg-[#161b22] border-r border-[#30363d] flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-2 px-3 h-10 bg-[#0d1117] border-b border-[#30363d] shrink-0">
                  <span className="text-xs font-medium text-[#e6edf3]">Participants</span>
                </div>
                
                {/* Users Content */}
                <div className="flex-1 min-h-0 overflow-hidden">
                  <ParticipantsPanel />
                </div>
              </div>
            </Panel>
            <ResizeHandle direction="horizontal" />
          </>
        )}

        {/* Center - Editor + Output */}
        <Panel 
          defaultSize={leftCollapsed && showRightPanel ? 55 : leftCollapsed ? 100 : showRightPanel ? 55 : 85} 
          minSize={40}
        >
          <div className="h-full w-full relative flex flex-col">
            {/* Left collapse toggle */}
            <CollapseButton
              collapsed={leftCollapsed}
              direction="left"
              onClick={toggleLeft}
            />
            
            {/* Editor + Output */}
            <PanelGroup direction="vertical" className="h-full">
              {/* Code Editor */}
              <Panel defaultSize={outputCollapsed ? 100 : 72} minSize={40}>
                <div className="h-full w-full overflow-hidden">
                  <MonacoEditor />
                </div>
              </Panel>

              {/* Output Panel - ONLY if editor exists */}
              {showOutput && (
                <>
                  <ResizeHandle direction="vertical" />
                  <Panel defaultSize={28} minSize={15} maxSize={40}>
                    <div className="h-full w-full bg-[#161b22] border-t border-[#30363d] flex flex-col">
                      {/* Output Header */}
                      <div className="flex items-center justify-between px-3 h-9 bg-[#0d1117] border-b border-[#30363d] shrink-0">
                        <div className="flex items-center gap-2">
                          <Terminal className="h-3.5 w-3.5 text-[#8b949e]" />
                          <span className="text-xs font-medium text-[#e6edf3]">Output</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleOutput}
                          className="h-6 w-6 hover:bg-[#30363d]"
                          title="Minimize output"
                        >
                          <ChevronDown className="h-3 w-3 text-[#8b949e]" />
                        </Button>
                      </div>
                      <div className="flex-1 min-h-0 overflow-hidden">
                        <OutputPanel />
                      </div>
                    </div>
                  </Panel>
                </>
              )}
            </PanelGroup>

            {/* Output collapsed - show expand button */}
            {outputCollapsed && (
              <div className="absolute bottom-0 left-0 right-0 h-8 flex items-center justify-center border-t border-[#30363d] bg-[#161b22]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleOutput}
                  className="h-6 px-3 text-xs text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
                >
                  <Terminal className="h-3 w-3 mr-1.5" />
                  Show Output
                </Button>
              </div>
            )}

            {/* Right collapse toggle - only show if right panel is visible */}
            {showRightPanel && (
              <CollapseButton
                collapsed={false}
                direction="right"
                onClick={() => {
                  useEditorStore.getState().setChatVisible(false);
                  useEditorStore.getState().setVideoVisible(false);
                }}
              />
            )}
          </div>
        </Panel>

        {/* Right Sidebar - Chat + Video (Dynamic) */}
        {showRightPanel && (
          <>
            <ResizeHandle direction="horizontal" />
            <Panel defaultSize={22} minSize={18} maxSize={35}>
              <div className="h-full w-full bg-[#161b22] border-l border-[#30363d] flex flex-col relative">
                {/* Panel Toggle Controls in Header */}
                <div className="flex items-center justify-between px-3 h-10 bg-[#0d1117] border-b border-[#30363d] shrink-0">
                  <span className="text-xs font-medium text-[#e6edf3]">
                    {chatVisible && videoVisible ? 'Chat & Video' : chatVisible ? 'Chat' : 'Video'}
                  </span>
                  <PanelToggleControls />
                </div>
                
                {/* Dynamic Content Based on Visibility */}
                {chatVisible && videoVisible ? (
                  // Both visible - Split with flex (no nested PanelGroup)
                  <div className="flex-1 min-h-0 flex flex-col">
                    {/* Chat Section */}
                    <div className="h-1/2 min-h-0 border-b border-[#30363d] overflow-hidden">
                      <ChatPanel />
                    </div>
                    {/* Video Section */}
                    <div className="h-1/2 min-h-0 overflow-hidden">
                      <VideoPanel />
                    </div>
                  </div>
                ) : chatVisible ? (
                  // Chat only - Full height
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <ChatPanel />
                  </div>
                ) : videoVisible ? (
                  // Video only - Full height
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <VideoPanel />
                  </div>
                ) : null}

                {/* Restore buttons */}
                <PanelRestoreButtons />
              </div>
            </Panel>
          </>
        )}

        {/* Quick restore buttons when right panel is completely hidden */}
        {!showRightPanel && (
          <PanelRestoreButtons />
        )}
      </PanelGroup>
    </div>
  );
}
