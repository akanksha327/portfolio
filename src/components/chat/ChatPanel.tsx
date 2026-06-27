'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSessionStore } from '@/stores/session-store';
import { cn } from '@/lib/utils';

interface ChatPanelProps {
  expandedMode?: boolean;
}

export function ChatPanel({ expandedMode = false }: ChatPanelProps) {
  const { messages, addMessage, currentSession } = useSessionStore();
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    addMessage({
      id: `msg-${Date.now()}`,
      sender: 'You',
      content: inputValue,
      timestamp: new Date(),
      isOwn: true,
    });
    setInputValue('');

    // Simulate mentor response after 1-2 seconds
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me explain...",
        "Good progress! Try optimizing the middle calculation.",
        "Exactly! The time complexity is O(log n) because we halve the search space each iteration.",
        "Let's test your implementation with a few more edge cases.",
        "Nice work! Now can you modify it to find the insertion position?",
      ];
      
      addMessage({
        id: `msg-${Date.now()}`,
        sender: currentSession?.mentor || 'Sarah Chen',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        isOwn: false,
      });
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#161b22]">
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-3 bg-[#0d1117] border-b border-[#30363d] shrink-0",
        expandedMode ? "h-12" : "h-10"
      )}>
        <div className="flex items-center gap-2">
          <MessageSquare className={cn("text-[#ffa116]", expandedMode ? "h-4 w-4" : "h-3.5 w-3.5")} />
          <span className={cn("font-medium text-[#e6edf3]", expandedMode ? "text-sm" : "text-xs")}>
            Chat
          </span>
          {expandedMode && (
            <span className="text-[10px] text-[#8b949e] ml-2 px-2 py-0.5 bg-[#21262d] rounded-full">
              with {currentSession?.mentor || 'Sarah Chen'}
            </span>
          )}
        </div>
      </div>
      
      {/* Messages - Scrollable */}
      <div 
        ref={scrollRef}
        className={cn(
          "flex-1 min-h-0 overflow-y-auto",
          expandedMode ? "p-4 space-y-3" : "p-3 space-y-2"
        )}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-2 rounded-lg',
              expandedMode 
                ? message.isOwn 
                  ? 'bg-[#1c2128] p-3' 
                  : 'bg-[#21262d] p-3'
                : 'p-2',
              !expandedMode && (message.isOwn ? 'bg-[#1c2128]' : 'bg-transparent')
            )}
          >
            <Avatar className={cn("flex-shrink-0", expandedMode ? "h-8 w-8" : "h-6 w-6")}>
              <AvatarFallback className={cn(
                expandedMode ? 'text-[10px]' : 'text-[9px]',
                message.isOwn ? 'bg-[#ffa116] text-[#0d1117]' : 'bg-[#30363d] text-[#e6edf3]'
              )}>
                {getInitials(message.sender)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn(
                  'font-medium',
                  expandedMode ? 'text-xs' : 'text-[11px]',
                  message.isOwn ? 'text-[#ffa116]' : 'text-[#e6edf3]'
                )}>
                  {message.sender}
                </span>
                <span className={cn(
                  "text-[#8b949e]",
                  expandedMode ? 'text-[10px]' : 'text-[10px]'
                )}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <p className={cn(
                "text-[#e6edf3] mt-0.5 break-words",
                expandedMode ? 'text-sm leading-relaxed' : 'text-xs'
              )}>
                {message.content}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Input - Fixed at bottom */}
      <div className={cn(
        "shrink-0 border-t border-[#30363d]",
        expandedMode ? "p-3" : "p-2"
      )}>
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className={cn(
              "flex-1 bg-[#0d1117] border-[#30363d] text-[#e6edf3] placeholder:text-[#8b949e] focus:border-[#ffa116]",
              expandedMode ? "h-9 text-sm" : "h-7 text-xs"
            )}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            size="icon"
            className={cn(
              "bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50",
              expandedMode ? "h-9 w-9" : "h-7 w-7"
            )}
          >
            <Send className={expandedMode ? "h-4 w-4" : "h-3 w-3"} />
          </Button>
        </div>
      </div>
    </div>
  );
}
