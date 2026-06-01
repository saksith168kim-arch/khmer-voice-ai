'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Play, Square, Download, Sparkles, ChevronDown, Volume2, Wand2 } from 'lucide-react'

const DEMO_VOICES = [
  { id: '1', name: 'Channary', language: 'Khmer', gender: 'Female', flag: '🇰🇭' },
  { id: '2', name: 'Sovannara', language: 'Khmer', gender: 'Male', flag: '🇰🇭' },
  { id: '3', name: 'Sophia', language: 'English', gender: 'Female', flag: '🇬🇧' },
  { id: '4', name: 'James', language: 'English', gender: 'Male', flag: '🇺🇸' },
]

const DEMO_TEXTS = {
  Khmer: 'សូមស្វាគមន៍មកកាន់ Khmer Voice AI ដែលជាបច្ចេកវិទ្យាបំប្លែងអក្សរជាសម្លេងដ៏ទំនើបបំផុត',
  English: 'Welcome to Khmer Voice AI. Experience the most advanced text-to-speech technology with natural-sounding voices.',
}

function WaveformVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const bars = Array.from({ length: 32 }, (_, i) => i)
  return (
    <div className="flex items-center gap-[3px] h-10">
      {bars.map((i) => (
        <div
          key={i}
          className={`waveform-bar w-1 ${isPlaying ? 'bg-purple-400' : 'bg-white/20'}`}
          style={{
            height: isPlaying ? `${Math.random() * 100}%` : '20%',
            animationDelay: `${(i * 40) % 1200}ms`,
            animationPlayState: isPlaying ? 'running' : 'paused',
            minHeight: '4px',
          }}
        />
      ))}
    </div>
  )
}

export function HeroSection() {
  const [text, setText] = useState(DEMO_TEXTS.English)
  const [selectedVoice, setSelectedVoice] = useState(DEMO_VOICES[2])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)

  const handleGenerate = async () => {
    if (!text.trim()) return
    setIsGenerating(true)
    // Simulate generation
    await new Promise((r) => setTimeout(r, 1500))
    setIsGenerating(false)
    setIsGenerated(true)
  }

  const handleVoiceSelect = (voice: typeof DEMO_VOICES[0]) => {
    setSelectedVoice(voice)
    const lang = voice.language as keyof typeof DEMO_TEXTS
    if (DEMO_TEXTS[lang]) setText(DEMO_TEXTS[lang])
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4">
      {/* Floating badge */}
      <div className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full glass border border-purple-500/20 text-sm">
        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
        <span className="text-white/70">Powered by advanced AI • </span>
        <span className="text-purple-300 font-medium">Now with Khmer language support</span>
      </div>

      {/* Main headline */}
      <h1 className="text-center text-5xl sm:text-6xl lg:text-7xl font-display leading-[1.05] max-w-4xl mb-6">
        <span className="text-white">Convert Khmer & English</span>
        <br />
        <span className="text-white">Text Into </span>
        <span className="gradient-text">Natural AI Speech</span>
      </h1>

      <p className="text-center text-lg sm:text-xl text-white/50 max-w-2xl mb-12 leading-relaxed">
        Generate realistic AI voices with advanced Khmer language support. 
        Professional quality audio for content creators, educators, and developers.
      </p>

      {/* Live Demo Card */}
      <div className="w-full max-w-2xl">
        <div className="relative rounded-2xl overflow-hidden">
          {/* Card glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 to-blue-600/5 rounded-2xl" />
          <div className="absolute inset-[1px] rounded-2xl bg-[#0D1117]" />

          <div className="relative p-6 sm:p-8">
            {/* Voice selector */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {DEMO_VOICES.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => handleVoiceSelect(voice)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedVoice.id === voice.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{voice.flag}</span>
                  <span>{voice.name}</span>
                </button>
              ))}
            </div>

            {/* Text input */}
            <div className="relative mb-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Enter your text to convert to speech..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 text-sm resize-none focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all leading-relaxed"
              />
              <div className="absolute bottom-3 right-3 text-xs text-white/30">
                {text.length}/500
              </div>
            </div>

            {/* Generate button */}
            {!isGenerated ? (
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !text.trim()}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  isGenerating || !text.trim()
                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-900/30'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating speech...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate Speech — {selectedVoice.name}
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-3">
                {/* Audio player */}
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center flex-shrink-0 transition-colors"
                  >
                    {isPlaying ? (
                      <Square className="w-4 h-4 text-white" />
                    ) : (
                      <Play className="w-4 h-4 text-white ml-0.5" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <WaveformVisualizer isPlaying={isPlaying} />
                  </div>
                  <span className="text-xs text-white/40 flex-shrink-0">0:04</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsGenerated(false)}
                    className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium transition-all"
                  >
                    New Text
                  </button>
                  <button className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium transition-all flex items-center justify-center gap-2">
                    <Download className="w-3.5 h-3.5" />
                    Download MP3
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-white/40">
          <span>✓ No credit card required</span>
          <span>✓ 10,000 free characters</span>
          <span>✓ Instant generation</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-5 h-5 text-white/20" />
      </div>
    </section>
  )
}
