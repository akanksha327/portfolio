'use client';

import { Clock, Play, CheckCircle, Copy, Eye, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Session, useSessionStore } from '@/stores/session-store';
import { useLayoutStore } from '@/stores/layout-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SessionCardProps {
  session: Session;
}

export function SessionCard({ session }: SessionCardProps) {
  const { setCurrentSession, activeSessionId, setActiveSessionId } = useSessionStore();
  const { setActiveTab } = useLayoutStore();

  // Determine if this is the ONE active session
  const isActive = session.id === activeSessionId;

  const statusConfig = {
    active: {
      icon: <Play className="h-3 w-3" />,
      label: 'Active',
      className: 'bg-[#238636]/20 text-[#3fb950] border-[#238636]/30',
    },
    pending: {
      icon: <Clock className="h-3 w-3" />,
      label: 'Scheduled',
      className: 'bg-[#d29922]/20 text-[#d29922] border-[#d29922]/30',
    },
    completed: {
      icon: <CheckCircle className="h-3 w-3" />,
      label: 'Completed',
      className: 'bg-[#8b949e]/20 text-[#8b949e] border-[#8b949e]/30',
    },
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/session/${session.id}`;
    navigator.clipboard.writeText(link);
    toast.success('Invite link copied to clipboard!');
  };

  const handleJoin = () => {
    // Set this session as the ONLY active session
    setActiveSessionId(session.id);
    setCurrentSession(session);
    setActiveTab('ide');
    toast.success(`Joining "${session.title}"...`);
  };

  const handleView = () => {
    setCurrentSession(session);
    setActiveTab('ide');
    toast.info(`Viewing "${session.title}"`);
  };

  // Show "Active" badge only for the ONE active session, otherwise show scheduled status
  const displayStatus = isActive ? statusConfig.active : statusConfig[session.status];

  return (
    <div className="session-card hover:border-[#484f58] transition-colors">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn(
          'p-2.5 rounded-lg flex-shrink-0',
          isActive ? 'bg-[#238636]/20' : 'bg-[#21262d]'
        )}>
          <Video className={cn(
            'h-5 w-5',
            isActive ? 'text-[#3fb950]' : 'text-[#8b949e]'
          )} />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-medium text-[#e6edf3] truncate">{session.title}</h3>
            <Badge variant="outline" className={cn('text-[10px] px-2 py-0', displayStatus.className)}>
              {displayStatus.icon}
              <span className="ml-1">{displayStatus.label}</span>
            </Badge>
          </div>
          <p className="text-xs text-[#8b949e] mb-2 line-clamp-1">{session.description}</p>
          <div className="flex items-center gap-4 text-xs text-[#8b949e]">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {session.scheduledAt ? formatTime(session.scheduledAt) : formatTime(session.createdAt)}
            </span>
            <span>with {session.mentor}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Show Join button for pending sessions (to start them) or active session */}
          {(session.status === 'pending' || isActive) && !isActive && (
            <Button
              onClick={handleJoin}
              className="h-8 px-4 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-medium"
            >
              <Play className="h-3 w-3 mr-1.5 fill-current" />
              Join
            </Button>
          )}
          {/* Show Join button for the active session */}
          {isActive && (
            <Button
              onClick={handleJoin}
              className="h-8 px-4 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-medium"
            >
              <Play className="h-3 w-3 mr-1.5 fill-current" />
              Resume
            </Button>
          )}
          {/* Show View button for completed sessions */}
          {session.status === 'completed' && (
            <Button
              variant="outline"
              onClick={handleView}
              className="h-8 px-4 border-[#30363d] text-xs hover:bg-[#21262d] text-[#e6edf3]"
            >
              <Eye className="h-3 w-3 mr-1.5" />
              View
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyLink}
            className="h-8 w-8 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
            title="Copy invite link"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
