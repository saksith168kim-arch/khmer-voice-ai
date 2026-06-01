'use client'

import { useState } from 'react'
import { Play, Pause, Search } from 'lucide-react'
import type { Voice } from '@prisma/client'

const LANG_COLORS: Record<string, string> = {
  KHMER: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  ENGLISH: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  BILINGUAL: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
}

const AVATAR_COLORS = [
  'from-pink-500 to-rose-500',
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-violet-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-fuchsia-500 to-pink-500',
]

export function VoiceLibraryClient({ voices }: { voices: Voice[] }) {
  const [search, setSearch] = useState('')
  const [langFilter, setLangFilter] = useState('All')
  const [genderFilter, setGenderFilter] = useState('All')
  const [playingId, setPlayingId] = useState<string | null>(null)

  const filtered = voices.filter((v) => {
    const matchSearch = v.displayName.toLowerCase().includes(search.toLowerCase()) ||
      (v.description || '').toLowerCase().includes(search.toLowerCase())
    const matchLang = langFilter === 'All' || v.language === langFilter
    const matchGender = genderFilter === 'All' || v.gender === genderFilter
    return matchSearch && matchLang && matchGender
  })

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search voices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/40"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'KHMER', 'ENGLISH', 'BILINGUAL'].map((l) => (
            <button
              key={l}
              onClick={() => setLangFilter(l)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${langFilter === l ? 'bg-white text-black' : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08]'}`}
            >
              {l === 'All' ? 'All' : l.charAt(0) + l.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['All', 'MALE', 'FEMALE'].map((g) => (
            <button
              key={g}
              onClick={() => setGenderFilter(g)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${genderFilter === g ? 'bg-white text-black' : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08]'}`}
            >
              {g === 'All' ? 'All' : g.charAt(0) + g.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-white/30">{filtered.length} voices</p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((voice, i) => (
          <div
            key={voice.id}
            className="group p-5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-white/15 hover:bg-white/[0.06] transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                {voice.displayName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white">{voice.displayName}</p>
                <p className="text-xs text-white/40">{voice.accent || 'Standard accent'}</p>
              </div>
              {voice.isFeatured && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/15 text-purple-400 border border-purple-500/20">
                  Featured
                </span>
              )}
            </div>

            {voice.description && (
              <p className="text-xs text-white/50 mb-3 leading-relaxed">{voice.description}</p>
            )}

            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className={`px-2 py-0.5 rounded-full text-xs border ${LANG_COLORS[voice.language] || 'bg-white/5 text-white/40 border-white/10'}`}>
                {voice.language.charAt(0) + voice.language.slice(1).toLowerCase()}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-white/40 border border-white/[0.08]">
                {voice.gender.charAt(0) + voice.gender.slice(1).toLowerCase()}
              </span>
              {voice.provider && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-white/30 border border-white/[0.08]">
                  {voice.provider}
                </span>
              )}
            </div>

            {/* Waveform preview */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-black/20">
              <button
                onClick={() => setPlayingId(playingId === voice.id ? null : voice.id)}
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  playingId === voice.id
                    ? 'bg-white/20'
                    : `bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`
                }`}
              >
                {playingId === voice.id
                  ? <Pause className="w-3 h-3 text-white" />
                  : <Play className="w-3 h-3 text-white ml-0.5" />
                }
              </button>
              <div className="flex-1 flex items-center gap-[2px] h-6">
                {Array.from({ length: 28 }, (_, j) => (
                  <div
                    key={j}
                    className="flex-1 rounded-full"
                    style={{
                      minHeight: '2px',
                      height: `${15 + Math.abs(Math.sin(j * 0.9 + i)) * 80}%`,
                      background: playingId === voice.id
                        ? 'rgba(168,85,247,0.7)'
                        : 'rgba(255,255,255,0.12)',
                      animation: playingId === voice.id
                        ? `waveform ${0.7 + (j % 4) * 0.15}s ease-in-out infinite`
                        : 'none',
                      animationDelay: `${j * 35}ms`,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-white/25 flex-shrink-0">
                {voice.sampleAudioUrl ? 'Preview' : 'Demo'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <p>No voices match your filters</p>
        </div>
      )}
    </div>
  )
}
