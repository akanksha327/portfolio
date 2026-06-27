'use client';

import { useState } from 'react';
import {
  Code2,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLayoutStore } from '@/stores/layout-store';
import { useSessionStore } from '@/stores/session-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function Navigation() {
  const { activeTab, setActiveTab } = useLayoutStore();
  const { notifications, markNotificationRead, user } = useSessionStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ide', label: 'IDE', icon: Code2 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();
    sessionStorage.clear();
    
    toast.success('Signed out successfully');
    
    // In a real app, this would redirect to login
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'session': return '📅';
      case 'message': return '💬';
      case 'achievement': return '🏆';
      default: return '🔔';
    }
  };

  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <nav className="h-14 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 justify-between">
      <div className="flex items-center gap-6">
        {/* Logo */}
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="p-1.5 bg-[#ffa116] rounded-lg">
            <Code2 className="h-4 w-4 text-[#0d1117]" />
          </div>
          <span className="font-semibold text-[#e6edf3]">MentorHub</span>
        </button>

        {/* Nav Items */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors',
                  activeTab === item.id
                    ? 'bg-[#21262d] text-[#e6edf3]'
                    : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]/50'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 text-[#8b949e] hover:text-[#e6edf3]"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#f85149] text-[10px] text-white rounded-full flex items-center justify-center px-1">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-72 bg-[#1c2128] border-[#30363d] p-0"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#30363d]">
              <span className="text-sm font-medium text-[#e6edf3]">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs text-[#8b949e]">{unreadCount} unread</span>
              )}
            </div>
            <ScrollArea className="h-64">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markNotificationRead(notification.id)}
                  className={cn(
                    'px-3 py-2.5 cursor-pointer border-b border-[#30363d]/50 hover:bg-[#21262d] transition-colors',
                    !notification.read && 'bg-[#21262d]/50'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-base">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#e6edf3]">{notification.title}</p>
                      <p className="text-[11px] text-[#8b949e] line-clamp-1">{notification.description}</p>
                      <p className="text-[10px] text-[#6e7681] mt-1">{formatNotificationTime(notification.timestamp)}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-[#ffa116]" />
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-8 px-2 hover:bg-[#21262d]"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-[#ffa116] text-[#0d1117] text-xs">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-[#e6edf3]">{user.name}</span>
              <ChevronDown className="h-3 w-3 text-[#8b949e]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-[#1c2128] border-[#30363d]"
          >
            <DropdownMenuItem 
              onClick={() => setActiveTab('profile')}
              className="text-[#e6edf3] hover:bg-[#21262d] focus:bg-[#21262d] cursor-pointer"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setActiveTab('profile')}
              className="text-[#e6edf3] hover:bg-[#21262d] focus:bg-[#21262d] cursor-pointer"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#30363d]" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-[#f85149] hover:bg-[#21262d] focus:bg-[#21262d] cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
