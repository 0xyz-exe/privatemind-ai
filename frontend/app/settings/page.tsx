'use client';

import { useEffect, useState } from 'react';
import { api, type HealthStatus } from '@/lib/api';
import Link from 'next/link';

export default function SettingsPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    checkHealth();
  }, []);

  async function checkHealth() {
    try {
      const status = await api.healthCheck();
      setHealth(status);
    } catch (error) {
      console.error('Health check failed:', error);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Chat
          </Link>
          <h1 className="text-2xl font-bold mt-2">Settings & Diagnostics</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <section className="border border-border rounded-lg p-6 bg-card">
          <h2 className="text-lg font-semibold mb-4">System Status</h2>
          {health ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Backend:</span>
                <span className={health.status === 'ok' ? 'text-green-600' : 'text-red-600'}>
                  {health.status.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Database:</span>
                <span className="text-green-600">{health.database}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Inference Mode:</span>
                <span className="font-medium">{health.inference_mode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider Available:</span>
                <span className={health.provider_available ? 'text-green-600' : 'text-yellow-600'}>
                  {health.provider_available ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading...</p>
          )}
        </section>

        <section className="border border-border rounded-lg p-6 bg-card">
          <h2 className="text-lg font-semibold mb-4">Inference Configuration</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">Demo Mode (Current)</h3>
              <p className="text-muted-foreground">
                Simulated responses. No API key required. Always available.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Ollama (Local)</h3>
              <p className="text-muted-foreground mb-2">
                Run models locally with complete privacy. Requires Ollama installation.
              </p>
              <p className="text-xs text-muted-foreground">
                Edit <code className="bg-muted px-1 py-0.5 rounded">.env</code> and set{' '}
                <code className="bg-muted px-1 py-0.5 rounded">INFERENCE_MODE=ollama</code>
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">OpenAI (Remote)</h3>
              <p className="text-muted-foreground mb-2">
                External API. Requires API key. Prompts sent to OpenAI servers.
              </p>
              <p className="text-xs text-muted-foreground">
                Set <code className="bg-muted px-1 py-0.5 rounded">INFERENCE_MODE=openai</code> and{' '}
                <code className="bg-muted px-1 py-0.5 rounded">OPENAI_API_KEY</code> in{' '}
                <code className="bg-muted px-1 py-0.5 rounded">.env</code>
              </p>
            </div>
          </div>
        </section>

        <section className="border border-border rounded-lg p-6 bg-card">
          <h2 className="text-lg font-semibold mb-4">Privacy & Data</h2>
          <div className="space-y-3 text-sm">
            <div>
              <h3 className="font-medium mb-1">Local Storage</h3>
              <p className="text-muted-foreground">
                All conversations, documents, and memories stored locally in{' '}
                <code className="bg-muted px-1 py-0.5 rounded">./data/</code>
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Current Mode</h3>
              <p className="text-muted-foreground">
                {health?.inference_mode === 'demo' && 'Demo mode: No external network calls'}
                {health?.inference_mode === 'ollama' && 'Ollama: All inference runs locally'}
                {health?.inference_mode === 'openai' && 'OpenAI: Prompts sent to external API'}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
