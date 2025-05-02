'use client';

import { Bot, User } from 'lucide-react';
import { MessageType } from '@/types/chat';

interface MessageItemProps {
  message: MessageType;
}

export function MessageItem({ message }: MessageItemProps) {
  return (
    <div
      className={`flex items-start gap-2 ${
        message.type === 'user' ? 'flex-row-reverse' : ''
      }`}
    >
      <div className={`p-2 rounded-full ${
        message.type === 'user' ? 'bg-primary' : 'bg-muted'
      }`}>
        {message.type === 'user' ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-foreground" />
        )}
      </div>
      <div
        className={`rounded-lg p-3 max-w-[80%] ${
          message.type === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}