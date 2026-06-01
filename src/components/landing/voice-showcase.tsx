'use client'

import { useState } from 'react'
import { Play, Square, User } from 'lucide-react'

const voices = [
  {
    id: '1',
    name: 'Channary',
    language: 'Khmer',
    gender: 'Female',
    accent: 'Phnom Penh',
    description: 'Warm & Expressive',
    tags: ['Storytelling', 'Education'],
    avatar: 'C',
    color: 'from-pink-500 to-rose-500',
    flag: '🇰🇭',
  },
  {
    id: '2',
    name: 'Sovannara',
    language: 'Khmer',
    gender: 'Male',
    accent: 'Standard Khmer',
    description: 'Professional & Clear',
    tags: ['News', 'Narration'],
    avatar: 'S',
    color: 'from-blue-500 to-cyan-500',
    flag: '🇰🇭',
  },
  {
    id: '3',
    name: 'Bopha',
    language: 'Khmer',
    gender: 'Female',
    accent: 'Standard Khmer',
    description: 'Friendly & Casual',
    tags: ['Customer Service'],
    avatar: 'B',
    color: 'from-purple-500 to-violet-500',
    flag: '🇰🇭',
  },
  {
    id: '4',
    name: 'Sophia',
    language: 'English',
    gender: 'Female',
    accent: 'British',
    description: 'Clear & Natural',
    tags: ['Education', 'Podcasts'],
    avatar: 'S',
    color: 'from-emerald-500 to-teal-500',
    flag: '🇬🇧',
  },
  {
    id: '5',
    name: 'James',
    language: 'English',
    gender: 'Male',
    accent: 'American',
    description: 'Deep & Authoritative',
    tags: ['Narration', 'Corporate'],
    avatar: 'J',
    color: 'from-amber-500 to-orange-500',
    flag: '🇺🇸',
  },
  {
    id: '6',
    name: 'Sreymom',
    language: 'Bilingual',
    gender: 'Female',
    accent: 'Khmer-English',
    description: 'Versatile & Natural',
    tags: ['Bilingual', 'Versatile'],
    avatar: 'Sr',
    color: 'from-fuchsia-500 to-pink-500',
    flag: '🏳️',
  },
]

function VoiceCard({ voice }: { voice: typeof voices[0] }) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="group relative p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${voice.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
        >
          {voice.avatar}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white">{voice.name}</span>
            <span className="text-sm">{voice.flag}</span>
          </div>
          <p className="text-xs text-white/40 mb-2">{voice.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            <span
              className={`px-2 py-0.5 rounded-full text-xs border ${
                voice.language === 'Khmer'
                  ? 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                  : voice.language === 'English'
                  ? 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                  : 'border-purple-500/30 text-purple-400 bg-purple-500/10'
              }`}
            >
              {voice.language}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs border border-white/10 text-white/40">
              {voice.gender}
            </span>
            {voice.tags.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-xs border border-white/10 text-white/40"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mini waveform */}
      <div className="flex items-center gap-3 mt-3 p-3 rounded-xl bg-white/5">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
            isPlaying ? 'bg-white/20' : `bg-gradient-to-br ${voice.color}`
          }`}
        >
          {isPlaying ? (
            <Square className="w-3 h-3 text-white" />
          ) : (
            <Play className="w-3 h-3 text-white ml-0.5" />
          )}
        </button>
        <div className="flex-1 flex items-center gap-0.5 h-6">
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className="flex-1 rounded-full"
              style={{
                height: `${20 + Math.sin(i * 0.8) * 60}%`,
                background: isPlaying
                  ? `linear-gradient(to top, ${voice.color.includes('pink') ? '#ec4899' : voice.color.includes('blue') ? '#3b82f6' : '#a855f7'}, transparent)`
                  : 'rgba(255,255,255,0.15)',
                animation: isPlaying ? `waveform ${0.8 + (i % 4) * 0.2}s ease-in-out infinite` : 'none',
                animationDelay: `${i * 50}ms`,
              }}
            />
          ))}
        </div>
        <span className="text-xs text-white/30 flex-shrink-0">Preview</span>
      </div>
    </div>
  )
}

export function VoiceShowcase() {
  const [filter, setFilter] = useState<'All' | 'Khmer' | 'English' | 'Bilingual'>('All')

  const filtered = filter === 'All' ? voices : voices.filter((v) => v.language === filter)

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 mb-4">
            <User className="w-3 h-3 text-purple-400" />
            VOICE LIBRARY
          </div>
          <h2 className="text-4xl sm:text-5xl font-display text-white mb-4">
            Meet your AI <span className="gradient-text">voice cast</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-8">
            Hand-crafted AI voices optimized for Khmer and English content.
          </p>

          {/* Filter pills */}
          <div className="flex justify-center gap-2 flex-wrap">
            {(['All', 'Khmer', 'English', 'Bilingual'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === f
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((voice) => (
            <VoiceCard key={voice.id} voice={voice} />
          ))}
        </div>
      </div>
    </section>
  )
}
