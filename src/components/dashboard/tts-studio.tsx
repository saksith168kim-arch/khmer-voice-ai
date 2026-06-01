'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import {
  Wand2, Play, Pause, Download, Link2,
  Share2, ChevronDown, Mic2, Sliders,
  Volume2, AudioLines, AlertCircle
} from 'lucide-react'
import type { Voice } from '@prisma/client'

interface TTSStudioProps {
  voices: Voice[]
}

const LANGUAGE_FILTERS = ['All', 'KHMER', 'ENGLISH', 'BILINGUAL'] as const

export function TTSStudio({ voices }: TTSStudioProps) {
  const [text, setText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(voices[0] || null)
  const [langFilter, setLangFilter] = useState<typeof LANGUAGE_FILTERS[number]>('All')
  const [speed, setSpeed] = useState(1.0)
  const [pitch, setPitch] = useState(1.0)
  const [format, setFormat] = useState<'mp3' | 'wav'>('mp3')
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const filteredVoices = langFilter === 'All'
    ? voices
    : voices.filter((v) => v.language === langFilter)

  const MAX_CHARS = 5000
  const charCount = text.length

  const handleGenerate = async () => {
    if (!text.trim() || !selectedVoice) return
    if (charCount > MAX_CHARS) {
      toast.error(`Text too long. Max ${MAX_CHARS} characters.`)
      return
    }

    setIsGenerating(true)
    setAudioUrl(null)

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId: selectedVoice.id,
          speed,
          pitch,
          format,
          language: selectedVoice.language.toLowerCase(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed')
      }

      setAudioUrl(data.data.audioUrl)
      setGenerationId(data.data.generationId)
      toast.success('Speech generated successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate speech')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePlayPause = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleDownload = async () => {
    if (!audioUrl) return
    const a = document.createElement('a')
    a.href = audioUrl
    a.download = `khmervoiceai-${Date.now()}.${format}`
    a.click()
  }

  const handleCopyUrl = async () => {
    if (!audioUrl) return
    await navigator.clipboard.writeText(audioUrl)
    toast.success('URL copied to clipboard')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display text-white">Text to Speech</h1>
        <p className="text-white/40 text-sm mt-1">Convert your text into natural AI speech</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* Text editor */}
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
              <span className="text-xs text-white/40 font-medium uppercase tracking-wider">Input Text</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setText('')}
                  className="text-xs text-white/30 hover:text-white/60 transition-colors"
                >
                  Clear
                </button>
                <span className={`text-xs font-mono ${charCount > MAX_CHARS * 0.9 ? 'text-red-400' : charCount > MAX_CHARS * 0.7 ? 'text-amber-400' : 'text-white/30'}`}>
                  {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                </span>
              </div>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              placeholder={`Type or paste your text here...\n\nYou can write in:\n• English — Natural, clear speech\n• ខ្មែរ — Native Khmer pronunciation\n• Mixed — Bilingual content`}
              className="w-full bg-transparent p-4 text-white placeholder-white/20 text-sm resize-none focus:outline-none leading-relaxed"
            />
            {/* Character bar */}
            <div className="px-4 pb-3">
              <div className="h-0.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${charCount > MAX_CHARS * 0.9 ? 'bg-red-500' : 'bg-purple-500'}`}
                  style={{ width: `${Math.min((charCount / MAX_CHARS) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim() || !selectedVoice || charCount > MAX_CHARS}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              isGenerating || !text.trim() || !selectedVoice || charCount > MAX_CHARS
                ? 'bg-white/[0.04] text-white/30 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating with {selectedVoice?.displayName}...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate Speech
                {selectedVoice && (
                  <span className="opacity-70">— {selectedVoice.displayName}</span>
                )}
              </>
            )}
          </button>

          {/* Audio player */}
          {audioUrl && (
            <div className="rounded-xl bg-white/[0.03] border border-purple-500/20 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400 font-medium">Ready to play</span>
              </div>

              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />

              {/* Waveform visualization */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={handlePlayPause}
                  className="w-11 h-11 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center flex-shrink-0 transition-colors"
                >
                  {isPlaying
                    ? <Pause className="w-4 h-4 text-white" />
                    : <Play className="w-4 h-4 text-white ml-0.5" />
                  }
                </button>
                <div className="flex-1 flex items-center gap-[3px] h-10">
                  {Array.from({ length: 40 }, (_, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-full transition-all"
                      style={{
                        minHeight: '3px',
                        height: `${15 + Math.abs(Math.sin(i * 0.7 + i * 0.3)) * 85}%`,
                        background: isPlaying
                          ? 'linear-gradient(to top, #a855f7, #3b82f6)'
                          : 'rgba(255,255,255,0.15)',
                        animation: isPlaying ? `waveform ${0.6 + (i % 5) * 0.15}s ease-in-out infinite` : 'none',
                        animationDelay: `${i * 30}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/70 hover:text-white text-sm font-medium transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download {format.toUpperCase()}
                </button>
                <button
                  onClick={handleCopyUrl}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/70 hover:text-white text-sm font-medium transition-all"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  Copy URL
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/70 hover:text-white text-sm font-medium transition-all">
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings panel */}
        <div className="space-y-4">
          {/* Voice selector */}
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.07]">
              <span className="text-xs text-white/40 font-medium uppercase tracking-wider">Voice</span>
            </div>

            {/* Language filter */}
            <div className="flex gap-1.5 p-3 border-b border-white/[0.07] flex-wrap">
              {LANGUAGE_FILTERS.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLangFilter(lang)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    langFilter === lang
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {lang === 'All' ? 'All' : lang.charAt(0) + lang.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            <div className="p-2 max-h-64 overflow-y-auto space-y-1">
              {filteredVoices.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${
                    selectedVoice?.id === voice.id
                      ? 'bg-purple-600/15 border border-purple-500/20 text-white'
                      : 'hover:bg-white/[0.04] text-white/60 hover:text-white'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {voice.displayName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{voice.displayName}</p>
                    <p className="text-xs opacity-50 truncate">
                      {voice.language.charAt(0) + voice.language.slice(1).toLowerCase()} • {voice.gender.charAt(0) + voice.gender.slice(1).toLowerCase()}
                    </p>
                  </div>
                  {selectedVoice?.id === voice.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Voice settings */}
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] overflow-hidden">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors"
            >
              <span className="text-xs text-white/40 font-medium uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-3 h-3" />
                Voice Settings
              </span>
              <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
            </button>

            {showSettings && (
              <div className="px-4 pb-4 space-y-5 border-t border-white/[0.07] pt-4">
                {/* Speed */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs text-white/50">Speed</label>
                    <span className="text-xs text-white/70 font-mono">{speed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-white/20 mt-1">
                    <span>0.5x</span><span>1.0x</span><span>2.0x</span>
                  </div>
                </div>

                {/* Pitch */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs text-white/50">Pitch</label>
                    <span className="text-xs text-white/70 font-mono">{pitch.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    value={pitch}
                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-white/20 mt-1">
                    <span>Low</span><span>Normal</span><span>High</span>
                  </div>
                </div>

                {/* Format */}
                <div>
                  <label className="text-xs text-white/50 block mb-2">Output Format</label>
                  <div className="flex gap-2">
                    {(['mp3', 'wav'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setFormat(fmt)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                          format === fmt
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08]'
                        }`}
                      >
                        {fmt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset */}
                <button
                  onClick={() => { setSpeed(1.0); setPitch(1.0) }}
                  className="text-xs text-white/30 hover:text-white/60 transition-colors w-full text-center"
                >
                  Reset to defaults
                </button>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-amber-400 mb-1">Pro Tips</p>
                <ul className="text-xs text-white/40 space-y-1">
                  <li>• Add punctuation for natural pauses</li>
                  <li>• Use commas for short pauses</li>
                  <li>• Ellipsis... adds dramatic pause</li>
                  <li>• Khmer script renders automatically</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
