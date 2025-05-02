// import { api } from './axios';


// export async function streamResponse(text: string, assistantId: string, sessionId: string): Promise<ReadableStream> {
//   const response = await api.post('/chat', {
//     message: text,
//     assistant_id: assistantId,
//     session_id: sessionId
//   }, {
//     responseType: 'text', // Ensure the entire response is treated as text
//   });
  
//   return response as any as ReadableStream;

// }


// lib/api.ts

import axios from 'axios';

// types/chat.ts
export interface Message {
    type: 'user' | 'assistant';
    content: string;
    assistantId: string;
    isLoading?: boolean;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const api = axios.create({
  
  baseURL: `${BACKEND_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// export const api = axios.create({
//   baseURL: 'http://localhost:8000',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// In lib/api.ts, update the streamResponse function:
export async function streamResponse(
  text: string,
  userId: string, 
  assistantId: string, 
  sessionId: string,
  messageHistory: Message[] // Add this parameter
): Promise<ReadableStream> {
  const response = await api.post('/chat', {
    message: text,
    user_id: userId,
    assistant_id: assistantId,
    session_id: sessionId,
    chat_history: messageHistory // Add this to send the history array
  }, {
    responseType: 'text',
  });
  
  return response as any as ReadableStream;
}