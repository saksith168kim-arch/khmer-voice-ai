'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import {
  Key, Plus, Trash2, Copy, Terminal,
  AlertCircle, Lock, CheckCircle2
} from 'lucide-react'
import type { ApiKey } from '@prisma/client'

const CODE_EXAMPLES = {
  javascript: `const response = await fetch('https://khmervoiceai.com/api/tts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    text: 'Hello, this is a test.',
    voiceId: 'VOICE_ID',
    language: 'en',
    speed: 1.0,
    pitch: 1.0,
    format: 'mp3'
  })
});

const data = await response.json();
console.log(data.data.audioUrl);`,

  python: `import requests

response = requests.post(
    'https://khmervoiceai.com/api/tts',
    headers={
        'Content-Type': 'application/json',
        'x-api-key': 'YOUR_API_KEY'
    },
    json={
        'text': 'Hello, this is a test.',
        'voiceId': 'VOICE_ID',
        'language': 'en',
        'speed': 1.0,
        'pitch': 1.0,
        'format': 'mp3'
    }
)

data = response.json()
print(data['data']['audioUrl'])`,

  php: `<?php
$client = new GuzzleHttp\\Client();
$response = $client->post('https://khmervoiceai.com/api/tts', [
    'headers' => [
        'Content-Type' => 'application/json',
        'x-api-key' => 'YOUR_API_KEY',
    ],
    'json' => [
        'text' => 'Hello, this is a test.',
        'voiceId' => 'VOICE_ID',
        'language' => 'en',
        'speed' => 1.0,
        'format' => 'mp3',
    ],
]);
$data = json_decode($response->getBody(), true);
echo $data['data']['audioUrl'];`,

  curl: `curl -X POST https://khmervoiceai.com/api/tts \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "text": "Hello, this is a test.",
    "voiceId": "VOICE_ID",
    "language": "en",
    "speed": 1.0,
    "format": "mp3"
  }'`,
}

export function ApiKeysManager({ initialKeys, plan }: { initialKeys: ApiKey[]; plan: string }) {
  const [keys, setKeys] = useState(initialKeys)
  const [newKeyName, setNewKeyName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<keyof typeof CODE_EXAMPLES>('javascript')
  const isFreePlan = plan === 'FREE'

  const handleCreate = async () => {
    if (!newKeyName.trim()) return
    setIsCreating(true)
    try {
      const res = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setNewKey(data.data.key)
      setKeys((prev) => [{ ...data.data, key: `${data.data.key.substring(0, 10)}...${data.data.key.slice(-4)}` }, ...prev])
      setNewKeyName('')
      setShowCreate(false)
      toast.success('API key created!')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsCreating(false)
    }
  }

  const handleRevoke = async (id: string) => {
    try {
      await fetch(`/api/api-keys?id=${id}`, { method: 'DELETE' })
      setKeys((prev) => prev.map((k) => k.id === id ? { ...k, status: 'REVOKED' } : k))
      toast.success('API key revoked')
    } catch {
      toast.error('Failed to revoke key')
    }
  }

  return (
    <div className="space-y-6">
      {/* Pro plan gate */}
      {isFreePlan && (
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
          <Lock className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-400">API access requires Pro</p>
            <p className="text-xs text-white/40 mt-0.5">
              Upgrade to Pro to create API keys and integrate Khmer Voice AI into your apps.
            </p>
          </div>
        </div>
      )}

      {/* New key alert */}
      {newKey && (
        <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">API Key Created — Save it now!</span>
          </div>
          <p className="text-xs text-white/50 mb-3">This key will only be shown once. Store it securely.</p>
          <div className="flex items-center gap-2 p-3 bg-black/30 rounded-lg font-mono text-sm text-white/80">
            <span className="flex-1 break-all">{newKey}</span>
            <button
              onClick={() => { navigator.clipboard.writeText(newKey); toast.success('Copied!') }}
              className="flex-shrink-0 p-1 hover:text-white transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <button onClick={() => setNewKey(null)} className="text-xs text-white/30 hover:text-white/60 mt-2">
            I've saved it, dismiss
          </button>
        </div>
      )}

      {/* Keys list */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <span className="text-sm font-medium text-white">Your API Keys</span>
          <button
            onClick={() => setShowCreate(true)}
            disabled={isFreePlan}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5" />
            New Key
          </button>
        </div>

        {showCreate && (
          <div className="px-5 py-4 border-b border-white/[0.07] bg-white/[0.02] flex items-center gap-3">
            <input
              autoFocus
              type="text"
              placeholder="Key name (e.g. Production, Development)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="flex-1 bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
            />
            <button
              onClick={handleCreate}
              disabled={isCreating || !newKeyName.trim()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create'}
            </button>
            <button onClick={() => setShowCreate(false)} className="text-white/30 hover:text-white text-sm">Cancel</button>
          </div>
        )}

        {keys.length === 0 ? (
          <div className="py-12 text-center">
            <Key className="w-8 h-8 text-white/10 mx-auto mb-2" />
            <p className="text-sm text-white/30">No API keys yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {keys.map((key) => (
              <div key={key.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${key.status === 'ACTIVE' ? 'bg-green-400' : 'bg-red-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{key.name}</p>
                  <p className="text-xs font-mono text-white/30 mt-0.5">{key.key}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-white/30">{format(new Date(key.createdAt), 'MMM d, yyyy')}</p>
                  <p className="text-xs text-white/20">{key.usageCount} requests</p>
                </div>
                {key.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleRevoke(key.id)}
                    className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Code examples */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <span className="text-sm font-medium text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            Code Examples
          </span>
          <div className="flex gap-1">
            {(Object.keys(CODE_EXAMPLES) as Array<keyof typeof CODE_EXAMPLES>).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  activeTab === lang ? 'bg-purple-600 text-white' : 'text-white/40 hover:text-white'
                }`}
              >
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <pre className="p-5 text-xs font-mono text-white/70 overflow-x-auto leading-relaxed bg-black/20">
            <code>{CODE_EXAMPLES[activeTab]}</code>
          </pre>
          <button
            onClick={() => { navigator.clipboard.writeText(CODE_EXAMPLES[activeTab]); toast.success('Copied!') }}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/40 hover:text-white transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
