'use client';

import { Activity as ActivityIcon, Code, MessageSquare, Trophy, Calendar } from 'lucide-react';
import { PanelHeader } from '@/components/panels/PanelHeader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSessionStore, Activity } from '@/stores/session-store';
import { cn } from '@/lib/utils';

export function ActivityPanel() {
  const { activities } = useSessionStore();

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'session':
        return <Calendar className="h-3 w-3" />;
      case 'code':
        return <Code className="h-3 w-3" />;
      case 'message':
        return <MessageSquare className="h-3 w-3" />;
      case 'achievement':
        return <Trophy className="h-3 w-3" />;
    }
  };

  const getIconBg = (type: Activity['type']) => {
    switch (type) {
      case 'session':
        return 'bg-[#238636]/20 text-[#3fb950]';
      case 'code':
        return 'bg-[#ffa116]/20 text-[#ffa116]';
      case 'message':
        return 'bg-[#388bfd]/20 text-[#58a6ff]';
      case 'achievement':
        return 'bg-[#a371f7]/20 text-[#a371f7]';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return 'now';
  };

  return (
    <div className="flex flex-col h-full bg-[#161b22]">
      <PanelHeader
        title="Activity"
        icon={<ActivityIcon className="h-3.5 w-3.5" />}
      />
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-item !py-2 !px-1">
              <div className={cn('p-1 rounded', getIconBg(activity.type))}>
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#e6edf3] line-clamp-2">{activity.description}</p>
              </div>
              <span className="text-[10px] text-[#8b949e] flex-shrink-0">
                {formatTime(activity.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
