'use client';

import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface VideoPanelProps {
  expandedMode?: boolean;
}

export function VideoPanel({ expandedMode = false }: VideoPanelProps) {
  const [isLocalVideoOn, setIsLocalVideoOn] = useState(true);
  const [isLocalMicOn, setIsLocalMicOn] = useState(true);

  return (
    <div className="flex flex-col h-full w-full bg-[#161b22]">
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-3 bg-[#0d1117] border-b border-[#30363d] shrink-0",
        expandedMode ? "h-12" : "h-10"
      )}>
        <div className="flex items-center gap-2">
          <Video className={cn("text-[#ffa116]", expandedMode ? "h-4 w-4" : "h-3.5 w-3.5")} />
          <span className={cn("font-medium text-[#e6edf3]", expandedMode ? "text-sm" : "text-xs")}>
            Video Call
          </span>
        </div>
      </div>
      
      {/* Video Content - Scrollable */}
      <div className={cn(
        "flex-1 min-h-0 overflow-y-auto",
        expandedMode ? "p-4 space-y-4" : "p-3 space-y-3"
      )}>
        {/* Remote Video (Mentor) */}
        <div className="relative bg-[#0d1117] rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Avatar className={cn("mx-auto mb-2", expandedMode ? "h-16 w-16" : "h-12 w-12")}>
                <AvatarFallback className={cn(
                  "bg-[#30363d]",
                  expandedMode ? "text-base" : "text-sm"
                )}>SC</AvatarFallback>
              </Avatar>
              <span className={cn(
                "text-[#e6edf3]",
                expandedMode ? "text-sm" : "text-xs"
              )}>Sarah Chen</span>
              <span className={cn(
                "block text-[#8b949e]",
                expandedMode ? "text-xs" : "text-[10px]"
              )}>Mentor</span>
            </div>
          </div>
          {/* Name label */}
          <div className="absolute bottom-2 left-2 bg-[#0d1117]/80 px-2 py-0.5 rounded text-[10px] text-[#e6edf3]">
            Sarah Chen
          </div>
          {/* Online indicator */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#238636]/20 px-2 py-0.5 rounded">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3fb950]" />
            <span className="text-[10px] text-[#3fb950]">Live</span>
          </div>
        </div>

        {/* Local Video (You) */}
        <div className="relative bg-[#0d1117] rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Avatar className={cn("mx-auto mb-2", expandedMode ? "h-14 w-14" : "h-10 w-10")}>
                <AvatarFallback className={cn(
                  "bg-[#ffa116] text-[#0d1117]",
                  expandedMode ? "text-sm" : "text-xs"
                )}>AJ</AvatarFallback>
              </Avatar>
              <span className={cn(
                "text-[#e6edf3]",
                expandedMode ? "text-sm" : "text-xs"
              )}>You</span>
            </div>
          </div>
          {/* Name label */}
          <div className="absolute bottom-2 left-2 bg-[#0d1117]/80 px-2 py-0.5 rounded text-[10px] text-[#e6edf3]">
            You
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'rounded-full border-[#30363d]',
              expandedMode ? 'h-10 w-10' : 'h-8 w-8',
              isLocalMicOn ? 'bg-[#21262d] hover:bg-[#30363d]' : 'bg-[#f85149]/20 border-[#f85149]'
            )}
            onClick={() => setIsLocalMicOn(!isLocalMicOn)}
          >
            {isLocalMicOn ? (
              <Mic className={cn("text-[#e6edf3]", expandedMode ? "h-4 w-4" : "h-3.5 w-3.5")} />
            ) : (
              <MicOff className={cn("text-[#f85149]", expandedMode ? "h-4 w-4" : "h-3.5 w-3.5")} />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'rounded-full border-[#30363d]',
              expandedMode ? 'h-10 w-10' : 'h-8 w-8',
              isLocalVideoOn ? 'bg-[#21262d] hover:bg-[#30363d]' : 'bg-[#f85149]/20 border-[#f85149]'
            )}
            onClick={() => setIsLocalVideoOn(!isLocalVideoOn)}
          >
            {isLocalVideoOn ? (
              <Video className={cn("text-[#e6edf3]", expandedMode ? "h-4 w-4" : "h-3.5 w-3.5")} />
            ) : (
              <VideoOff className={cn("text-[#f85149]", expandedMode ? "h-4 w-4" : "h-3.5 w-3.5")} />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full bg-[#f85149] border-[#f85149] hover:bg-[#f85149]/80",
              expandedMode ? 'h-10 w-10' : 'h-8 w-8'
            )}
          >
            <PhoneOff className={cn("text-white", expandedMode ? "h-4 w-4" : "h-3.5 w-3.5")} />
          </Button>
        </div>
      </div>
    </div>
  );
}
