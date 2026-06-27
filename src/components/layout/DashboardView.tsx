'use client';

import { Video, Users, Clock, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { SessionCard } from '@/components/dashboard/SessionCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { useSessionStore } from '@/stores/session-store';

export function DashboardView() {
  const { sessions, activities, activeSessionId } = useSessionStore();

  const stats = [
    {
      title: 'Total Sessions',
      value: sessions.length,
      icon: <Video className="h-5 w-5 text-[#ffa116]" />,
      trend: { value: 12, positive: true },
    },
    {
      title: 'Active Now',
      value: activeSessionId ? 1 : 0, // Only ONE session can be active
      icon: <Users className="h-5 w-5 text-[#3fb950]" />,
    },
    {
      title: 'Students',
      value: 8,
      icon: <Users className="h-5 w-5 text-[#58a6ff]" />,
      trend: { value: 5, positive: true },
    },
    {
      title: 'Upcoming',
      value: sessions.filter(s => s.status === 'pending' && s.id !== activeSessionId).length,
      icon: <Clock className="h-5 w-5 text-[#d29922]" />,
    },
  ];

  return (
    <div className="h-full overflow-auto bg-[#0d1117]">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#e6edf3]">Dashboard</h1>
            <p className="text-sm text-[#8b949e]">Welcome back, Alex</p>
          </div>
          <QuickActions />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Sessions List - 2 columns */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-[#e6edf3]">Your Sessions</h2>
            </div>
            <div className="space-y-3">
              {sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </div>

          {/* Activity Feed - 1 column */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-[#e6edf3]">Recent Activity</h2>
            <div className="stats-card">
              <ActivityFeed activities={activities} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
