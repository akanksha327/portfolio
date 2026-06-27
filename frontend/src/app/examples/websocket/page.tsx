'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  text: string;
  senderId: string;
  timestamp: string;
}

export default function SocketDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || '';
    const socketInstance = io(socketUrl, {
      path: '/api/socketio',
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket && inputMessage.trim()) {
      const msg: Message = {
        text: inputMessage.trim(),
        senderId: socket.id || 'user',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, msg]);
      socket.emit('message', msg);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl min-h-screen flex items-center justify-center bg-black text-white">
      <Card className="w-full bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-orange-500">
            WebSocket Demo
            <span className={`text-sm px-2 py-1 rounded ${isConnected ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea className="h-80 w-full border border-zinc-800 rounded-md p-4 bg-zinc-950">
            <div className="space-y-2">
              {messages.length === 0 ? (
                <p className="text-zinc-500 text-center">No messages yet</p>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className="border-b border-zinc-800 pb-2 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-orange-400">
                          {msg.senderId}
                        </p>
                        <p className="text-zinc-200">{msg.text}</p>
                      </div>
                      <span className="text-xs text-zinc-500">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={!isConnected}
              className="flex-1 bg-zinc-950 border-zinc-800 focus-visible:ring-orange-500"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!isConnected || !inputMessage.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white disabled:bg-zinc-800"
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
