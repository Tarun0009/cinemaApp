'use client';

import { useState, useRef } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }
  };

  return (
    <div className="flex items-end gap-2 p-4 bg-[#141414] border-t border-[#333]">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder="Ask for movie recommendations..."
        maxLength={500}
        rows={1}
        disabled={disabled}
        className="flex-1 bg-[#1F1F1F] border border-[#333] rounded-xl px-4 py-2.5 text-white placeholder-[#808080] outline-none focus:border-[#E50914] resize-none transition-colors disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-[#E50914] hover:bg-[#B81D24] disabled:bg-[#1F1F1F] disabled:text-[#808080] text-white transition-colors"
      >
        <Send size={18} />
      </button>
    </div>
  );
}
