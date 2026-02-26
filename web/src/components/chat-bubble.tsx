import { Sparkles, User, Loader2 } from 'lucide-react';
import type { LocalChatMessage } from '@/types/chat';

export default function ChatBubble({ message }: { message: LocalChatMessage }) {
  const isUser = message.role === 'user';
  const isLoading = message.isStreaming && !message.content;

  // Simple markdown bold rendering
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-[#E50914] font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-[#2A2A2A]' : 'bg-[#E50914]'
        }`}
      >
        {isUser ? <User size={16} /> : <Sparkles size={16} />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-[#E50914] text-white rounded-tr-sm'
            : 'bg-[#1F1F1F] text-[#B3B3B3] border border-[#333] rounded-tl-sm'
        }`}
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin text-[#808080]" />
        ) : (
          <div className="whitespace-pre-wrap">{renderContent(message.content)}</div>
        )}
      </div>
    </div>
  );
}
