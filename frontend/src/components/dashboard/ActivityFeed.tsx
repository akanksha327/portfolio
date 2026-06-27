'use client';

import { Code, MessageSquare, Trophy, Calendar } from 'lucide-react';
import { Activity } from '@/stores/session-store';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'session':
        return <Calendar className="h-4 w-4" />;
      case 'code':
        return <Code className="h-4 w-4" />;
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'achievement':
        return <Trophy className="h-4 w-4" />;
    }
  };

  const getIconColor = (type: Activity['type']) => {
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

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-0">
      {activities.map((activity) => (
        <div key={activity.id} className="activity-item">
          <div className={cn(
            'p-1.5 rounded-lg flex-shrink-0',
            getIconColor(activity.type)
          )}>
            {getIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#e6edf3]">{activity.description}</p>
            <span className="text-[10px] text-[#8b949e]">{formatTime(activity.timestamp)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
