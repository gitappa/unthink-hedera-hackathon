// app/chatagent/[userId]/ChatClient.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import {
  ScrollArea,
  ScrollBar,
} from '@/components/ui/scroll-area';
import {
  Send,
  ExternalLink,
  Bot,
  User,
  Loader2,
  Square,
  CoinsIcon,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

import {
  Client,
  AccountId,
  PrivateKey,
} from '@hashgraph/sdk';

import { agentService } from '../../../lib/clientAgent';

export interface Message {
  type: 'user' | 'assistant';
  content: string;
  assistantId: string;
  isLoading?: boolean;
  transactionFee?: string;
}

const CustomLink = (props: any) => (
  <a
    href={props.href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-purple-600 hover:underline inline-flex items-center gap-1 font-medium"
  >
    {props.children}
    <ExternalLink className="w-3 h-3 inline" />
  </a>
);

const urlRegex = /(https?:\/\/[^\s]+)/g;
const convertUrlsToMarkdown = (text: string) =>
  text.replace(urlRegex, (url) => {
    if (text.includes('[') && text.includes(`](${url})`)) return url;
    return `[${url}](${url})`;
  });

const LoadingIndicator = () => (
  <div className="flex items-center space-x-2 animate-pulse">
    <span className="text-sm text-purple-500">Analyzing…</span>
  </div>
);

const EnhancedMessageItem: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.type === 'user';
  const Icon = isUser ? User : Bot;
  const processedContent = convertUrlsToMarkdown(message.content);
  const isLoading = message.isLoading === true;
  const showInitialLoadingIndicator = isLoading && message.content.length === 0;

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
          <Icon className="w-5 h-5 text-purple-500" />
        </div>
      )}

      <div
        className={cn(
          'max-w-[85%] rounded-2xl p-4 shadow-lg',
          isUser
            ? 'bg-purple-200 text-purple-800 rounded-br-none'
            : 'bg-white bg-opacity-80 rounded-bl-none'
        )}
      >
        {showInitialLoadingIndicator ? (
          <LoadingIndicator />
        ) : (
          <>
            <ReactMarkdown
              className="prose prose-sm text-gray-800 break-words max-w-none"
              components={{
                a: CustomLink,
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                pre: ({ children }) => (
                  <pre className="bg-gray-100 rounded p-3 my-2 overflow-x-auto text-sm font-mono">
                    {children}
                  </pre>
                ),
                code: ({ inline, className, children, ...props }: any) =>
                  inline ? (
                    <code className="bg-gray-200 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className={cn('font-mono text-sm bg-gray-100 p-2 rounded', className)} {...props}>
                      {children}
                    </code>
                  ),
              }}  
            >
              {processedContent + (isLoading && !showInitialLoadingIndicator ? '▍' : '')}
            </ReactMarkdown>

            {!isUser && message.transactionFee && !isLoading && (
              <div className="flex items-center mt-2 text-xs text-gray-500">
                {/* <CoinsIcon className="w-3 h-3 mr-1 text-yellow-500" />
                <span>Fee: {message.transactionFee}</span> */}
              </div>
            )}
          </>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center shadow-inner">
          <Icon className="w-5 h-5 text-purple-800" />
        </div>
      )}
    </div>
  );
};

