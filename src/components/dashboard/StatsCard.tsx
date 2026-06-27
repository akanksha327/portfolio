'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
  return (
    <div className={cn('stats-card', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#8b949e] uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-semibold text-[#e6edf3] mt-1">{value}</p>
          {trend && (
            <p className={cn(
              'text-xs mt-2 flex items-center gap-1',
              trend.positive ? 'text-[#3fb950]' : 'text-[#f85149]'
            )}>
              <span>{trend.positive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}% from last week</span>
            </p>
          )}
        </div>
        <div className="p-2 bg-[#21262d] rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}
