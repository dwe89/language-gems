'use client';

import dynamic from 'next/dynamic';
import { useChatbot } from '../providers/ChatbotProvider';

// Dynamically import Chatbot to avoid SSR issues
const Chatbot = dynamic(() => import('./Chatbot'), {
  ssr: false,
  loading: () => null
});

export default function ChatbotWrapper() {
  const { isOpen, toggleChatbot } = useChatbot();

  return <Chatbot isOpen={isOpen} onToggle={toggleChatbot} />;
}