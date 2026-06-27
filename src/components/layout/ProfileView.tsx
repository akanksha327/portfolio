'use client';

import { useState } from 'react';
import { 
  User, 
  Clock, 
  Trophy, 
  Calendar,
  Code,
  Bell,
  Save,
  Palette,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSessionStore } from '@/stores/session-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function ProfileView() {
  const { sessions, user, updateUser } = useSessionStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState('Computer Science student passionate about algorithms');
  
  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [compactView, setCompactView] = useState(false);

  const stats = [
    { label: 'Sessions', value: sessions.length, icon: Calendar },
    { label: 'Hours', value: 24, icon: Clock },
    { label: 'Problems', value: 47, icon: Code },
    { label: 'Badges', value: 5, icon: Trophy },
  ];

  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 500));
    
    updateUser({ name, email });
    
    toast.success('Profile updated successfully!');
    setIsSaving(false);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast.success('Settings saved successfully!');
    setIsSaving(false);
  };

  return (
    <div className="h-full overflow-auto bg-[#0d1117]">
      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Left - Profile Summary */}
          <div className="space-y-6">
            <div className="stats-card text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-[#ffa116] text-[#0d1117] text-xl">
                  {name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-semibold text-[#e6edf3]">{name}</h2>
              <p className="text-sm text-[#8b949e] mb-3">{email}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#21262d] rounded-full text-xs text-[#ffa116]">
                <User className="h-3 w-3" />
                <span className="capitalize">{user.role}</span>
              </div>
            </div>

            <div className="stats-card">
              <h3 className="text-xs font-medium text-[#8b949e] uppercase tracking-wide mb-4">
                Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center p-3 bg-[#21262d] rounded-lg">
                      <Icon className="h-4 w-4 mx-auto mb-1 text-[#ffa116]" />
                      <p className="text-lg font-semibold text-[#e6edf3]">{stat.value}</p>
                      <p className="text-[10px] text-[#8b949e]">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right - Tabs */}
          <div className="col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-[#161b22] border-b border-[#30363d] rounded-none w-full justify-start h-auto p-0">
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#ffa116] data-[state=active]:bg-transparent px-4 py-3 text-sm text-[#8b949e] data-[state=active]:text-[#e6edf3]"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="sessions"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#ffa116] data-[state=active]:bg-transparent px-4 py-3 text-sm text-[#8b949e] data-[state=active]:text-[#e6edf3]"
                >
                  Sessions
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#ffa116] data-[state=active]:bg-transparent px-4 py-3 text-sm text-[#8b949e] data-[state=active]:text-[#e6edf3]"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                <div className="stats-card">
                  <h3 className="text-sm font-medium text-[#e6edf3] mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {sessions.slice(0, 3).map((session) => (
                      <div key={session.id} className="flex items-center gap-3 p-3 bg-[#21262d] rounded-lg">
                        <Code className="h-4 w-4 text-[#ffa116]" />
                        <div className="flex-1">
                          <p className="text-sm text-[#e6edf3]">{session.title}</p>
                          <p className="text-xs text-[#8b949e]">with {session.mentor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="stats-card">
                  <h3 className="text-sm font-medium text-[#e6edf3] mb-4">Achievements</h3>
                  <div className="flex gap-4">
                    {[
                      { emoji: '🏆', title: 'Problem Solver' },
                      { emoji: '⭐', title: 'First Session' },
                      { emoji: '🎯', title: 'Bug Hunter' },
                      { emoji: '💪', title: 'Perseverance' },
                      { emoji: '🚀', title: 'Quick Learner' },
                    ].map((badge) => (
                      <div 
                        key={badge.title} 
                        className="w-12 h-12 bg-[#21262d] rounded-lg flex items-center justify-center text-xl cursor-pointer hover:bg-[#30363d] transition-colors"
                        title={badge.title}
                      >
                        {badge.emoji}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sessions" className="mt-6">
                <div className="stats-card">
                  <h3 className="text-sm font-medium text-[#e6edf3] mb-4">Session History</h3>
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div key={session.id} className="flex items-center gap-4 p-4 bg-[#21262d] rounded-lg">
                        <div className={cn(
                          'w-2 h-2 rounded-full',
                          session.status === 'active' ? 'bg-[#3fb950]' :
                          session.status === 'pending' ? 'bg-[#d29922]' : 'bg-[#8b949e]'
                        )} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#e6edf3]">{session.title}</p>
                          <p className="text-xs text-[#8b949e]">{session.mentor} • {session.language}</p>
                        </div>
                        <span className="text-xs text-[#8b949e]">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <div className="space-y-6">
                  {/* Profile Settings */}
                  <div className="stats-card">
                    <h3 className="text-sm font-medium text-[#e6edf3] mb-4 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-[#8b949e]">Display Name</Label>
                          <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1.5 bg-[#21262d] border-[#30363d] text-[#e6edf3] text-sm focus:border-[#ffa116]"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-[#8b949e]">Email</Label>
                          <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="mt-1.5 bg-[#21262d] border-[#30363d] text-[#e6edf3] text-sm focus:border-[#ffa116]"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-[#8b949e]">Bio</Label>
                        <Input
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="mt-1.5 bg-[#21262d] border-[#30363d] text-[#e6edf3] text-sm focus:border-[#ffa116]"
                        />
                      </div>
                      <Button 
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="bg-[#238636] hover:bg-[#2ea043]"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Profile'}
                      </Button>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="stats-card">
                    <h3 className="text-sm font-medium text-[#e6edf3] mb-4 flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#e6edf3]">Email notifications</span>
                        <Switch 
                          checked={emailNotifications} 
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#e6edf3]">Session reminders</span>
                        <Switch 
                          checked={sessionReminders} 
                          onCheckedChange={setSessionReminders}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#e6edf3]">Message notifications</span>
                        <Switch 
                          checked={messageNotifications} 
                          onCheckedChange={setMessageNotifications}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#e6edf3]">Marketing emails</span>
                        <Switch 
                          checked={marketingEmails} 
                          onCheckedChange={setMarketingEmails}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Appearance */}
                  <div className="stats-card">
                    <h3 className="text-sm font-medium text-[#e6edf3] mb-4 flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Appearance
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#e6edf3]">Dark mode</span>
                        <Switch 
                          checked={darkMode} 
                          onCheckedChange={setDarkMode}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#e6edf3]">Compact view</span>
                        <Switch 
                          checked={compactView} 
                          onCheckedChange={setCompactView}
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="bg-[#238636] hover:bg-[#2ea043]"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
