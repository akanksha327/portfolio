'use client';

import { List, Plus } from 'lucide-react';
import { PanelHeader } from '@/components/panels/PanelHeader';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSessionStore, Session } from '@/stores/session-store';
import { useLayoutStore } from '@/stores/layout-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function SessionsPanel() {
  const { sessions, currentSession, setCurrentSession, activeSessionId, setActiveSessionId } = useSessionStore();
  const { setActiveTab } = useLayoutStore();

  const getStatusColor = (session: Session) => {
    // Only the activeSessionId is considered "active" (green dot)
    if (session.id === activeSessionId) {
      return 'bg-[#3fb950]';
    }
    // Otherwise use the session's stored status
    switch (session.status) {
      case 'pending':
        return 'bg-[#d29922]';
      case 'completed':
        return 'bg-[#8b949e]';
      default:
        return 'bg-[#8b949e]';
    }
  };

  const handleSessionClick = (session: Session) => {
    setCurrentSession(session);
    toast.success(`Switched to "${session.title}"`);
  };

  const handleJoinSession = (session: Session) => {
    // Set this session as the ONLY active session
    setActiveSessionId(session.id);
    setCurrentSession(session);
    setActiveTab('ide');
    toast.success(`Joining "${session.title}"...`);
  };

  return (
    <div className="flex flex-col h-full bg-[#161b22]">
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            const isSelected = currentSession?.id === session.id;
            
            return (
              <button
                key={session.id}
                onClick={() => handleSessionClick(session)}
                className={cn(
                  'w-full text-left p-3 rounded-lg transition-colors',
                  isSelected
                    ? 'bg-[#21262d] border border-[#ffa116]/30'
                    : 'hover:bg-[#21262d]/50 border border-transparent'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0', getStatusColor(session))} />
                  <span className="text-xs font-medium text-[#e6edf3] truncate text-left">
                    {session.title}
                  </span>
                </div>
                <p className="text-[10px] text-[#8b949e] pl-4 truncate text-left">
                  {session.mentor}
                </p>
                {/* Only show "Active now" for the ONE active session */}
                {isActive && (
                  <div className="mt-2 pl-4">
                    <span className="text-[10px] text-[#3fb950]">● Active now</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
