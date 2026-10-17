'use client';

import { useEffect, useState } from 'react';
import { api, type Memory } from '@/lib/api';
import Link from 'next/link';

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [creating, setCreating] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('general');

  useEffect(() => {
    loadMemories();
  }, []);

  async function loadMemories() {
    try {
      const mems = await api.listMemories();
      setMemories(mems);
    } catch (error) {
      console.error('Failed to load memories:', error);
    }
  }

  async function handleCreate() {
    if (!newContent.trim()) return;

    try {
      await api.createMemory(newContent, newCategory);
      setNewContent('');
      setNewCategory('general');
      setCreating(false);
      await loadMemories();
    } catch (error) {
      console.error('Failed to create memory:', error);
    }
  }

  async function handleToggle(id: number, currentState: boolean) {
    try {
      await api.updateMemory(id, { enabled: !currentState });
      await loadMemories();
    } catch (error) {
      console.error('Failed to update memory:', error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this memory?')) return;

    try {
      await api.deleteMemory(id);
      await loadMemories();
    } catch (error) {
      console.error('Failed to delete memory:', error);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Chat
          </Link>
          <h1 className="text-2xl font-bold mt-2">Personal Memories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Save preferences, facts, and context that persist across conversations
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          {creating ? (
            <div className="border border-border rounded-lg p-4 bg-card">
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Enter memory content..."
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm mb-3"
                rows={3}
                autoFocus
              />
              <div className="flex items-center gap-3">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md text-sm bg-background"
                >
                  <option value="general">General</option>
                  <option value="preference">Preference</option>
                  <option value="fact">Fact</option>
                  <option value="project">Project</option>
                </select>
                <button
                  onClick={handleCreate}
                  disabled={!newContent.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 text-sm font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => setCreating(false)}
                  className="px-4 py-2 border border-border rounded-md hover:bg-accent text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="w-full px-4 py-3 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-accent/50 text-sm text-muted-foreground transition-colors"
            >
              + Add New Memory
            </button>
          )}
        </div>

        <div className="space-y-3">
          {memories.map((mem) => (
            <div
              key={mem.id}
              className={`border border-border rounded-lg p-4 bg-card ${
                !mem.enabled ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm">{mem.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="px-2 py-0.5 bg-accent rounded">{mem.category}</span>
                    <span>{new Date(mem.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggle(mem.id, mem.enabled)}
                    className="text-sm px-3 py-1 border border-border rounded hover:bg-accent"
                  >
                    {mem.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleDelete(mem.id)}
                    className="text-sm px-3 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {memories.length === 0 && !creating && (
          <div className="text-center py-12 text-muted-foreground">
            No memories saved yet. Create one to get started.
          </div>
        )}
      </main>
    </div>
  );
}