export default function ChatClient({ userId }: { userId: string }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [currentTransactionFee, setCurrentTransactionFee] = useState('');
  const [topic, setTopic] = useState('');
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);

  const ACCOUNT_ID = process.env.NEXT_PUBLIC_OPERATOR_ID as string;
  const PRIVATE_KEY = process.env.NEXT_PUBLIC_OPERATOR_KEY as string;

  const MY_ACCOUNT_ID = AccountId.fromString(ACCOUNT_ID);
  const MY_PRIVATE_KEY = PrivateKey.fromString(PRIVATE_KEY);

  const client = Client.forTestnet();
  client.setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);
  const stopStreamingRef = useRef(false);

  useEffect(() => {
    setSessionId(crypto.randomUUID().slice(0, 8));
    setMessages([
      { type: 'assistant', content: "Hello! How can I help you today?", assistantId: '', isLoading: false }
    ]);
  }, []);

  useEffect(() => {
    const vp = scrollAreaViewportRef.current;
    if (vp) setTimeout(() => { vp.scrollTop = vp.scrollHeight; }, 50);
  }, [messages]);

  const handleStopStreaming = () => { stopStreamingRef.current = true; };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { type: 'user', content: query, assistantId: '' };
    stopStreamingRef.current = false;
    setMessages(prev => [...prev, userMessage, { type: 'assistant', content: '', assistantId: '', isLoading: true }]);
    const history = [...messages, userMessage];
    setQuery('');
    setIsLoading(true);
    setIsStreaming(true);
    setCurrentTransactionFee('');

    try {
      console.log('latest query', query)
      const { res, feeSent, feeReceived, topic } = await agentService.sendAndReceive(query, userId, sessionId);
      setTopic(topic)
      const assistantMessageText = res as string
      
      const transactionFee = feeReceived
      setCurrentTransactionFee(transactionFee);

      let i = 0;
      const streamInterval = 10;
      while (i < assistantMessageText.length && !stopStreamingRef.current) {
        const slice = assistantMessageText.slice(0, i + 1);
        setMessages(prev => {
          const copy = [...prev];
          const lastIndex = copy.length - 1;
          if (lastIndex >= 0 && copy[lastIndex].type === 'assistant') {
            copy[lastIndex] = { ...copy[lastIndex], content: slice, isLoading: true };
          }
          return copy;
        });
        i++;
        await new Promise(r => setTimeout(r, streamInterval));
      }

      setMessages(prev => {
        const copy = [...prev];
        const lastIndex = copy.length - 1;
        if (lastIndex >= 0 && copy[lastIndex].type === 'assistant') {
          const finalContent = stopStreamingRef.current ? assistantMessageText.slice(0, i) : assistantMessageText;
          copy[lastIndex] = {
            ...copy[lastIndex],
            content: finalContent,
            isLoading: false,
            transactionFee,
          };
        }
        return copy;
      });
    } catch (err) {
      console.error("Error during chat submission or streaming:", err);
      setMessages(prev => {
        const copy = [...prev];
        const lastIndex = copy.length - 1;
        const errorMsg: Message = {
          type: 'assistant',
          content: "Sorry, couldn't process your request. Please try again or refresh the page.",
          assistantId: '',
          isLoading: false,
        };
        if (lastIndex >= 0 && copy[lastIndex].type === 'assistant') {
          copy[lastIndex] = errorMsg;
        } else {
          copy.push(errorMsg);
        }
        return copy;
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      stopStreamingRef.current = false;
    }
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <main className="flex flex-col flex-1 h-screen">
        <ScrollArea className="flex-1">
          <ScrollAreaPrimitive.Root className="flex-1">
            <ScrollAreaPrimitive.Viewport
              ref={scrollAreaViewportRef}
              className="flex-1 p-6"
            >
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((msg, i) => (
                  <EnhancedMessageItem key={i} message={msg} />
                ))}
              </div>
            </ScrollAreaPrimitive.Viewport>
            <ScrollAreaPrimitive.Scrollbar orientation="vertical" />
          </ScrollAreaPrimitive.Root>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        <div className="sticky bottom-0 left-0 right-0 border-t bg-white bg-opacity-70 backdrop-blur-md px-6 py-4 z-10">
          <div className="max-w-3xl mx-auto flex items-center">
            {topic !== '' && (
              <div className="text-xs font-semibold text-gray-500 flex items-center mr-3 whitespace-nowrap">
                <span>Topic ID: {topic}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex gap-3 items-center w-full">
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 h-10 text-base rounded-full px-5 shadow-md bg-purple-50 focus:bg-white focus:ring-2 focus:ring-purple-300 disabled:opacity-70"
                disabled={isLoading}
                autoComplete="off"
              />
              {isStreaming ? (
                <Button
                  type="button"
                  onClick={handleStopStreaming}
                  size="icon"
                  variant="ghost"
                  className="rounded-full w-10 h-10 flex-shrink-0 text-gray-600 hover:bg-gray-200"
                  title="Stop generating"
                >
                  <Square className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  size="icon"
                  className="rounded-full w-10 h-10 bg-purple-500 text-white hover:bg-purple-600 flex-shrink-0 disabled:bg-purple-300"
                >
                  {isLoading && !isStreaming
                    ? <Loader2 className="w-5 h-5 animate-spin text-white" />
                    : <Send className="w-5 h-5 text-white" />
                  }
                </Button>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
