'use client';

import { useState } from 'react';
import { Plus, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSessionStore, Session } from '@/stores/session-store';
import { useLayoutStore } from '@/stores/layout-store';
import { toast } from 'sonner';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
];

const MENTORS = [
  { value: 'Sarah Chen', label: 'Sarah Chen' },
  { value: 'Mike Rodriguez', label: 'Mike Rodriguez' },
  { value: 'David Kim', label: 'David Kim' },
  { value: 'Lisa Wang', label: 'Lisa Wang' },
];

export function QuickActions() {
  const [createOpen, setCreateOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [mentor, setMentor] = useState('Sarah Chen');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const { addSession, addActivity, setActiveSessionId } = useSessionStore();
  const { setActiveTab } = useLayoutStore();

  const handleCreateSession = () => {
    if (!title.trim()) {
      toast.error('Please enter a session title');
      return;
    }

    const newSession: Session = {
      id: `sess-${Date.now()}`,
      title,
      description: description || 'New mentoring session',
      status: 'pending',
      mentor,
      student: 'Alex Johnson',
      createdAt: new Date(),
      language,
      problem: 'Custom problem',
    };

    addSession(newSession);
    // Set this new session as the ONLY active session
    setActiveSessionId(newSession.id);
    addActivity({
      id: `act-${Date.now()}`,
      type: 'session',
      description: `Created new session "${title}"`,
      timestamp: new Date(),
    });

    toast.success('Session created successfully!');
    setCreateOpen(false);
    resetForm();
    
    // Navigate to IDE
    setTimeout(() => setActiveTab('ide'), 300);
  };

  const handleScheduleSession = () => {
    if (!title.trim()) {
      toast.error('Please enter a session title');
      return;
    }
    if (!scheduledDate || !scheduledTime) {
      toast.error('Please select a date and time');
      return;
    }

    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);

    const newSession: Session = {
      id: `sess-${Date.now()}`,
      title,
      description: description || 'Scheduled mentoring session',
      status: 'pending',
      mentor,
      student: 'Alex Johnson',
      createdAt: new Date(),
      scheduledAt,
      language,
      problem: 'Custom problem',
    };

    addSession(newSession);
    addActivity({
      id: `act-${Date.now()}`,
      type: 'session',
      description: `Scheduled "${title}" for ${scheduledAt.toLocaleDateString()}`,
      timestamp: new Date(),
    });

    toast.success('Session scheduled successfully!');
    setScheduleOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLanguage('javascript');
    setMentor('Sarah Chen');
    setScheduledDate('');
    setScheduledTime('');
  };

  return (
    <div className="flex items-center gap-3">
      {/* Create Session Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger asChild>
          <Button className="h-9 bg-[#238636] hover:bg-[#2ea043] text-sm text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Session
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#161b22] border-[#30363d] text-[#e6edf3]">
          <DialogHeader>
            <DialogTitle className="text-[#e6edf3]">Create New Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-xs text-[#8b949e]">Session Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Binary Search Practice"
                className="mt-1.5 bg-[#21262d] border-[#30363d] text-[#e6edf3]"
              />
            </div>
            <div>
              <Label className="text-xs text-[#8b949e]">Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will you cover?"
                className="mt-1.5 bg-[#21262d] border-[#30363d] text-[#e6edf3]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-[#8b949e]">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="mt-1.5 bg-[#21262d] border-[#30363d] text-[#e6edf3]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1c2128] border-[#30363d]">
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value} className="text-[#e6edf3]">
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-[#8b949e]">Mentor</Label>
                <Select value={mentor} onValueChange={setMentor}>
                  <SelectTrigger className="mt-1.5 bg-[#21262d] border-[#30363d] text-[#e6edf3]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1c2128] border-[#30363d]">
                    {MENTORS.map((m) => (
                      <SelectItem key={m.value} value={m.value} className="text-[#e6edf3]">
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setCreateOpen(false)}
                className="border-[#30363d] text-[#e6edf3]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateSession}
                className="bg-[#238636] hover:bg-[#2ea043]"
              >
                Create & Start
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Session Dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-9 border-[#30363d] text-sm text-[#e6edf3] hover:bg-[#21262d]">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Session
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#161b22] border-[#30363d] text-[#e6edf3]">
          <DialogHeader>
            <DialogTitle className="text-[#e6edf3]">Schedule a Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-xs text-[#8b949e]">Session Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Dynamic Programming Practice"
                className="mt-1.5 bg-[#21262d] border-[#30363d] text-[#e6edf3]"
              />
            </div>
            <div>
              <Label className="text-xs text-[#8b949e]">Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will you cover?"
                className="mt-1.5 bg-[#21262d] border-[#30363d] text-[#e6edf3]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-[#8b949e]">Date</Label>
                <Input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="mt-1.5 bg-[#21262d] border-[#30363d] text-[#e6edf3]"
                />
              </div>
              <div>
                <Label className="text-xs text-[#8b949e]">Time</Label>
                <Input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="mt-1.5 bg-[#21262d] border-[#30363d] text-[#e6edf3]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-[#8b949e]">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="mt-1.5 bg-[#21262d] border-[#30363d] text-[#e6edf3]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1c2128] border-[#30363d]">
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value} className="text-[#e6edf3]">
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-[#8b949e]">Mentor</Label>
                <Select value={mentor} onValueChange={setMentor}>
                  <SelectTrigger className="mt-1.5 bg-[#21262d] border-[#30363d] text-[#e6edf3]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1c2128] border-[#30363d]">
                    {MENTORS.map((m) => (
                      <SelectItem key={m.value} value={m.value} className="text-[#e6edf3]">
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setScheduleOpen(false)}
                className="border-[#30363d] text-[#e6edf3]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleScheduleSession}
                className="bg-[#238636] hover:bg-[#2ea043]"
              >
                Schedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
