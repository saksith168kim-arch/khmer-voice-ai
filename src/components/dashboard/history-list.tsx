'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Play, Pause, Download, Trash2, Search, AudioLines } from 'lucide-react'
import type { Generation, Voice } from '@prisma/client'

type GenerationWithVoice = Generation & { voice: Voice }

export function HistoryList({ initialGenerations }: { initialGenerations: GenerationWithVoice[] }) {
  const [generations, setGenerations] = useState(initialGenerations)
  const [search, setSearch] = useState('')
  const [playingId, setPlayingId] = useState<string | null>(null)

  const filtered = generations.filter((g) =>
    g.text.toLowerCase().includes(search.toLowerCase()) ||
    g.voice.displayName.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/history?id=${id}`, { method: 'DELETE' })
      setGenerations((prev) => prev.filter((g) => g.id !== id))
      toast.success('Deleted successfully')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleDownload = (audioUrl: string | null, id: string) => {
    if (!audioUrl) return toast.error('Audio not available')
    const a = document.createElement('a')
    a.href = audioUrl
    a.download = `khmervoiceai-${id}.mp3`
    a.click()
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search by text or voice..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/40 transition-all"
        />
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-sm text-white/40">
        <span>{filtered.length} generations</span>
        <span>•</span>
        <span>{filtered.reduce((s, g) => s + g.charactersUsed, 0).toLocaleString()} total characters</span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <AudioLines className="w-12 h-12 text-white/10 mx-auto mb-3" />
          <p className="text-white/40">No generations found</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border border-white/[0.07]">
          <div className="hidden sm:grid grid-cols-12 px-4 py-3 bg-white/[0.02] border-b border-white/[0.07] text-xs text-white/30 font-medium uppercase tracking-wider">
            <div className="col-span-5">Text</div>
            <div className="col-span-2">Voice</div>
            <div className="col-span-1">Chars</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {filtered.map((gen) => (
              <div
                key={gen.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 px-4 py-3.5 hover:bg-white/[0.02] transition-colors items-center"
              >
                <div className="sm:col-span-5 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AudioLines className="w-3 h-3 text-purple-400" />
                  </div>
                  <p className="text-sm text-white/80 line-clamp-2 leading-relaxed">
                    {gen.text.length > 80 ? gen.text.substring(0, 80) + '...' : gen.text}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-xs text-white/50">{gen.voice.displayName}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      gen.voice.language === 'KHMER' ? 'bg-amber-500/15 text-amber-400' :
                      gen.voice.language === 'ENGLISH' ? 'bg-blue-500/15 text-blue-400' :
                      'bg-purple-500/15 text-purple-400'
                    }`}>
                      {gen.voice.language.charAt(0) + gen.voice.language.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>
                <div className="sm:col-span-1 text-xs text-white/40">
                  {gen.charactersUsed.toLocaleString()}
                </div>
                <div className="sm:col-span-2 text-xs text-white/40">
                  {format(new Date(gen.createdAt), 'MMM d, yyyy')}
                  <div className="text-white/20">{format(new Date(gen.createdAt), 'HH:mm')}</div>
                </div>
                <div className="sm:col-span-2 flex items-center justify-end gap-1.5">
                  {gen.audioUrl && (
                    <button
                      onClick={() => handleDownload(gen.audioUrl, gen.id)}
                      className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(gen.id)}
                    className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/[0.08] transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
