const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Message {
  id: number;
  role: string;
  content: string;
  sources?: any[];
  created_at: string;
}

export interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

export interface Document {
  id: number;
  filename: string;
  mime_type: string;
  file_size: number;
  status: string;
  chunk_count: number;
  created_at: string;
}

export interface Memory {
  id: number;
  content: string;
  category: string;
  enabled: boolean;
  tags: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
}

export interface HealthStatus {
  status: string;
  inference_mode: string;
  provider_available: boolean;
  database: string;
}

class ApiClient {
  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return response.json();
  }

  async healthCheck(): Promise<HealthStatus> {
    return this.request<HealthStatus>('/health');
  }

  async listConversations(): Promise<Conversation[]> {
    return this.request<Conversation[]>('/conversations');
  }

  async getConversation(id: number): Promise<Conversation> {
    return this.request<Conversation>(`/conversations/${id}`);
  }

  async createConversation(title: string = 'New Conversation'): Promise<Conversation> {
    return this.request<Conversation>('/conversations', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  async sendMessage(conversationId: number, content: string): Promise<Message> {
    return this.request<Message>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async listDocuments(): Promise<Document[]> {
    return this.request<Document[]>('/documents');
  }

  async uploadDocument(file: File): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    return response.json();
  }

  async listMemories(enabledOnly: boolean = false): Promise<Memory[]> {
    const params = enabledOnly ? '?enabled_only=true' : '';
    return this.request<Memory[]>(`/memories${params}`);
  }

  async createMemory(content: string, category: string = 'general', tags?: string): Promise<Memory> {
    return this.request<Memory>('/memories', {
      method: 'POST',
      body: JSON.stringify({ content, category, tags }),
    });
  }

  async updateMemory(id: number, updates: Partial<Memory>): Promise<Memory> {
    return this.request<Memory>(`/memories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteMemory(id: number): Promise<void> {
    await this.request(`/memories/${id}`, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
