'use client';

import { Crown, LogOut, StopCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useSessionStore } from '@/stores/session-store';
import { cn } from '@/lib/utils';

export function ParticipantsPanel() {
  const { currentSession, user, setActiveSessionId, setCurrentSession } = useSessionStore();

  // Build participants list based on current session
  const participants = [
    { 
      id: 'mentor', 
      name: currentSession?.mentor || 'Sarah Chen', 
      role: 'mentor' as const, 
      online: true,
      isYou: false,
    },
    { 
      id: 'student', 
      name: user.name, 
      role: 'student' as const, 
      online: true,
      isYou: true,
    },
  ];

  // Handle leave session (for students)
  const handleLeaveSession = () => {
    setActiveSessionId(null);
    setCurrentSession(null);
  };

  // Handle end session (for mentors)
  const handleEndSession = () => {
    setActiveSessionId(null);
    setCurrentSession(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#161b22]">
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="p-3 rounded-lg bg-[#21262d]/50 border border-[#30363d]/50"
            >
              {/* Participant info */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={cn(
                      'text-sm',
                      participant.role === 'mentor' ? 'bg-[#ffa116] text-[#0d1117]' : 'bg-[#30363d] text-[#e6edf3]'
                    )}>
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {participant.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#3fb950] rounded-full border-2 border-[#21262d]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-[#e6edf3] truncate">
                      {participant.name}
                    </span>
                    {participant.role === 'mentor' && (
                      <Crown className="h-3.5 w-3.5 text-[#ffa116]" />
                    )}
                    {participant.isYou && (
                      <span className="text-[10px] text-[#8b949e]">(You)</span>
                    )}
                  </div>
                  <span className="text-xs text-[#8b949e] capitalize">{participant.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Action button at the bottom */}
      <div className="p-3 border-t border-[#30363d]">
        {user.role === 'student' ? (
          <Button
            variant="outline"
            onClick={handleLeaveSession}
            className="w-full h-9 text-xs bg-transparent border-[#f85149]/30 text-[#f85149] hover:bg-[#f85149]/10 hover:border-[#f85149]/50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Leave Session
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={handleEndSession}
            className="w-full h-9 text-xs bg-transparent border-[#f85149]/30 text-[#f85149] hover:bg-[#f85149]/10 hover:border-[#f85149]/50"
          >
            <StopCircle className="h-4 w-4 mr-2" />
            End Session
          </Button>
        )}
      </div>
    </div>
  );
}
