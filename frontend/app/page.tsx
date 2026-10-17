'use client';

import { useEffect, useState } from 'react';
import { api, type Conversation } from '@/lib/api';
import { ChatInterface } from '@/components/ChatInterface';
import { Sidebar } from '@/components/Sidebar';

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      const convs = await api.listConversations();
      setConversations(convs);
      if (convs.length > 0 && !activeConversation) {
        setActiveConversation(convs[0].id);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createNewConversation() {
    try {
      const newConv = await api.createConversation();
      setConversations([newConv, ...conversations]);
      setActiveConversation(newConv.id);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        conversations={conversations}
        activeId={activeConversation}
        onSelect={setActiveConversation}
        onNew={createNewConversation}
      />
      <main className="flex-1 flex flex-col">
        {activeConversation ? (
          <ChatInterface conversationId={activeConversation} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Welcome to PrivateMind AI</h2>
              <p className="text-muted-foreground mb-4">Start a new conversation to begin</p>
              <button
                onClick={createNewConversation}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                New Conversation
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
