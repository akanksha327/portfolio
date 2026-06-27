'use client';

import { ReactNode, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PanelHeaderProps {
  title: string;
  icon?: ReactNode;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
  actions?: ReactNode;
}

export function PanelHeader({
  title,
  icon,
  collapsible = true,
  collapsed = false,
  onToggleCollapse,
  onClose,
  actions,
}: PanelHeaderProps) {
  return (
    <div className="panel-header select-none">
      <div className="flex items-center gap-2 flex-1">
        {icon && <span className="text-[#8b949e]">{icon}</span>}
        <span className={cn('text-xs', collapsed && 'hidden')}>{title}</span>
      </div>
      <div className="flex items-center gap-1">
        {actions}
        {collapsible && (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 hover:bg-[#30363d]"
            onClick={onToggleCollapse}
          >
            {collapsed ? (
              <ChevronRight className="h-3 w-3 text-[#8b949e]" />
            ) : (
              <ChevronDown className="h-3 w-3 text-[#8b949e]" />
            )}
          </Button>
        )}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 hover:bg-[#30363d]"
            onClick={onClose}
          >
            <X className="h-3 w-3 text-[#8b949e]" />
          </Button>
        )}
      </div>
    </div>
  );
}

interface CollapsiblePanelProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultCollapsed?: boolean;
  onClose?: () => void;
  actions?: ReactNode;
  className?: string;
  headerClassName?: string;
}

export function CollapsiblePanel({
  title,
  icon,
  children,
  defaultCollapsed = false,
  onClose,
  actions,
  className,
  headerClassName,
}: CollapsiblePanelProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div className={cn('flex flex-col h-full bg-[#161b22]', className)}>
      <PanelHeader
        title={title}
        icon={icon}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        onClose={onClose}
        actions={actions}
      />
      {!collapsed && <div className="panel-content">{children}</div>}
    </div>
  );
}
