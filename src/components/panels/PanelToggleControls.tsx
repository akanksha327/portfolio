'use client';

import { MessageSquare, Video, MessageSquareOff, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/stores/editor-store';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function PanelToggleControls() {
  const { chatVisible, videoVisible, toggleChat, toggleVideo } = useEditorStore();

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {/* Chat Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className={cn(
                'h-7 w-7 transition-colors duration-200',
                chatVisible 
                  ? 'text-[#ffa116] hover:bg-[#ffa116]/10' 
                  : 'text-[#8b949e] hover:bg-[#21262d]'
              )}
            >
              {chatVisible ? (
                <MessageSquare className="h-4 w-4" />
              ) : (
                <MessageSquareOff className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
            {chatVisible ? 'Hide Chat' : 'Show Chat'}
          </TooltipContent>
        </Tooltip>

        {/* Video Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVideo}
              className={cn(
                'h-7 w-7 transition-colors duration-200',
                videoVisible 
                  ? 'text-[#ffa116] hover:bg-[#ffa116]/10' 
                  : 'text-[#8b949e] hover:bg-[#21262d]'
              )}
            >
              {videoVisible ? (
                <Video className="h-4 w-4" />
              ) : (
                <VideoOff className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
            {videoVisible ? 'Hide Video' : 'Show Video'}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

// Floating restore buttons - shown when panels are hidden
export function PanelRestoreButtons() {
  const { chatVisible, videoVisible, setChatVisible, setVideoVisible } = useEditorStore();

  // Only show if at least one panel is hidden
  if (chatVisible && videoVisible) return null;

  return (
    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
      {!chatVisible && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setChatVisible(true)}
          className="h-8 w-8 bg-[#161b22] border border-[#30363d] text-[#8b949e] hover:text-[#ffa116] hover:border-[#ffa116] shadow-lg"
          title="Restore Chat"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      )}
      {!videoVisible && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setVideoVisible(true)}
          className="h-8 w-8 bg-[#161b22] border border-[#30363d] text-[#8b949e] hover:text-[#ffa116] hover:border-[#ffa116] shadow-lg"
          title="Restore Video"
        >
          <Video className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
