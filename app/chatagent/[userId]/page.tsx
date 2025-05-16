// app/chatagent/[userId]/page.tsx
import ChatClient from './ChatClient';
import type { Metadata } from 'next';
import { userIds } from '@/lib/userIds';

export async function generateStaticParams() {
  return userIds.map(userId=> ({ userId }));
}

export function generateMetadata({ params }: { params: { userId: string } }): Metadata {
  return { title: `Chatbot` };
}

export default function Page({ params }: { params: { userId: string } }) {
  return <ChatClient userId={params.userId} />;
}
