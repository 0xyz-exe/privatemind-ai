'use client';

import { useEffect, useState, useRef } from 'react';
import { api, type Conversation, type Message } from '@/lib/api';

interface ChatInterfaceProps {
  conversationId: number;
}

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversation();
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  async function loadConversation() {
    try {
      const conv = await api.getConversation(conversationId);
      setConversation(conv);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  }

  async function handleSend() {
    if (!input.trim() || sending) return;

    const userContent = input;
    setInput('');
    setSending(true);

    try {
      const newMessage = await api.sendMessage(conversationId, userContent);
      await loadConversation(); // Reload to get both user and assistant messages
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="border-b border-border p-4">
        <h2 className="font-semibold">{conversation.title}</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages && conversation.messages.length > 0 ? (
          conversation.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-border/50 text-xs">
                    <p className="font-medium mb-1">Sources:</p>
                    {msg.sources.map((src, i) => (
                      <div key={i} className="opacity-80">• {src.filename}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Send a message to start the conversation
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
            disabled={sending}
            className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            rows={3}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Running in demo mode. Configure a model in Settings for real AI responses.
        </p>
      </div>
    </div>
  );
}
