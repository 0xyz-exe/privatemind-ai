import type { Conversation } from '@/lib/api';
import Link from 'next/link';

interface SidebarProps {
  conversations: Conversation[];
  activeId: number | null;
  onSelect: (id: number) => void;
  onNew: () => void;
}

export function Sidebar({ conversations, activeId, onSelect, onNew }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold">PrivateMind AI</h1>
        <p className="text-xs text-muted-foreground mt-1">Local-First Assistant</p>
      </div>

      <div className="p-3">
        <button
          onClick={onNew}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium"
        >
          + New Chat
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              conv.id === activeId
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-accent/50'
            }`}
          >
            <div className="font-medium truncate">{conv.title}</div>
            <div className="text-xs text-muted-foreground">
              {new Date(conv.created_at).toLocaleDateString()}
            </div>
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-border space-y-1">
        <Link
          href="/documents"
          className="block px-3 py-2 text-sm rounded-md hover:bg-accent"
        >
          📚 Documents
        </Link>
        <Link
          href="/memories"
          className="block px-3 py-2 text-sm rounded-md hover:bg-accent"
        >
          🧠 Memories
        </Link>
        <Link
          href="/settings"
          className="block px-3 py-2 text-sm rounded-md hover:bg-accent"
        >
          ⚙️ Settings
        </Link>
      </div>
    </aside>
  );
}
